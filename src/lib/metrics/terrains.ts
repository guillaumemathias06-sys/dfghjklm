/**
 * Calcul des fiches « Terrains » à partir des réservations Playtomic.
 * Pur : aucune base, aucun réseau. Heure locale Europe/Paris.
 *
 * Règles de la spécification appliquées ici :
 * - une source absente ou un dénominateur nul rend le résultat indisponible ;
 * - une donnée manquante n'est jamais transformée en zéro ;
 * - une heure ouverte sur plusieurs terrains compte plusieurs heures-terrain ;
 * - les usages qui se chevauchent sur un même terrain ne sont comptés qu'une fois.
 */

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export const WEEKDAYS: WeekdayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export type Horaires = Partial<Record<WeekdayKey, { open: string; close: string }>>;
export type Creneau = "journee" | "soiree" | "weekend";
export type Sport = "PADEL" | "TENNIS" | "FOOTBALL";

export interface Reglages {
  horaires: Horaires;
  debut_soiree: string;
  terrains: Partial<Record<string, number>>;
}

export interface BookingRow {
  booking_id: string;
  resource_id: string | null;
  resource_name?: string | null;
  sport_id: string | null;
  booking_type: string | null;
  start_at: string | null;
  end_at: string | null;
  price_amount: number | string | null;
  price_currency: string | null;
  is_canceled: boolean;
}

export type Metric =
  | { status: "ok" | "estimate"; value: number; unit: string; display: string; lines: string[]; periode?: string }
  | { status: "na"; reason: string };

/**
 * Locations de terrain par des joueurs (types documentés par l'API Playtomic) :
 * réservation ponctuelle ou récurrente, partie ouverte, match de ligue, open play.
 * Les autres types (cours, tournois) occupent le terrain sans être une location.
 */
export const LOCATION_TYPES = new Set(["REGULAR_BOOKING", "RECURRING_BOOKING", "OPEN_MATCH", "LEAGUE_MATCH", "OPEN_PLAY"]);
export const USAGE_LABEL: Record<string, string> = { PRIVATE_CLASS: "cours particuliers", COURSE_CLASS: "cours collectifs", PUBLIC_CLASS: "cours ouverts", TOURNAMENT: "tournois et animations" };

export type CauseFermeture = "pluie" | "humidite" | "chaleur" | "panne" | "autre";
export const CAUSES: Record<CauseFermeture, string> = { pluie: "pluie", humidite: "humidité", chaleur: "chaleur", panne: "panne", autre: "autre cause" };
export interface Fermeture {
  id: string;
  debut: string; // ISO
  fin: string; // ISO
  terrains: string[]; // resource_id ; vide = tous les terrains
  cause: CauseFermeture;
}
const FOOTBALL = new Set(["FOOTBALL", "FOOTBALL_OTHERS", "FOOTBALL7", "FUTSAL"]);
export function canonicalSport(id: string | null | undefined): string | null {
  if (!id) return null;
  return FOOTBALL.has(id) ? "FOOTBALL" : id;
}
export const SPORT_LABEL: Record<string, string> = { PADEL: "Padel", TENNIS: "Tennis", FOOTBALL: "Foot à 5" };

