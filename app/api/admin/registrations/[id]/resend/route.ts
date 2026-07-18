import { NextResponse } from "next/server";
import { getAdminUser } from "../../../../../../lib/admin-auth";
import { sendConfirmationEmail } from "../../../../../../lib/email";
import { getDataClient } from "../../../../../../lib/supabase";
import { REGISTRATIONS_TABLE } from "../../../../../../lib/tables";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  const client = getDataClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 503 });

  const { data, error } = await client
    .from(REGISTRATIONS_TABLE)
    .select("id,email,first_name,last_name,reservation_code,email_status")
    .eq("id", id)
    .single();
  if (error || !data) return NextResponse.json({ ok: false }, { status: 404 });
  if (data.email_status === "sent") {
    return NextResponse.json({ ok: false, message: "La confirmation a déjà été envoyée." }, { status: 409 });
  }

  try {
    await sendConfirmationEmail({
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      reservationCode: data.reservation_code,
    });
    await client
      .from(REGISTRATIONS_TABLE)
      .update({ email_status: "sent", email_sent_at: new Date().toISOString(), email_error: null })
      .eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (sendError) {
    await client
      .from(REGISTRATIONS_TABLE)
      .update({ email_status: "failed", email_error: String(sendError).slice(0, 240) })
      .eq("id", id);
    return NextResponse.json({ ok: false, message: "L'email n'a pas pu être envoyé." }, { status: 502 });
  }
}
