-- Masse salariale mensuelle, issue des bulletins de paie.
-- Une ligne par mois et par catégorie de poste. Pas de nom ni de numéro de sécurité sociale.
create table if not exists public.paie_mensuelle (
  mois        date not null,            -- premier jour du mois de paie
  categorie   text not null,            -- Encadrement sportif, Accueil et réservation, Employé polyvalent, Apprentis
  effectif    int not null,
  heures      numeric not null default 0,  -- heures payées
  brut        numeric not null,
  charges     numeric not null,         -- charges patronales, après allègements
  cout        numeric not null,         -- coût employeur total (« Coût global » / « Total versé par l'employeur »)
  exceptionnel numeric not null default 0, -- part non récurrente (indemnité de rupture, forfait social…)
  note        text not null default '',
  primary key (mois, categorie)
);
alter table public.paie_mensuelle enable row level security;
drop policy if exists "connecte_tout" on public.paie_mensuelle;
create policy "connecte_tout" on public.paie_mensuelle for all to authenticated using (true) with check (true);
