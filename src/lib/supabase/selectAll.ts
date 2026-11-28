/**
 * Lit TOUTES les lignes d'une requête, page par page : Supabase plafonne
 * silencieusement chaque lecture à 1 000 lignes. Toujours trier sur une
 * colonne stable pour que les pages ne se chevauchent pas.
 */
export const PAGE = 1000;
type PageResult<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>;
export async function selectAll<T>(fetchPage: (from: number, to: number) => PageResult<T>): Promise<{ data: T[]; error: string | null }> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await fetchPage(from, from + PAGE - 1);
    if (error) return { data: [], error: error.message };
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE) break;
  }
  return { data: rows, error: null };
}
