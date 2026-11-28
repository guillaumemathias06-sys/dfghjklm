import { json } from "@/lib/data/http";
import { syncBanque } from "@/lib/banque/sync";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return json({ error: "unauthorized" }, 401);
  const r = await syncBanque("cron");
  return json(r, r.status === "failed" ? 502 : 200);
}
