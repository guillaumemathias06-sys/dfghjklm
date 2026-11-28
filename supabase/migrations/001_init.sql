-- Tableau de bord Les Acacias — schéma initial.
-- À exécuter une fois dans Supabase : SQL Editor > New query > coller > Run.

-- Annotations des fiches indicateurs (une ligne par identifiant stable).
create table if not exists public.fiche_notes (
  indicator_id text primary key,
  responsable  text not null default '',
  source       text not null default '',
  date_cible   date,
  process      text not null default '',
  prochaine    text not null default '',
  avancement   text not null default 'À relier'
    check (avancement in ('À relier', 'Process en cours', 'Prêt à relier')),
  updated_at   timestamptz not null default now()
);

-- Registre des décisions.
create table if not exists public.decisions (
  id         uuid primary key default gen_random_uuid(),
  titre      text not null check (char_length(titre) between 1 and 300),
  responsable text not null default '',
  echeance   date,
  perimetre  text not null default '' check (perimetre in ('', 'BtoC', 'BtoB', 'Commun')),
  indicator_id text not null default '',
  constat    text not null default '',
  attendu    text not null default '',
  statut     text not null default 'À faire' check (statut in ('À faire', 'En cours', 'Terminée')),
  prioritaire boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Réglages (une seule ligne, id = 1) : horaires d'ouverture, limite journée/soirée, terrains.
create table if not exists public.reglages (
  id            int primary key default 1 check (id = 1),
  -- { "mon": {"open":"08:00","close":"23:00"}, ... } ; un jour absent = fermé.
  horaires      jsonb not null default '{}'::jsonb,
  debut_soiree  text not null default '18:00',
  -- Nombre de terrains par sport, si on veut corriger ce que Playtomic laisse voir.
  -- { "PADEL": 4, "TENNIS": 2, "FOOTBALL": 3 } ; vide = déduit des réservations.
  terrains      jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);
insert into public.reglages (id) values (1) on conflict (id) do nothing;

-- Réservations Playtomic : uniquement les champs utiles au calcul, aucune donnée personnelle.
create table if not exists public.playtomic_bookings (
  booking_id     text primary key,
  resource_id    text,
  resource_name  text,
  sport_id       text,
  booking_type   text,
  start_at       timestamptz,
  end_at         timestamptz,
  price_amount   numeric,
  price_currency text,
  origin         text,
  status         text,
  payment_status text,
  is_canceled    boolean not null default false,
  activity_name  text,
  course_name    text,
  synced_at      timestamptz not null default now()
);
create index if not exists playtomic_bookings_start_idx on public.playtomic_bookings (start_at);

-- Journal des synchronisations.
create table if not exists public.sync_runs (
  id           bigint generated always as identity primary key,
  source       text not null default 'playtomic',
  started_at   timestamptz not null default now(),
  finished_at  timestamptz,
  status       text not null default 'running' check (status in ('running', 'completed', 'partial', 'failed')),
  window_start timestamptz,
  window_end   timestamptz,
  records_read int not null default 0,
  records_skipped int not null default 0,
  error        text,
  triggered_by text
);

-- Sécurité : seules les personnes connectées lisent et écrivent ; la synchronisation
-- passe par la clé service_role côté serveur. Désactivez les inscriptions publiques
-- dans Supabase (Authentication > Sign In / Providers > Allow new users to sign up).
alter table public.fiche_notes enable row level security;
alter table public.decisions enable row level security;
alter table public.reglages enable row level security;
alter table public.playtomic_bookings enable row level security;
alter table public.sync_runs enable row level security;

drop policy if exists "connecte_tout" on public.fiche_notes;
create policy "connecte_tout" on public.fiche_notes for all to authenticated using (true) with check (true);
drop policy if exists "connecte_tout" on public.decisions;
create policy "connecte_tout" on public.decisions for all to authenticated using (true) with check (true);
drop policy if exists "connecte_tout" on public.reglages;
create policy "connecte_tout" on public.reglages for all to authenticated using (true) with check (true);
drop policy if exists "connecte_lecture" on public.playtomic_bookings;
create policy "connecte_lecture" on public.playtomic_bookings for select to authenticated using (true);
drop policy if exists "connecte_lecture" on public.sync_runs;
create policy "connecte_lecture" on public.sync_runs for select to authenticated using (true);
