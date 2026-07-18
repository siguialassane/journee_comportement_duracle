import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "../../../../lib/admin-auth";
import { getDataClient } from "../../../../lib/supabase";
import { SETTINGS_TABLE } from "../../../../lib/tables";

const settingsSchema = z.object({ registrationOpen: z.boolean() });

export async function PATCH(request: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });
  const client = getDataClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 503 });

  const { error } = await client.from(SETTINGS_TABLE).upsert({
    id: 1,
    registration_open: parsed.data.registrationOpen,
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
