import { supabase } from "@/lib/supabase";

/** Called daily by the Vercel cron in vercel.json. Free Supabase projects pause after 7 days with no queries. */
export async function GET(): Promise<Response> {
  const { error } = await supabase.from("recipes").select("id").limit(1);
  return Response.json({ ok: !error }, { status: error ? 500 : 200 });
}