/* ---------- Heure locale ---------- */
const TZ = "Europe/Paris";
const partsFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
export function parisParts(iso: string): { date: string; min: number } {
  const p: Record<string, string> = {};
  for (const x of partsFmt.formatToParts(new Date(iso))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, min: Number(p.hour) * 60 + Number(p.minute) };
}
export function hm(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
}
function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function weekday(date: string): WeekdayKey {
  return WEEKDAYS[(new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7];
}
export function todayParis(now: Date = new Date()): string {
  return parisParts(now.toISOString()).date;
}

/* ---------- Périodes ---------- */
export type PeriodeId = "7j" | "28j" | "mois" | "mois-1";
export const PERIODES: Record<PeriodeId, string> = { "7j": "7 derniers jours", "28j": "28 derniers jours", mois: "Mois en cours", "mois-1": "Mois précédent" };
/** Jours complets seulement : la période s'arrête hier. Fin exclusive. */
export function resolvePeriode(id: PeriodeId, now: Date = new Date()): { debut: string; fin: string } {
  const today = todayParis(now);
  if (id === "7j") return { debut: addDays(today, -7), fin: today };
  if (id === "28j") return { debut: addDays(today, -28), fin: today };
  const first = `${today.slice(0, 8)}01`;
  if (id === "mois") return { debut: first, fin: today };
  const prevFirst = `${addDays(first, -1).slice(0, 8)}01`;
  return { debut: prevFirst, fin: first };
}
/** La période de même durée juste avant (mois précédent pour un mois). */
export function previousPeriode(id: PeriodeId, p: { debut: string; fin: string }): { debut: string; fin: string } {
  if (id === "mois-1" || id === "mois") {
    const prevFirst = `${addDays(p.debut, -1).slice(0, 8)}01`;
    if (id === "mois-1") return { debut: prevFirst, fin: p.debut };
    // Mois en cours jusqu'à hier : même nombre de jours au début du mois précédent.
    const days = Math.round((Date.parse(p.fin) - Date.parse(p.debut)) / 86_400_000);
    return { debut: prevFirst, fin: addDays(prevFirst, days) };
  }
  const days = Math.round((Date.parse(p.fin) - Date.parse(p.debut)) / 86_400_000);
  return { debut: addDays(p.debut, -days), fin: p.debut };
}

/* ---------- Plages ouvertes ---------- */
type Seg = [number, number];
/** Plages ouvertes d'un jour, restreintes au créneau demandé. */
export function openSegments(date: string, r: Reglages, creneau: Creneau | null): Seg[] {
  const wd = weekday(date);
  const h = r.horaires[wd];
  if (!h) return [];
  const open = hm(h.open);
  const close = h.close === "00:00" ? 1440 : hm(h.close);
  if (!(close > open)) return [];
  const weekend = wd === "sat" || wd === "sun";
  if (creneau === null) return [[open, close]];
  if (creneau === "weekend") return weekend ? [[open, close]] : [];
  if (weekend) return [];
  const soir = hm(r.debut_soiree);
  if (creneau === "journee") return open < Math.min(close, soir) ? [[open, Math.min(close, soir)]] : [];
  return Math.max(open, soir) < close ? [[Math.max(open, soir), close]] : [];
}
function overlap(a: Seg, b: Seg): number {
  return Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0]));
}
/** Découpe un intervalle en morceaux par jour local [date, début, fin], sur autant de jours qu'il dure. */
function piecesOf(startIso: string | null, endIso: string | null): { date: string; seg: Seg }[] {
  if (!startIso || !endIso || Date.parse(endIso) <= Date.parse(startIso)) return [];
  const s = parisParts(startIso);
  const e = parisParts(endIso);
  if (s.date === e.date) return [{ date: s.date, seg: [s.min, e.min] }];
  const out: { date: string; seg: Seg }[] = [{ date: s.date, seg: [s.min, 1440] }];
  for (let d = addDays(s.date, 1); d < e.date; d = addDays(d, 1)) out.push({ date: d, seg: [0, 1440] });
  if (e.min > 0) out.push({ date: e.date, seg: [0, e.min] });
  return out;
}
const localPieces = (b: BookingRow) => piecesOf(b.start_at, b.end_at);
function unionLength(segs: Seg[]): number {
  const sorted = segs.filter((x) => x[1] > x[0]).sort((a, b) => a[0] - b[0]);
  let total = 0;
  let cur: Seg | null = null;
  for (const s of sorted) {
    if (!cur || s[0] > cur[1]) {
      if (cur) total += cur[1] - cur[0];
      cur = [s[0], s[1]];
    } else cur[1] = Math.max(cur[1], s[1]);
  }
  if (cur) total += cur[1] - cur[0];
  return total;
}

/* ---------- Format ---------- */
const nf1 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const eur = (v: number, cur: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: cur, maximumFractionDigits: 2 }).format(v);
function h(min: number) {
  return `${nf1.format(min / 60)} h`;
}

/* ---------- Calcul ---------- */
export interface Scope {
  debut: string; // AAAA-MM-JJ inclus
  fin: string; // exclus
  sport: Sport | null;
  creneau: Creneau | null;
}

