import { parsePhoneNumberFromString } from "libphonenumber-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isEmailJsConfigured, isSupabaseConfigured } from "../../../lib/config";
import { sendConfirmationEmail } from "../../../lib/email";
import { getDataClient } from "../../../lib/supabase";
import { REGISTRATIONS_TABLE, SETTINGS_TABLE } from "../../../lib/tables";

const registrationSchema = z.object({
  nom: z.string().trim().min(2).max(80),
  prenom: z.string().trim().min(2).max(80),
  whatsapp: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(160),
  fonction: z.string().trim().min(2).max(120),
  entreprise: z.string().trim().min(2).max(160),
  consentement: z.literal(true),
  website: z.string().max(0).optional(),
});

function reservationCode() {
  return `JCD26-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isEmailJsConfigured) {
    return NextResponse.json(
      { ok: false, code: "INTEGRATION_UNAVAILABLE", message: "Les inscriptions en ligne seront ouvertes prochainement." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true, reservationCode: reservationCode(), emailStatus: "sent" }, { status: 201 });
  }

  const phone = parsePhoneNumberFromString(parsed.data.whatsapp, "CI");
  if (!phone?.isValid()) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", fields: { whatsapp: ["Numéro WhatsApp invalide."] } },
      { status: 422 },
    );
  }

  const client = getDataClient();
  if (!client) return NextResponse.json({ ok: false, code: "INTEGRATION_UNAVAILABLE" }, { status: 503 });

  const { data: settings } = await client
    .from(SETTINGS_TABLE)
    .select("registration_open")
    .eq("id", 1)
    .maybeSingle();

  if (settings?.registration_open === false) {
    return NextResponse.json(
      { ok: false, code: "REGISTRATION_CLOSED", message: "Les inscriptions sont actuellement fermées." },
      { status: 409 },
    );
  }

  const code = reservationCode();
  const email = parsed.data.email.toLowerCase();
  const { data: registration, error } = await client
    .from(REGISTRATIONS_TABLE)
    .insert({
      first_name: parsed.data.prenom,
      last_name: parsed.data.nom,
      whatsapp: phone.number,
      email,
      job_title: parsed.data.fonction,
      company: parsed.data.entreprise,
      consented_at: new Date().toISOString(),
      reservation_code: code,
      email_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { ok: false, code: "EMAIL_ALREADY_REGISTERED", message: "Cette adresse email est déjà inscrite." },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, code: "DATABASE_ERROR" }, { status: 500 });
  }

  let emailStatus: "sent" | "failed" = "sent";
  try {
    await sendConfirmationEmail({
      email,
      firstName: parsed.data.prenom,
      lastName: parsed.data.nom,
      reservationCode: code,
    });
    await client
      .from(REGISTRATIONS_TABLE)
      .update({ email_status: "sent", email_sent_at: new Date().toISOString(), email_error: null })
      .eq("id", registration.id);
  } catch (sendError) {
    emailStatus = "failed";
    await client
      .from(REGISTRATIONS_TABLE)
      .update({ email_status: "failed", email_error: String(sendError).slice(0, 240) })
      .eq("id", registration.id);
  }

  return NextResponse.json({ ok: true, reservationCode: code, emailStatus }, { status: 201 });
}
