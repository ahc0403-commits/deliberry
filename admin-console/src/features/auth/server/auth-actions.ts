"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isAdminRole } from "../../../shared/auth/admin-access";
import {
  ADMIN_ROLE_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "../../../shared/auth/admin-session";
import {
  createAdminPublicSupabaseClient,
  createAdminServiceSupabaseClient,
} from "../../../shared/supabase/client";
import { redirectAdminIfSessionExists } from "./access";

const DEMO_ADMIN_EMAIL = "admin@deliberry.com";
const DEMO_ADMIN_NAME = "Demo Admin";
const DEMO_ADMIN_ROLE = "platform_admin";

function redirectToLoginError(code: string): never {
  redirect(`/login?error=${code}`);
}

async function ensureHostedAdminIdentity(email: string, password: string): Promise<void> {
  if (email.toLowerCase() !== DEMO_ADMIN_EMAIL) {
    return;
  }

  const serviceSupabase = createAdminServiceSupabaseClient();
  const { data: listedUsers, error: listError } = await serviceSupabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (listError) {
    throw listError;
  }

  const existingUser =
    listedUsers.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;

  let finalUserId = existingUser?.id ?? null;
  if (finalUserId) {
    const { error: updateError } = await serviceSupabase.auth.admin.updateUserById(finalUserId, {
      password,
      email_confirm: true,
      user_metadata: {
        surface: "admin-console",
        mode: "hosted-supabase-admin",
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
    });

    if (updateError) {
      throw updateError;
    }
  } else {
    const { data: createdUser, error: createError } = await serviceSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        surface: "admin-console",
        mode: "hosted-supabase-admin",
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
    });

    if (createError || !createdUser.user) {
      throw createError ?? new Error("Failed to create admin auth user.");
    }

    finalUserId = createdUser.user.id;
  }

  const ensuredUserId = finalUserId ?? (() => {
    throw new Error("Admin auth user id missing after bootstrap.");
  })();

  const { error: actorError } = await serviceSupabase.from("actor_profiles").upsert(
    {
      id: ensuredUserId,
      actor_type: "admin",
      display_name: DEMO_ADMIN_NAME,
      email,
    },
    { onConflict: "id" },
  );

  if (actorError) {
    throw actorError;
  }

  const { error: adminError } = await serviceSupabase.from("admin_profiles").upsert(
    {
      actor_id: ensuredUserId,
      role: DEMO_ADMIN_ROLE,
      mfa_required: false,
    },
    { onConflict: "actor_id" },
  );

  if (adminError) {
    throw adminError;
  }
}

export async function signInAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectToLoginError("missing_credentials");
  }

  const publicSupabase = createAdminPublicSupabaseClient();
  let authResult = await publicSupabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authResult.error?.message === "Email not confirmed" || authResult.error?.status === 400) {
    try {
      await ensureHostedAdminIdentity(email, password);
      authResult = await publicSupabase.auth.signInWithPassword({
        email,
        password,
      });
    } catch {
      redirectToLoginError("auth_unavailable");
    }
  }

  if (authResult.error || !authResult.data.user) {
    redirectToLoginError("invalid_credentials");
  }

  const serviceSupabase = createAdminServiceSupabaseClient();
  const userId = authResult.data.user.id;

  const [
    { data: actorProfile, error: actorError },
    { data: adminProfile, error: adminError },
  ] = await Promise.all([
    serviceSupabase
      .from("actor_profiles")
      .select("display_name, actor_type")
      .eq("id", userId)
      .maybeSingle(),
    serviceSupabase
      .from("admin_profiles")
      .select("role")
      .eq("actor_id", userId)
      .maybeSingle(),
  ]);

  if (
    actorError ||
    adminError ||
    actorProfile?.actor_type !== "admin" ||
    !isAdminRole(adminProfile?.role ?? null)
  ) {
    redirectToLoginError("admin_profile_missing");
  }

  const store = await cookies();
  store.set(
    ADMIN_SESSION_COOKIE,
    JSON.stringify({
      adminId: userId,
      adminName: actorProfile.display_name,
      actorType: "admin",
      role: adminProfile!.role,
    }),
  );
  store.delete(ADMIN_ROLE_COOKIE);

  redirect("/access-boundary");
}

export async function signOutAdminAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  store.delete(ADMIN_ROLE_COOKIE);

  redirect("/login");
}

export { redirectAdminIfSessionExists };
