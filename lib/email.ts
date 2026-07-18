import { emailJsConfig, isEmailJsConfigured } from "./config";

export type ConfirmationPayload = {
  email: string;
  firstName: string;
  lastName: string;
  reservationCode: string;
};

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function reservationEmailHtml(payload: ConfirmationPayload) {
  const fullName = escapeHtml(`${payload.firstName} ${payload.lastName}`);
  const code = escapeHtml(payload.reservationCode);

  return `
    <div style="margin:0;padding:24px 12px;background:#f2f7f2;font-family:Arial,Helvetica,sans-serif;color:#173526;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;margin:0 auto;background:#ffffff;border-collapse:collapse;border-radius:18px;overflow:hidden;box-shadow:0 12px 36px rgba(15,74,42,.12);">
        <tr>
          <td style="padding:34px 32px;background:#064b29;color:#ffffff;">
            <div style="font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ff9d38;">Confirmation d’inscription</div>
            <h1 style="margin:12px 0 0;font-size:30px;line-height:1.12;color:#ffffff;">Journée du Comportement Durable</h1>
            <p style="margin:10px 0 0;font-size:16px;color:#dcecdf;">2ᵉ édition · 10 et 11 septembre 2026</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 18px;font-size:18px;line-height:1.55;">Bonjour <strong>${fullName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#486052;">Votre inscription est confirmée. Nous serons heureux de vous accueillir à Abidjan pour deux journées d’échanges autour du pouvoir des quartiers dans la transformation des comportements urbains durables.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f3f8f3;border-left:5px solid #ff7a00;border-radius:10px;">
              <tr><td style="padding:22px 24px;">
                <div style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#537060;">Code de réservation</div>
                <div style="margin-top:7px;font-size:27px;font-weight:800;letter-spacing:.04em;color:#064b29;">${code}</div>
              </td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:26px;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #dce8de;font-weight:700;width:120px;">Dates</td><td style="padding:10px 0;border-bottom:1px solid #dce8de;">10 et 11 septembre 2026</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #dce8de;font-weight:700;">Lieu</td><td style="padding:10px 0;border-bottom:1px solid #dce8de;">Abidjan, Côte d’Ivoire</td></tr>
              <tr><td style="padding:10px 0;font-weight:700;">Organisateur</td><td style="padding:10px 0;">Différence Group</td></tr>
            </table>
            <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#607466;">Conservez cet email et votre code de réservation. Pour toute question : <a href="mailto:assistante_event@differencegroup.info" style="color:#0a6338;font-weight:700;">assistante_event@differencegroup.info</a> · +225 27 22 30 83 48.</p>
          </td>
        </tr>
        <tr><td style="padding:20px 32px;background:#eef5ef;text-align:center;font-size:13px;color:#607466;">Un événement conçu et organisé par Différence Group.</td></tr>
      </table>
    </div>`;
}

async function requestEmail(payload: ConfirmationPayload) {
  return fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: emailJsConfig.serviceId,
      template_id: emailJsConfig.templateId,
      user_id: emailJsConfig.publicKey,
      accessToken: emailJsConfig.privateKey,
      template_params: {
        titre: "Confirmation d’inscription — Journée du Comportement Durable",
        email: payload.email,
        reply_to: "assistante_event@differencegroup.info",
        fiche: reservationEmailHtml(payload),
      },
    }),
  });
}

export async function sendConfirmationEmail(payload: ConfirmationPayload) {
  if (!isEmailJsConfigured) throw new Error("EMAILJS_NOT_CONFIGURED");

  let response = await requestEmail(payload);
  if (response.status === 429) {
    await delay(1100);
    response = await requestEmail(payload);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`EMAILJS_${response.status}:${detail.slice(0, 160)}`);
  }
}
