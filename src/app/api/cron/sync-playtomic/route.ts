import { json } from "@/lib/data/http";
import { syncPlaytomic } from "@/lib/playtomic/sync";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/** Appelé par Vercel Cron (vercel.json) avec Authorization: Bearer CRON_SECRET. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return json({ error: "unauthorized" }, 401);
  const result = await syncPlaytomic("cron");
  return json(result, result.status === "failed" ? 502 : 200);
}
