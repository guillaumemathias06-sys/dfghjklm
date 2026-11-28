import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized } from "@/lib/data/http";
import { syncBanque } from "@/lib/banque/sync";

export const maxDuration = 300;

export async function POST() {
  const u = await requireUser();
  if (!u) return unauthorized();
  const r = await syncBanque("manuel");
  return json(r, r.status === "failed" ? 502 : 200);
}
