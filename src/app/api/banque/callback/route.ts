import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireUser } from "@/lib/supabase/server";
import { syncBanque } from "@/lib/banque/sync";

export const maxDuration = 300;

/** Retour de la webview Powens : vérifie l'état, puis synchronise tout de suite les comptes. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const back = (s: string) => NextResponse.redirect(`${url.origin}/?banque=${encodeURIComponent(s)}#reglages`);
  const u = await requireUser();
  if (!u) return NextResponse.redirect(`${url.origin}/login`);
  const jar = await cookies();
  const expected = jar.get("banque_state")?.value;
  jar.delete("banque_state");
  if (!expected || url.searchParams.get("state") !== expected) return back("etat_invalide");
  const err = url.searchParams.get("error");
  if (err) return back(url.searchParams.get("error_description") || err);
  const r = await syncBanque("connexion");
  return back(r.status === "failed" ? r.error ?? "echec" : "connecte");
}
