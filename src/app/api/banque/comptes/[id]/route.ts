import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";

const schema = z.object({ structure: z.enum(["", "Association", "SARL"]) });

/** Rattache un compte bancaire à une structure (association ou SARL). */
export async function PUT(req: Request, ctx: RouteContext<"/api/banque/comptes/[id]">) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const { id } = await ctx.params;
  if (!/^\d{1,18}$/.test(id)) return bad("Identifiant invalide.");
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("Structure invalide.");
  const { error } = await u.supabase.from("banque_comptes").update({ structure: parsed.data.structure }).eq("id", Number(id));
  if (error) return fail(error.message);
  return json({ ok: true });
}
