import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized } from "@/lib/data/http";
import { syncPlaytomic } from "@/lib/playtomic/sync";

export const maxDuration = 300;

/** Synchronisation déclenchée à la main depuis les réglages. */
export async function POST() {
  const u = await requireUser();
  if (!u) return unauthorized();
  const result = await syncPlaytomic("manuel");
  return json(result, result.status === "failed" ? 502 : 200);
}
