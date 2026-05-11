import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    "https://gezldjdsjmyyziutvnaz.supabase.co",
    "sb_secret_nKA-w56Nf_lh517JZHX1qg_53HInFIL",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
