# Tableau de bord Les Acacias

Application Next.js (Vercel) + Supabase. Le tableau de bord de la V1 (12 cartes, 128 fiches, 18 produits, registre des décisions) avec :

- connexion par e-mail et mot de passe (Supabase Auth) ;
- annotations des fiches, décisions et réglages enregistrés dans Supabase ;
- **Playtomic relié** : réservations synchronisées chaque nuit (Vercel Cron, 5 h 15 heure de Paris) et à la demande, via l'API tierce en lecture seule. Seuls les champs utiles au calcul sont stockés, aucune donnée personnelle ;
- 11 fiches Terrains calculées (capacité, heures jouables et proposées, réservées, occupation, usage, heures vides, revenu par heure, prix moyen, durée moyenne, annulations), filtrables par période, sport et créneau, avec tendance sur la période précédente. Les hypothèses (fermetures non relevées, CA non comptable) sont affichées sur chaque fiche.

- **Masse salariale** : coût employeur et heures payées par mois et par catégorie de poste (table `paie_mensuelle`, sans nom ni numéro de sécurité sociale), qui alimentent les fiches « Coût employeur complet » et « Heures prévues et travaillées ».

La version statique d'origine est dans `v1-statique/`.

## Mise en service

1. **Supabase** : créer un projet, ouvrir SQL Editor et exécuter `supabase/migrations/001_init.sql` puis `002_paie.sql`, puis le fichier de données de paie fourni à part (jamais commité). Dans Authentication, créer votre utilisateur (Add user) puis désactiver les nouvelles inscriptions.
2. **Vercel** : Add New > Project > importer ce dépôt GitHub. Renseigner les variables de `.env.local.example` (Settings > Environment Variables), puis déployer.
3. Se connecter, ouvrir **Réglages**, saisir les horaires d'ouverture, puis cliquer **Synchroniser maintenant**.

## Développement

```
npm install
cp .env.local.example .env.local   # puis compléter
npm run dev
npm test        # moteur de calcul Terrains
```
