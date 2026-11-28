-- Terrains Playtomic à ignorer (ex. ressource sans terrain réel).
alter table public.reglages add column if not exists exclus jsonb not null default '[]'::jsonb;

-- Connexion bancaire Powens : un seul utilisateur Powens pour le tableau de bord.
create table if not exists public.banque_connexion (
  id           int primary key default 1 check (id = 1),
  jeton_chiffre text,                -- auth_token Powens chiffré (AES-256-GCM, clé BANK_ENCRYPTION_KEY)
  statut       text not null default 'non_connecte' check (statut in ('non_connecte', 'connecte', 'erreur')),
  derniere_erreur text,
  maj_le       timestamptz not null default now()
);

create table if not exists public.banque_comptes (
  id           bigint primary key,   -- id du compte chez Powens
  connexion_id bigint,
  nom          text not null,
  banque       text,
  iban_masque  text,
  type         text,
  devise       text not null default 'EUR',
  solde        numeric,
  a_venir      numeric,              -- somme des opérations à venir annoncées par la banque
  structure    text not null default '' check (structure in ('', 'Association', 'SARL')),
  actif        boolean not null default true,
  etat         text,                 -- état de la connexion bancaire (null = à jour, SCARequired…)
  synchro_le   timestamptz
);

create table if not exists public.banque_operations (
  id           bigint primary key,   -- id de l'opération chez Powens
  compte_id    bigint not null references public.banque_comptes (id) on delete cascade,
  date_op      date not null,        -- date comptable
  date_valeur  date,
  montant      numeric not null,     -- positif = crédit, négatif = débit
  libelle      text,
  contrepartie text,
  a_venir      boolean not null default false,
  virement_interne boolean not null default false,
  synchro_le   timestamptz not null default now()
);
create index if not exists banque_operations_date_idx on public.banque_operations (date_op);

alter table public.banque_connexion enable row level security;
alter table public.banque_comptes enable row level security;
alter table public.banque_operations enable row level security;
-- La connexion (jeton) n'est lisible que côté serveur (service_role) : aucune règle pour les connectés.
drop policy if exists "connecte_tout" on public.banque_comptes;
create policy "connecte_tout" on public.banque_comptes for all to authenticated using (true) with check (true);
drop policy if exists "connecte_lecture" on public.banque_operations;
create policy "connecte_lecture" on public.banque_operations for select to authenticated using (true);
revoke all on public.banque_connexion, public.banque_comptes, public.banque_operations from anon;
revoke all on public.banque_connexion from authenticated;
