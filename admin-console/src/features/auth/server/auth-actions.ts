"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isAdminRole } from "../../../shared/auth/admin-access";
import {
  ADMIN_COOKIE_OPTIONS,
  ADMIN_ROLE_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "../../../shared/auth/admin-session";
import { readAdminAuthAvailability } from "../../../shared/supabase/config";
import {
  createAdminServiceSupabaseClient,
  createAdminServerSupabaseClient,
} from "../../../shared/supabase/client";
import { isAdminRuntimeUnavailableError } from "../../../shared/data/admin-runtime-availability";
import { redirectAdminIfSessionExists } from "./access";

function redirectToLoginError(code: string): never {
  redirect(`/login?error=${code}`);
}

export async function signInAdminAction(formData: FormData) {
  const availability = readAdminAuthAvailability();
  if (!availability.available) {
    redirectToLoginError("auth_unavailable");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectToLoginError("missing_credentials");
  }

  try {
    const publicSupabase = await createAdminServerSupabaseClient();
    const authResult = await publicSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authResult.error || !authResult.data.user) {
      if (isAdminRuntimeUnavailableError(authResult.error)) {
        redirectToLoginError("auth_unavailable");
      }
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
      if (
        isAdminRuntimeUnavailableError(actorError) ||
        isAdminRuntimeUnavailableError(adminError)
      ) {
        redirectToLoginError("auth_unavailable");
      }
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
      ADMIN_COOKIE_OPTIONS,
    );
    store.delete(ADMIN_ROLE_COOKIE);

    redirect("/access-boundary");
  } catch (error) {
    if (isAdminRuntimeUnavailableError(error)) {
      redirectToLoginError("auth_unavailable");
    }
    throw error;
  }
}

export async function signOutAdminAction() {
  const store = await cookies();
  const supabase = await createAdminServerSupabaseClient();
  await supabase.auth.signOut();
  store.delete(ADMIN_SESSION_COOKIE);
  store.delete(ADMIN_ROLE_COOKIE);

  redirect("/login");
}

export { redirectAdminIfSessionExists };
