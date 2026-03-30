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

function redirectToLoginError(code: string): never {
  redirect(`/login?error=${code}`);
}

export async function signInAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectToLoginError("missing_credentials");
  }

  const publicSupabase = createAdminPublicSupabaseClient();
  const authResult = await publicSupabase.auth.signInWithPassword({
    email,
    password,
  });

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