export interface Courts {
  bySport: Record<string, number>;
  source: Record<string, "reglage" | "playtomic">;
}
/** Terrains par sport : le réglage s'il est renseigné, sinon les terrains vus dans Playtomic. */
export function countCourts(all: BookingRow[], r: Reglages): Courts {
  const seen: Record<string, Set<string>> = {};
  for (const b of all) {
    const sp = canonicalSport(b.sport_id);
    if (!sp || !b.resource_id) continue;
    (seen[sp] ??= new Set()).add(b.resource_id);
  }
  const bySport: Record<string, number> = {};
  const source: Courts["source"] = {};
  for (const sp of new Set([...Object.keys(seen), ...Object.keys(r.terrains)])) {
    const configured = r.terrains[sp];
    if (typeof configured === "number" && configured > 0) {
      bySport[sp] = configured;
      source[sp] = "reglage";
    } else if (seen[sp]?.size) {
      bySport[sp] = seen[sp].size;
      source[sp] = "playtomic";
    }
  }
  return { bySport, source };
}

export function computeTerrains(all: BookingRow[], r: Reglages, scope: Scope, fermetures: Fermeture[] = []): Record<string, Metric> {
  const NA = (reason: string): Metric => ({ status: "na", reason });
  const courts = countCourts(all, r);
  const sports = scope.sport ? [scope.sport] : Object.keys(courts.bySport);
  const nbCourts = sports.reduce((s, sp) => s + (courts.bySport[sp] ?? 0), 0);
  const out: Record<string, Metric> = {};
  const hasHours = WEEKDAYS.some((d) => r.horaires[d]);

  // Capacité : heures ouvertes × terrains, jour par jour.
  const segsByDate = new Map<string, Seg[]>();
  for (let d = scope.debut; d < scope.fin; d = addDays(d, 1)) segsByDate.set(d, openSegments(d, r, scope.creneau));
  let openMin = 0;
  for (const segs of segsByDate.values()) for (const s of segs) openMin += s[1] - s[0];
  const capMin = openMin * nbCourts;

  // Réservations du périmètre (sport), découpées par jour local et ramenées aux plages ouvertes.
  const inSport = (b: BookingRow) => {
    const sp = canonicalSport(b.sport_id);
    return scope.sport ? sp === scope.sport : sp !== null && courts.bySport[sp] !== undefined;
  };
  const perCourtAll = new Map<string, Seg[]>();
  const perCourtLoc = new Map<string, Seg[]>();
  const perTypeOther = new Map<string, Map<string, Seg[]>>();
  let caAmount = 0;
  const currencies = new Set<string>();
  let caCount = 0;
  let missingPrice = 0;
  let locCount = 0;
  let locDurMin = 0;
  let canceled = 0;
  for (const b of all) {
    if (!inSport(b)) continue;
    const isLoc = LOCATION_TYPES.has(b.booking_type ?? "");
    const pieces = localPieces(b);
    if (!pieces.length) continue;
    const totalMin = pieces.reduce((s, p) => s + (p.seg[1] - p.seg[0]), 0);
    let inScopeMin = 0;
    for (const p of pieces) {
      // Hors période, hors horaires ou hors créneau : la partie ne compte pas.
      const segs = segsByDate.get(p.date);
      if (!segs) continue;
      for (const s of segs) {
        const ov = overlap(p.seg, s);
        if (ov <= 0) continue;
        inScopeMin += ov;
        if (!b.is_canceled) {
          const key = `${b.resource_id ?? b.booking_id}|${p.date}`;
          const seg: Seg = [Math.max(p.seg[0], s[0]), Math.min(p.seg[1], s[1])];
          (perCourtAll.get(key) ?? perCourtAll.set(key, []).get(key)!).push(seg);
          if (isLoc) (perCourtLoc.get(key) ?? perCourtLoc.set(key, []).get(key)!).push(seg);
          else {
            const ty = b.booking_type ?? "AUTRE";
            const m = perTypeOther.get(ty) ?? perTypeOther.set(ty, new Map()).get(ty)!;
            (m.get(key) ?? m.set(key, []).get(key)!).push(seg);
          }
        }
      }
    }
    if (!isLoc || inScopeMin <= 0) continue;
    // Une réservation entre dans le périmètre dès qu'une partie tombe dans le créneau choisi.
    if (b.is_canceled) {
      canceled++;
      continue;
    }
    locCount++;
    locDurMin += totalMin;
    const price = b.price_amount === null || b.price_amount === undefined ? null : Number(b.price_amount);
    if (price === null || !Number.isFinite(price) || !b.price_currency) missingPrice++;
    else {
      // Prix réparti au prorata des minutes dans le créneau choisi.
      caAmount += (price * inScopeMin) / totalMin;
      currencies.add(b.price_currency);
      caCount++;
    }
  }
  let usedMin = 0;
  for (const segs of perCourtAll.values()) usedMin += unionLength(segs);
  let reservedMin = 0;
  for (const segs of perCourtLoc.values()) reservedMin += unionLength(segs);
  const otherMin = usedMin - reservedMin;
  const otherByType = [...perTypeOther.entries()]
    .map(([ty, m]) => [USAGE_LABEL[ty] ?? ty.toLowerCase(), [...m.values()].reduce((s, segs) => s + unionLength(segs), 0)] as const)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  // Registre des fermetures : chaque minute de chaque terrain n'est comptée qu'une fois,
  // et attribuée à la première fermeture saisie qui la couvre.
  const courtsInScope = new Map<string, string>(); // resource_id -> sport
  for (const b of all) {
    const sp = canonicalSport(b.sport_id);
    if (b.resource_id && sp && (scope.sport ? sp === scope.sport : courts.bySport[sp] !== undefined)) courtsInScope.set(b.resource_id, sp);
  }
  const causeList = Object.keys(CAUSES) as CauseFermeture[];
  const closedMinutes: Record<CauseFermeture, number> = { pluie: 0, humidite: 0, chaleur: 0, panne: 0, autre: 0 };
  const closedByCourtDay = new Map<string, Uint8Array>();
  let closuresInPeriod = 0;
  for (const f of fermetures) {
    const targets = f.terrains.length ? f.terrains.filter((id) => courtsInScope.has(id)) : [...courtsInScope.keys()];
    let touched = false;
    for (const p of piecesOf(f.debut, f.fin)) {
      const segs = segsByDate.get(p.date);
      if (!segs) continue;
      for (const s of segs) {
        const a = Math.max(p.seg[0], s[0]);
        const z = Math.min(p.seg[1], s[1]);
        if (z <= a) continue;
        touched = true;
        for (const court of targets) {
          const key = `${court}|${p.date}`;
          const arr = closedByCourtDay.get(key) ?? closedByCourtDay.set(key, new Uint8Array(1440)).get(key)!;
          for (let m = a; m < z; m++) {
            if (arr[m]) continue;
            arr[m] = causeList.indexOf(f.cause) + 1;
            closedMinutes[f.cause]++;
          }
        }
      }
    }
    if (touched) closuresInPeriod++;
  }
  const lostMin = Math.min(capMin, causeList.reduce((s, c) => s + closedMinutes[c], 0));
  // Réservations annulées qui chevauchent une fermeture sur le même terrain (dédupliquées).
  const affected = new Set<string>();
  if (closedByCourtDay.size) {
    for (const b of all) {
      if (!b.is_canceled || !b.resource_id || !courtsInScope.has(b.resource_id)) continue;
      for (const p of localPieces(b)) {
        const arr = closedByCourtDay.get(`${b.resource_id}|${p.date}`);
        if (!arr) continue;
        let hit = false;
        for (let m = p.seg[0]; m < p.seg[1]; m++) if (arr[m]) { hit = true; break; }
        if (hit) { affected.add(b.booking_id); break; }
      }
    }
  }

  const noCourts = nbCourts === 0 ? "Aucun terrain connu pour ce périmètre : renseignez les terrains dans les réglages ou attendez une première synchronisation." : null;
  const noHours = !hasHours ? "Horaires d'ouverture non renseignés : complétez-les dans les réglages." : null;
  const registreActif = fermetures.length > 0;
  const closures = registreActif
    ? `Registre des fermetures : ${closuresInPeriod} fermeture(s) sur la période, ${h(lostMin)} de terrain perdues.`
    : "Hypothèse : aucune fermeture déduite (registre des fermetures encore vide).";
  const closedStatus = registreActif ? "ok" : "estimate";
  const playMin = capMin - lostMin;
  const capLine = `${nbCourts} terrain(s) × ${h(openMin)} d'ouverture sur la période.`;

  if (noCourts || noHours) out.capacite = NA((noCourts ?? noHours)!);
  else out.capacite = { status: "ok", value: capMin / 60, unit: "h", display: h(capMin), lines: [capLine] };

  const capOk = !noCourts && !noHours && capMin > 0;
  out.jouables = capOk ? { status: closedStatus, value: playMin / 60, unit: "h", display: h(playMin), lines: [`Capacité ${h(capMin)} − ${h(lostMin)} fermées.`, closures] } : NA(noCourts ?? noHours ?? "Aucune heure ouverte sur cette période et ce créneau.");
  const louMin = playMin - otherMin;
  const otherLine = otherByType.length ? `Dont ${otherByType.map(([l, v]) => `${l} ${h(v)}`).join(", ")}.` : "Aucun cours ni tournoi enregistré dans Playtomic sur ce périmètre.";
  out.louables = capOk
    ? { status: closedStatus, value: louMin / 60, unit: "h", display: h(louMin), lines: [`Heures jouables ${h(playMin)} − ${h(otherMin)} réservées aux cours, tournois et animations dans Playtomic.`, otherLine, closures] }
    : out.jouables;
  out.reservees = { status: "ok", value: reservedMin / 60, unit: "h", display: h(reservedMin), lines: [`${locCount} location(s) confirmées (réservations ponctuelles et récurrentes, parties ouvertes), comptées par date de jeu dans les heures d'ouverture, sans double comptage sur un même terrain.`] };
  if (!hasHours) out.reservees = NA(noHours!);

  if (!capOk || louMin <= 0) out.occupation = NA(capOk ? "Aucune heure proposée à la location sur ce périmètre : dénominateur nul." : (out.jouables as { reason: string }).reason);
  else out.occupation = { status: closedStatus, value: (reservedMin / louMin) * 100, unit: "%", display: `${nf1.format((reservedMin / louMin) * 100)} %`, lines: [`${h(reservedMin)} réservées ÷ ${h(louMin)} proposées à la location.`, closures] };

  if (!capOk) out.usage = out.jouables;
  else if (playMin <= 0) out.usage = NA("Toutes les heures du périmètre sont fermées : dénominateur nul.");
  else out.usage = { status: closedStatus, value: (usedMin / playMin) * 100, unit: "%", display: `${nf1.format((usedMin / playMin) * 100)} %`, lines: [`${h(usedMin)} utilisées, tous usages Playtomic confondus et sans double comptage, ÷ ${h(playMin)} jouables.`, `Locations ${h(reservedMin)}. ${otherLine}`, closures] };

  if (!capOk) out.vides = out.jouables;
  else out.vides = { status: closedStatus, value: (louMin - reservedMin) / 60, unit: "h", display: h(Math.max(0, louMin - reservedMin)), lines: [`${h(louMin)} proposées − ${h(reservedMin)} réservées.`, "Les absences aux réservations ne sont pas encore relevées.", closures] };

  const priceLine = missingPrice ? `${missingPrice} réservation(s) sans prix exploitable, exclues du CA.` : null;
  const caLine = "CA : prix des réservations Playtomic, réparti au prorata des minutes du créneau. Ce n'est pas le CA comptable net (remises, remboursements et crédits prépayés non rapprochés).";
  if (currencies.size > 1) {
    out["prix-heure"] = NA("Plusieurs devises dans les prix : aucun total n'est calculé.");
    out["revenu-heure"] = out["prix-heure"];
  } else {
    const cur = [...currencies][0] ?? "EUR";
    if (caCount === 0 || reservedMin <= 0) out["prix-heure"] = NA(locCount === 0 ? "Aucune location confirmée sur ce périmètre : dénominateur nul." : "Aucun prix exploitable sur les locations de ce périmètre.");
    else out["prix-heure"] = { status: "ok", value: caAmount / (reservedMin / 60), unit: "€/h", display: `${eur(caAmount / (reservedMin / 60), cur)}/h`, lines: [`${eur(caAmount, cur)} ÷ ${h(reservedMin)} de location vendues.`, caLine, ...(priceLine ? [priceLine] : [])] };
    if (caCount === 0 || !capOk || louMin <= 0) out["revenu-heure"] = NA(!capOk ? (out.jouables as { reason: string }).reason : louMin <= 0 ? "Aucune heure proposée à la location : dénominateur nul." : "Aucun prix exploitable sur les locations de ce périmètre.");
    else out["revenu-heure"] = { status: closedStatus, value: caAmount / (louMin / 60), unit: "€/h", display: `${eur(caAmount / (louMin / 60), cur)}/h`, lines: [`${eur(caAmount, cur)} ÷ ${h(louMin)} proposées à la location.`, caLine, closures, ...(priceLine ? [priceLine] : [])] };
  }

  if (locCount === 0) out.duree = NA("Aucune location confirmée sur ce périmètre.");
  else out.duree = { status: "ok", value: locDurMin / 60 / locCount, unit: "h", display: `${nf1.format(locDurMin / 60 / locCount)} h`, lines: [`${h(locDurMin)} au total ÷ ${locCount} réservation(s) confirmées (durée complète de chaque réservation).`] };

  const totalLoc = locCount + canceled;
  if (totalLoc === 0) out.annulations = NA("Aucune réservation de location sur ce périmètre.");
  else out.annulations = { status: "ok", value: canceled, unit: "nombre / %", display: `${nf0.format(canceled)} · ${nf1.format((canceled / totalLoc) * 100)} %`, lines: [`${canceled} annulée(s) sur ${totalLoc} réservation(s) de location du périmètre.`, "Motifs d'annulation non fournis par Playtomic."] };

  // Fermetures (registre saisi dans l'application).
  if (!capOk) out.perdues = out.jouables;
  else if (!registreActif) out.perdues = NA("Registre des fermetures vide : saisissez les fermetures (pluie, humidité, chaleur, panne…) dans Réglages.");
  else
    out.perdues = {
      status: "ok",
      value: lostMin / 60,
      unit: "h",
      display: h(lostMin),
      lines: [
        `${closuresInPeriod} fermeture(s) enregistrée(s) sur la période, chaque heure de terrain comptée une seule fois.`,
        ...causeList.filter((c) => closedMinutes[c] > 0).map((c) => `${CAUSES[c]} : ${h(closedMinutes[c])}`),
      ],
    };
  if (!capOk) out.affectees = out.jouables;
  else if (!registreActif) out.affectees = NA("Registre des fermetures vide : aucune réservation ne peut être rapprochée d'une fermeture.");
  else
    out.affectees = {
      status: "estimate",
      value: affected.size,
      unit: "nombre",
      display: nf0.format(affected.size),
      lines: ["Réservations Playtomic annulées dont le créneau chevauche une fermeture sur le même terrain, comptées une fois.", "Les réservations déplacées ne sont pas détectables : Playtomic ne relie pas l'ancienne et la nouvelle réservation."],
    };

  // Fiches que l'API Playtomic ne peut pas alimenter (documentation third-party.playtomic.io).
  out.anticipation = NA("L'API Playtomic ne fournit pas la date de création des réservations : le délai entre réservation et jeu n'est pas calculable.");
  out["absences-jeu"] = NA("L'API Playtomic ne fournit ni présence ni « no-show » : à relever à l'accueil.");
  out.refus = NA("L'API Playtomic ne fournit pas les demandes refusées faute de place : à relever à l'accueil.");
  out["marge-heure"] = NA("Coûts directs par prestation non reliés : la marge par heure-terrain reste indisponible.");
  return out;
}

/** Tendance d'une mesure en pourcentage : écart en points ; sinon écart relatif. */
export function trend(cur: Metric | undefined, prev: Metric | undefined): string | null {
  if (!cur || !prev || cur.status === "na" || prev.status === "na") return null;
  if (cur.unit === "%") {
    const d = cur.value - prev.value;
    return `${d >= 0 ? "+" : "−"}${nf1.format(Math.abs(d))} pt`;
  }
  if (prev.value === 0) return null;
  const d = ((cur.value - prev.value) / prev.value) * 100;
  return `${d >= 0 ? "+" : "−"}${nf0.format(Math.abs(d))} %`;
}
