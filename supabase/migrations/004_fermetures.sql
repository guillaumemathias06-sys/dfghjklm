-- Registre des fermetures de terrains (pluie, humidité, chaleur, panne, autre).
create table if not exists public.fermetures (
  id         uuid primary key default gen_random_uuid(),
  debut      timestamptz not null,
  fin        timestamptz not null check (fin > debut),
  terrains   text[] not null default '{}',   -- resource_id Playtomic ; vide = tous les terrains
  cause      text not null check (cause in ('pluie', 'humidite', 'chaleur', 'panne', 'autre')),
  note       text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists fermetures_debut_idx on public.fermetures (debut);
alter table public.fermetures enable row level security;
drop policy if exists "connecte_tout" on public.fermetures;
create policy "connecte_tout" on public.fermetures for all to authenticated using (true) with check (true);
revoke all on public.fermetures from anon;
