import { createClient } from "@supabase/supabase-js";

// Check if running on server
if (typeof window !== "undefined") {
  throw new Error("SECURITY ALERT: supabase/admin must never be imported in client code.");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-airtech.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured: boolean =
  Boolean(rawUrl && !rawUrl.includes("placeholder") && rawKey && !rawKey.includes("placeholder"));

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
