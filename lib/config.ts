export const supabaseConfig = {
  url: process.env.SUPABASE_URL?.trim() ?? "",
  publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ?? "",
  secretKey: process.env.SUPABASE_SECRET_KEY?.trim() ?? "",
};

export const emailJsConfig = {
  serviceId: process.env.EMAILJS_SERVICE_ID?.trim() ?? "",
  templateId: process.env.EMAILJS_TEMPLATE_ID?.trim() ?? "",
  publicKey: process.env.EMAILJS_PUBLIC_KEY?.trim() ?? "",
  privateKey: process.env.EMAILJS_PRIVATE_KEY?.trim() ?? "",
};

export const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const isSupabaseConfigured = Boolean(
  supabaseConfig.url && supabaseConfig.publishableKey && supabaseConfig.secretKey,
);

export const isEmailJsConfigured = Boolean(
  emailJsConfig.serviceId &&
    emailJsConfig.templateId &&
    emailJsConfig.publicKey &&
    emailJsConfig.privateKey,
);
