import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseConfig } from "./config";

export function getDataClient() {
  if (!isSupabaseConfigured) return null;

  return createClient(supabaseConfig.url, supabaseConfig.secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export function getAuthClient() {
  if (!supabaseConfig.url || !supabaseConfig.publishableKey) return null;

  return createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
