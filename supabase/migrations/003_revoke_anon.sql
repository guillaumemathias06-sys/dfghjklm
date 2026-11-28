-- Défense en profondeur : le site n'utilise que le rôle « authenticated » et la clé service_role.
revoke all on public.fiche_notes, public.decisions, public.reglages, public.playtomic_bookings, public.sync_runs, public.paie_mensuelle from anon;
