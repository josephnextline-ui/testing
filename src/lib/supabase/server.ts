import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    "https://gezldjdsjmyyziutvnaz.supabase.co",
    "sb_publishable_QXRMTFdZjCM3ifvIjUP_Cw_3oFzvdPq",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — safe to ignore.
            // The middleware will handle refreshing cookies.
          }
        },
      },
    }
  );
}
