import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminEmails } from "./config";
import { getAuthClient } from "./supabase";

export const ACCESS_COOKIE = "jcd_admin_access";
export const REFRESH_COOKIE = "jcd_admin_refresh";

export async function getAdminUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const client = getAuthClient();

  if (!accessToken || !client) return null;

  const { data, error } = await client.auth.getUser(accessToken);
  const email = data.user?.email?.toLowerCase();

  if (error || !data.user || !email || !adminEmails.includes(email)) return null;
  return data.user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/connexion");
  return user;
}
