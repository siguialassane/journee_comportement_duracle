import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../../../../lib/admin-auth";
import { adminEmails, isSupabaseConfigured } from "../../../../lib/config";
import { getAuthClient } from "../../../../lib/supabase";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6).max(200) });

export async function POST(request: Request) {
  if (!isSupabaseConfigured || adminEmails.length === 0) {
    return NextResponse.json(
      { ok: false, message: "L'administration attend encore sa configuration Supabase." },
      { status: 503 },
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Identifiants invalides." }, { status: 422 });

  const email = parsed.data.email.toLowerCase();
  if (!adminEmails.includes(email)) {
    return NextResponse.json({ ok: false, message: "Ce compte n'est pas autorisé." }, { status: 403 });
  }

  const client = getAuthClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 503 });

  const { data, error } = await client.auth.signInWithPassword({ email, password: parsed.data.password });
  if (error || !data.session) {
    return NextResponse.json({ ok: false, message: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  cookieStore.set(ACCESS_COOKIE, data.session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: data.session.expires_in,
  });
  cookieStore.set(REFRESH_COOKIE, data.session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true });
}
