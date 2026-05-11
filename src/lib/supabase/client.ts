import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://gezldjdsjmyyziutvnaz.supabase.co",
    "sb_publishable_QXRMTFdZjCM3ifvIjUP_Cw_3oFzvdPq"
  );
}
