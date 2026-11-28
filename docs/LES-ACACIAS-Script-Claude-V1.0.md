# Script Claude — LES ACACIAS — Tableau de bord V1.0

Tu es le développeur de LES ACACIAS. Construis un tableau de bord interne en français en suivant la spécification ci-dessous. Si le fichier LES-ACACIAS-Tableau-de-bord-V1.0.html est joint, pars de ce fichier fonctionnel et conserve le catalogue, les identifiants et les comportements vérifiés. Si le fichier est absent, reconstruis l’application avec cette spécification seule. Livre le code complet et exécutable, avec une prévisualisation si ton environnement le permet.

## 1. Objectif et périmètre

L’équipe des Acacias veut analyser, corriger et développer l’activité. Cette V1 matérialise les vues, les produits, les mesures et les méthodes. Toutes les valeurs, cibles, tendances, comparaisons, limites et dates de synchronisation de l’activité sont indisponibles au démarrage. Utilise « — » et « À relier » avec des libellés accessibles. Ne transforme jamais une donnée manquante en zéro. Ne génère ni transactions, ni clients, ni devis, ni graphiques de démonstration. Les chiffres structurels de l’application, par exemple le nombre de fiches du catalogue, sont permis.

L’interface fonctionne sans compte, serveur, service tiers ou base distante. Une livraison en HTML autonome avec CSS et JavaScript intégrés convient à cette version. Si Claude propose un Artifact, garde une version exportable du code. Ne publie rien et ne configure aucun connecteur à cette étape. Utilise uniquement les activités et les règles décrites ci-dessous. Lorsque des catégories sport/produit restent à confirmer, traite-les comme un classement de navigation, sans en déduire qu’une offre est commercialisée.

## 2. Navigation et comportement

1. **Synthèse**. Les douze cartes de direction listées plus bas. Chaque carte affiche le libellé, la valeur, l’objectif, l’écart, la tendance, la décision qu’elle éclaire et un lien vers les fiches correspondantes. Les champs chiffrés restent indisponibles. Les vues futures pourront comparer des périmètres équivalents, le budget et la même période de l’année précédente.
2. **BtoC**. Familles Attirer, Vendre, Répliquer et Valeur client. Ajouter les vues d’activité École, cours et stages, Animations et Anniversaires. BtoC identifie le particulier qui achète. Les présents et l’auteur d’une réservation restent des unités distinctes.
3. **BtoB**. Familles Attirer, Vendre, Répliquer et Valeur client. Prévoir les futures vues pipeline, signatures, événements, acomptes et soldes. Une entreprise est un compte client distinct d’un contact ou d’un participant. Une opportunité doit pouvoir être suivie par stade et par prochaine action quand son process sera raccordé. Les fiches et méthodes sont déjà disponibles en V1, aucun dossier commercial n’est initialisé.
4. **Produits**. Rendre navigables toutes les offres du catalogue produit ci-dessous. Afficher les emplacements volume, CA et marge. Relier chaque produit à ses mesures. Donner accès au classement par sport et activité. Sur les vues futures, ajouter places vendues, capacité, renouvellement ou réachat lorsque ces mesures s’appliquent.
5. **Exploitation**. Finances, terrains et météo, installations, équipe, qualité et snack. Garder les données communes identifiables et éviter de cumuler plusieurs fois les mêmes coûts ou ventes.
6. **Indicateurs à relier**. Inclure tous les indicateurs, y compris ceux qui ne sont pas en synthèse. Recherche sur libellé, identifiant, méthode et source. Filtres périmètre, famille et avancement. Chaque fiche affiche son identifiant stable, segment, famille, unité, fréquence, méthode et source envisagée. Prévoir des liens directs depuis les cartes et produits qui ouvrent la fiche même si un filtre précédent l’excluait. Permettre de renseigner le responsable, la source retenue, la date cible, le process et la prochaine étape. Avancement modifiable parmi « À relier », « Process en cours » et « Prêt à relier ». L’état de connexion reste « À relier » même quand un process est prêt.
7. **Décisions**. Un registre initialement vide. Permettre d’ajouter et de modifier une action avec responsable, échéance, périmètre, indicateur, constat et résultat attendu. Les statuts sont « À faire », « En cours » et « Terminée ». En revue hebdomadaire, sélectionner jusqu’à trois actions prioritaires. Revoir chaque mois la finance, les marges et le budget. Arbitrer chaque trimestre les offres et investissements à développer, ajuster ou arrêter.

La synthèse propose également un filtre BtoC, BtoB ou commun qui affiche les cartes disposant de fiches du périmètre sélectionné. Filtres de périmètre à prévoir sur les vues d’analyse : période, association/SARL, sport, activité et créneau. Les créneaux prévus sont journée, soirée et week-end. Le week-end pourra être croisé avec le jour et l’heure lors du raccordement. En V1 les filtres cadrent l’analyse à venir, et sport et activité filtrent effectivement le catalogue de produits. Une offre dont les sports restent à préciser demeure visible dans le filtre sport. Les filtres ne produisent pas de statistiques. La recherche et les filtres du registre agissent immédiatement sur les fiches.

Les annotations et décisions saisies peuvent être enregistrées dans le stockage local du navigateur, sans données réelles livrées. Gérer les cas où le stockage est interdit et indiquer l’état de sauvegarde. La sauvegarde est propre à l’appareil et au contexte de consultation. Prévoir une interface lisible sur téléphone et ordinateur utilisable au clavier, avec focus visible, navigation liée par fragment et états vides explicites. Empêcher l’interprétation du texte saisi comme du HTML.

## 3. Règles métier avant connexion

- Chaque vente porte un segment acheteur BtoC ou BtoB et une structure de facturation ou d’encaissement. Une vente occasionnée par un événement BtoB et payée ensuite à titre personnel relève du BtoC. L’événement peut être son origine de découverte. L’origine et le canal de réservation demeurent distincts.
- La synthèse affiche BtoC, BtoB et le périmètre commun. Les dimensions segment et structure sont indépendantes. Distinguer les éventuels flux internes des flux externes pour une vue globale dédupliquée. Documenter le traitement comptable avant connexion.
- Enregistrer des dates distinctes pour demande, achat, réservation, prestation, facture et encaissement quand elles s’appliquent. Distinguer CA signé, CA réalisé, encaissement et crédits prépayés.
- Distinguer capacité théorique, capacité jouable, capacité mise en vente, réservation et usage réel. Les cours, événements et fermetures demandent des états distincts. Une heure ouverte simultanément sur plusieurs terrains correspond à plusieurs heures-terrain.
- Pour les ratios futurs, préciser le périmètre et le dénominateur. Une source absente ou un dénominateur nul rend le résultat indisponible. Utiliser des groupes observables sur la totalité de la fenêtre pour mesurer le retour ou la valeur sur douze mois.
- Distinguer panier par achat, CA par client, fréquentation et LTV. Présenter la valeur réellement observée à douze mois avant toute estimation de LTV. L’hypothèse d’inactivité varie par produit. Retenir « motif inconnu » si la raison d’un départ est absente.
- Pendant le raccordement, confirmer pour chaque fiche le propriétaire, la source, la clé de rapprochement, les dates, la méthode, les conditions d’éligibilité et la fréquence. Contrôler doublons, périodes manquantes et cohérence avec les sources. Les objectifs et seuils seront validés sur l’historique comparable. Aucun chiffre ni seuil de performance n’est prérempli.

## 4. Les douze cartes de direction

- **Chiffre d’affaires par activité** · Métriques ca. Identifier les activités qui expliquent l’écart de CA.
- **Marge par activité** · Métriques marge. Évaluer les prix et les coûts directement affectés.
- **Résultat d’exploitation mensuel** · Métriques resultat. Mesurer la rentabilité après les charges communes.
- **Trésorerie prévisionnelle** · Métriques solde, point-bas, treize-semaines. Repérer les échéances et le point bas de trésorerie.
- **Occupation des terrains** · Métriques occupation, usage. Repérer les créneaux à remplir ou qui saturent.
- **Revenu par heure de terrain disponible** · Métriques revenu-heure, marge-heure. Comparer les créneaux et arbitrer leur usage.
- **Heures de terrain perdues** · Métriques perdues, affectees. Mesurer les fermetures et leurs conséquences.
- **Nouveaux clients payants** · Métriques c-nouveaux, c-origine, c-canal. Identifier les origines des premiers achats.
- **Retour à 30 jours** · Métriques c-retour30. Mesurer le deuxième achat des particuliers.
- **Entreprises signées et marge par événement** · Métriques b-signatures, b-ca-signe, b-marge, b-demandes-retour. Vérifier la rentabilité et les premiers signes de récurrence.
- **Remplissage des activités encadrées** · Métriques e-remplissage, a-remplissage. Ajuster les places ouvertes selon la demande.
- **Coût et heures du personnel** · Métriques cout-personnel, heures-equipe. Adapter le planning aux besoins des activités.

## 5. Catalogue des produits

| Produit | Volet | Sports de navigation | Fiches liées |
|---|---|---|---|
| Locations padel | BtoC | Padel | occupation, prix-heure, revenu-heure, marge-heure |
| Locations tennis | BtoC | Tennis | occupation, prix-heure, revenu-heure, marge-heure |
| Locations foot à 5 | BtoC | Foot à 5 | occupation, prix-heure, revenu-heure, marge-heure |
| École et cours collectifs padel | BtoC | Padel | e-inscriptions, e-remplissage, e-presence, e-marge, e-renouvellement |
| École et cours collectifs tennis | BtoC | Tennis | e-inscriptions, e-remplissage, e-presence, e-marge, e-renouvellement |
| Stages padel | BtoC | Padel | e-inscriptions, e-remplissage, e-presence, e-marge |
| Stages tennis | BtoC | Tennis | e-inscriptions, e-remplissage, e-presence, e-marge |
| Cours individuels | BtoC | Padel, Tennis | ca, marge, e-encadrement |
| Américaines | BtoC | Padel | a-remplissage, a-marge, a-retour, a-snack |
| Tournois ouverts | BtoC | À préciser | a-remplissage, a-marge, a-retour, a-snack |
| Anniversaires | BtoC | À préciser | ann-ventes, ann-marge |
| Team buildings | BtoB | À préciser | b-ca-realise, b-marge, b-marge-heure, b-retour6 |
| Tournois d’entreprise | BtoB | À préciser | b-ca-realise, b-marge, b-marge-heure, b-retour6 |
| Journées et séminaires | BtoB | À préciser | b-ca-realise, b-marge, b-temps, b-retour6 |
| Privatisations | BtoB | À préciser | b-marge, b-marge-heure, b-deplacement, b-creux |
| Créneaux réguliers entreprises | BtoB | À préciser | b-ca-realise, b-frequence, b-renouvellement |
| Restauration de groupe | BtoB | À préciser | b-panier, b-marge, s-matiere |
| Snack | Commun | À préciser | s-ca, s-tickets, s-panier, s-marge, s-conversion |

## 6. Registre complet des 128 indicateurs

### Commun · Finance

Fréquence proposée Hebdomadaire / mensuel. Sources envisagées Comptabilité, caisse, banque.

- **Chiffre d’affaires net** · `ca` · €. Somme des ventes reconnues sur la période, nette des remises et remboursements selon le traitement comptable retenu. Vue par activité, produit, segment et structure.
- **Marge directe par activité et produit** · `marge` · €. CA net moins coûts directement attribuables, dont coût employeur des heures affectées. Une affectation manquante reste visible.
- **Taux de marge directe** · `taux-marge` · %. Marge directe ÷ CA net.
- **Résultat d’exploitation** · `resultat` · €. Produits d’exploitation moins charges d’exploitation, charges communes comprises. Vue mensuelle.
- **Écart au budget et comparaison historique** · `budget` · € / %. Réel moins budget de la même période. Comparer aussi à la période précédente comparable et à la même période de l’année précédente.
- **Remises accordées** · `remises` · €. Total des remises sur les ventes de la période.
- **Remboursements** · `remboursements` · €. Montants remboursés sur la période, avec motif et référence de la vente.
- **Encaissements et décaissements** · `encaissements` · €. Sommes réellement reçues et payées, selon la date du mouvement de trésorerie.
- **Créances et retards de paiement** · `creances` · €. Sommes facturées encore dues, dont les montants arrivés à échéance.
- **Échéances à payer** · `echeances` · €. Montants dus à venir par date, structure et catégorie.
- **Crédits prépayés** · `wallet` · €. Suivre les recharges, utilisations et crédits restant disponibles. Rapprocher avec les ventes et la comptabilité pour éviter le double comptage.
- **Solde de trésorerie** · `solde` · €. Solde des comptes et caisses inclus dans le périmètre, par structure.
- **Prévision de trésorerie sur 13 semaines** · `treize-semaines` · €. Solde d’ouverture augmenté des entrées attendues et diminué des sorties prévues, semaine par semaine.
- **Point bas de trésorerie** · `point-bas` · € / date. Le plus faible solde prévisionnel et la semaine correspondante.

### Commun · Terrains

Fréquence proposée Hebdomadaire. Sources envisagées Playtomic, planning des cours et événements, registre des fermetures.

- **Capacité totale des terrains** · `capacite` · h. Somme des heures d’ouverture théoriques par terrain.
- **Heures de terrain jouables** · `jouables` · h. Capacité totale moins les heures réellement indisponibles.
- **Heures proposées à la location** · `louables` · h. Heures jouables mises en vente publique, créneaux affectés en exclusivité à d’autres usages déduits.
- **Heures réservées en location** · `reservees` · h. Heures de location confirmées sur les créneaux proposés, selon la date de jeu.
- **Taux d’occupation commerciale** · `occupation` · %. Heures réservées en location ÷ heures proposées à la location.
- **Taux d’usage total des terrains** · `usage` · %. Heures effectivement utilisées, tous usages confondus, ÷ heures jouables. Éviter le chevauchement des usages.
- **Heures proposées à la location restées vides** · `vides` · h. Heures proposées moins heures réservées en location. Préciser le statut des absences.
- **Revenu par heure de terrain proposée** · `revenu-heure` · €/h. CA des locations correspondant aux créneaux du périmètre ÷ heures proposées à la location.
- **Marge par heure de terrain mobilisée** · `marge-heure` · €/h. Marge directe des prestations comparées ÷ somme des heures-terrain mobilisées. Ventiler les usages mixtes avec une règle documentée.
- **Prix moyen réellement vendu** · `prix-heure` · €/h. CA net des locations ÷ heures de location vendues.
- **Durée moyenne des réservations** · `duree` · h. Durée totale des réservations retenues ÷ nombre de réservations retenues.
- **Délai de réservation** · `anticipation` · jours. Écart entre la date de réservation et la date de jeu. Afficher la moyenne ou la médiane selon la définition choisie.
- **Annulations de réservation** · `annulations` · nombre / %. Nombre d’annulations et part des réservations annulées, par motif.
- **Absences aux réservations** · `absences-jeu` · nombre / %. Réservations confirmées non honorées ÷ réservations attendues, en distinguant le comptage brut du taux.
- **Demandes refusées faute de place** · `refus` · nombre. Demandes identifiables auxquelles aucun créneau demandé n’a pu être proposé.
- **Heures de terrain perdues** · `perdues` · h. Heures fermées, ventilées par pluie, humidité, chaleur, panne et autre cause. Une heure de fermeture est comptée une seule fois dans le total.
- **Réservations touchées par une fermeture** · `affectees` · nombre. Réservations annulées ou déplacées à la suite d’une fermeture, dédupliquées.

### Commun · Installations

Fréquence proposée Mensuel / trimestriel. Sources envisagées Registre de maintenance, factures, historique des réservations.

- **Pannes et indisponibilité technique** · `pannes` · nombre / h. Compter les pannes et les durées de fermeture technique correspondantes par terrain.
- **Interventions de maintenance** · `interventions` · nombre / délai. Suivre les interventions ouvertes, clôturées et le délai de résolution.
- **Coût de maintenance par terrain** · `entretien` · €. Somme des coûts d’entretien et interventions affectés à chaque terrain.
- **Consommation d’énergie et d’eau** · `consommation` · kWh / m³ / €. Relevés et coûts associés sur la période.
- **Heures récupérables par investissement** · `heures-recuperables` · h. Estimation des fermetures qu’un aménagement permettrait d’éviter, avec distinction des heures réellement vendables.
- **Marge récupérable par investissement** · `marge-recuperable` · €. Heures récupérables estimées vendues × marge directe additionnelle par heure, selon les hypothèses documentées.

### Commun · Équipe

Fréquence proposée Hebdomadaire / mensuel. Sources envisagées Planning salarié, relevés d’heures, paie.

- **Coût employeur complet** · `cout-personnel` · €. Coût du personnel pour la structure, ventilé par activité lorsque l’affectation est connue.
- **Heures prévues et travaillées** · `heures-equipe` · h. Comparer planning et relevés d’heures par activité et créneau.
- **Heures supplémentaires** · `heures-sup` · h. Heures supplémentaires identifiées selon les données de paie et de temps de travail.
- **Absences de l’équipe** · `absences-equipe` · jours / h. Durée des absences selon les relevés autorisés.
- **Couverture des créneaux clés** · `couverture-equipe` · %. Créneaux clés effectivement couverts ÷ créneaux clés prévus.
- **Suivi des procédures d’ouverture et de fermeture** · `procedures` · %. Procédures validées ÷ procédures attendues selon les listes de contrôle.

### Commun · Qualité

Fréquence proposée Hebdomadaire / mensuel. Sources envisagées Avis, réclamations, registre d’incidents, retours clients.

- **Note et volume d’avis** · `avis` · note / nombre. Note moyenne et nombre d’avis, avec période et source.
- **Réclamations par motif** · `reclamations` · nombre. Compter les réclamations distinctes par motif et par activité.
- **Délai de résolution des réclamations** · `resolution` · jours. Délai entre ouverture et résolution des réclamations clôturées.
- **Incidents d’exploitation** · `incidents` · nombre. Incidents distincts par activité et catégorie.
- **Satisfaction après cours ou événement** · `satisfaction` · note / %. Résultats des retours recueillis. Afficher le nombre de réponses et, si connu, le taux de réponse.

### BtoC · Attirer

Fréquence proposée Hebdomadaire. Sources envisagées Playtomic, formulaires, appels, messages, dépenses marketing.

- **Demandes entrantes des particuliers** · `c-demandes` · nombre. Compter les demandes identifiables, dédupliquées par besoin.
- **Origine de découverte des nouveaux clients** · `c-origine` · nombre / %. Ventiler les premières ventes par origine déclarée ou attribuable. Prévoir une catégorie inconnue. Un événement entreprise peut être une origine.
- **Canal de première réservation ou d’achat** · `c-canal` · nombre / %. Ventiler par canal utilisé pour le premier achat, distinct de l’origine de découverte.
- **Premier produit acheté** · `c-premier-produit` · nombre / %. Ventiler les nouveaux clients d’après le produit de leur premier achat identifiable. Documenter le traitement des achats simultanés.
- **Nouveaux clients payants** · `c-nouveaux` · nombre. Clients identifiables dont le premier achat connu tombe dans la période. Signaler un historique incomplet.
- **Délai de première réponse aux particuliers** · `c-reponse` · h. Écart entre réception et première réponse sur les demandes suivies.
- **Coût d’acquisition par canal** · `c-cac` · €/client. Dépenses d’acquisition attribuables au canal ÷ nouveaux clients payants attribués selon la même règle.

### BtoC · Vendre

Fréquence proposée Hebdomadaire / mensuel. Sources envisagées Réservations, inscriptions, caisse, comptabilité.

- **Conversion des demandes en réservations** · `c-conversion` · %. Demandes suivies converties ÷ demandes suivies arrivées à décision sur le même périmètre.
- **Achats des particuliers** · `c-commandes` · nombre. Achats distincts, hors doublons et selon le traitement documenté des annulations.
- **Panier moyen par achat** · `c-panier` · €/achat. CA BtoC net ÷ nombre d’achats retenus sur le même périmètre.
- **CA moyen par client acheteur** · `c-ca-client` · €/client. CA attribuable aux clients BtoC identifiés ÷ nombre de clients acheteurs identifiés.
- **Part des ventes rattachables à un client** · `c-couverture` · %. Ventes liées à un client fiable ÷ total des ventes sur le même périmètre.

### BtoC · Répliquer

Fréquence proposée Mensuel / saison. Sources envisagées Réservations, inscriptions, présences et relances.

- **Clients actifs à 30 et 90 jours** · `c-actifs` · nombre. Clients identifiés ayant acheté au moins une fois dans la fenêtre considérée.
- **Deuxième achat dans les 30 jours** · `c-retour30` · %. Nouveaux clients observables au moins 30 jours ayant acheté de nouveau dans ce délai ÷ tous les nouveaux clients observables au moins 30 jours.
- **Deuxième achat dans les 90 jours** · `c-retour90` · %. Même logique sur 90 jours, avec un groupe arrivé à maturité.
- **Fréquence d’achat par client** · `c-frequence` · achats/client. Achats attribuables ÷ clients acheteurs identifiés sur la période. Prévoir aussi le détail individuel.
- **Fréquentation par client** · `c-visites` · visites/client. Présences réellement identifiées par client sur 30 ou 90 jours. La réservation d’un joueur ne prouve pas la présence des autres.
- **Délai entre deux visites** · `c-delai-visites` · jours. Nombre de jours entre deux présences successives du même client identifiable.
- **Clients devenus inactifs ou perdus** · `c-inactifs` · nombre / %. Clients de la base à surveiller ayant dépassé le seuil d’inactivité propre au produit ÷ cette base pour le taux. Le seuil et la règle de perte sont à valider.
- **Motifs de perte des particuliers** · `c-perte` · nombre / %. Motifs déclarés lors de la relance ou d’un non-renouvellement, dont inconnus. Suivre le nombre de clients relancés et le taux de réponse.
- **Passage d’un produit à un autre** · `c-passerelles` · nombre / %. Part des clients d’un produit initial qui achètent un autre produit dans la fenêtre définie.
- **Renouvellement des particuliers** · `c-renouvellement` · %. Clients ayant renouvelé ÷ clients arrivés à échéance, par produit et saison.

### BtoC · Valeur client

Fréquence proposée Mensuel / trimestriel. Sources envisagées Ventes identifiées, coûts directs et historique client.

- **CA cumulé par particulier à 12 mois** · `c-ca12` · €/client. Somme du CA par particulier pendant les 12 mois suivant son premier achat, pour les cohortes pleinement observables.
- **Marge cumulée par particulier à 12 mois** · `c-marge12` · €/client. Somme des marges directes attribuables à ce client sur ses 12 premiers mois observables.
- **LTV estimée par particulier** · `c-ltv` · €/client. Estimation de la marge directe cumulée sur la durée de la relation. Définir et valider l’horizon, la fréquence, la marge et les hypothèses de rétention avant activation.

### BtoB · Attirer

Fréquence proposée Hebdomadaire. Sources envisagées Suivi commercial, demandes et formulaires.

- **Nouvelles entreprises prospectées** · `b-prospection` · nombre. Entreprises distinctes contactées pour la première fois sur la période.
- **Demandes qualifiées des entreprises** · `b-demandes` · nombre. Opportunités avec besoin identifié et retenues selon les critères de qualification à définir.
- **Origine des contacts entreprise** · `b-origine` · nombre / %. Ventiler les opportunités selon la provenance connue du contact.
- **Délai de première réponse entreprise** · `b-reponse` · h. Écart entre la réception du contact et la première réponse enregistrée.

### BtoB · Vendre

Fréquence proposée Hebdomadaire / mensuel. Sources envisagées Suivi des opportunités, devis, factures, banque, planning.

- **Devis envoyés** · `b-devis` · nombre / €. Nombre et valeur des opportunités chiffrées. Identifier la dernière version du devis pour éviter les doublons.
- **Entreprises signées** · `b-signatures` · nombre. Entreprises distinctes ayant signé sur la période. Compter séparément les premières entreprises signées et le nombre de signatures.
- **Taux de signature** · `b-conversion` · %. Opportunités gagnées ÷ opportunités clôturées gagnées ou perdues avec devis. Les dossiers ouverts restent dans le pipeline.
- **Délai de signature** · `b-delai` · jours. Écart entre envoi du devis et signature selon la règle de date retenue.
- **Opportunités ouvertes et prochaines actions** · `b-pipeline` · nombre / €. Lister chaque opportunité avec son stade, son montant, son échéance et la date de prochaine action.
- **Devis perdus et motifs de perte** · `b-pertes` · nombre / %. Opportunités perdues et raisons connues. Prévoir la catégorie motif inconnu.
- **CA signé entreprises** · `b-ca-signe` · €. Valeur des engagements signés, à la date de signature. Le CA réalisé suit la date de prestation et les règles comptables.
- **CA réalisé entreprises** · `b-ca-realise` · €. Ventes reconnues pour les prestations réalisées sur la période.
- **Panier moyen par événement** · `b-panier` · €/événement. CA réalisé des événements ÷ événements réalisés sur le même périmètre.
- **Marge directe par événement** · `b-marge` · €. CA de l’événement moins restauration, encadrement, temps d’équipe affecté et autres coûts directs.
- **Marge médiane par événement** · `b-mediane` · €. Médiane des marges directes des événements réalisés sur la période.
- **Temps d’équipe par événement** · `b-temps` · h. Somme des heures de préparation, prestation et remise en état affectées à l’événement.
- **Heures-terrain mobilisées par événement** · `b-heures` · h. Somme des durées de chaque terrain mobilisé, par sport et créneau.
- **Marge par heure-terrain entreprise** · `b-marge-heure` · €/h. Marge directe de l’événement ÷ heures-terrain mobilisées.
- **Événements sur les créneaux habituellement creux** · `b-creux` · nombre / %. Événements sur des créneaux classés creux selon l’historique à définir. Documenter les événements répartis sur plusieurs créneaux.
- **Marge additionnelle après déplacement éventuel** · `b-deplacement` · €. Marge directe de l’événement moins marge estimée des ventes habituelles déplacées. Marquer l’estimation comme telle.
- **Acomptes attendus et encaissés** · `b-acomptes` · €. Suivre les acomptes selon leur montant, leur échéance et leur date d’encaissement.
- **Soldes entreprises à encaisser** · `b-soldes` · €. Solde dû par dossier et échéance, après rapprochement des encaissements.

### BtoB · Répliquer

Fréquence proposée Mensuel / trimestriel. Sources envisagées Suivi commercial, contrats et événements réalisés.

- **Demandes de deuxième date** · `b-demandes-retour` · nombre. Entreprises distinctes ayant demandé une deuxième date après un premier événement.
- **Deuxième réservation à six mois** · `b-retour6` · %. Entreprises ayant réservé à nouveau dans les six mois suivant le premier événement ÷ entreprises dont le premier événement remonte à au moins six mois.
- **Deuxième réservation à douze mois** · `b-retour12` · %. Même calcul sur douze mois pour les entreprises observables sur la fenêtre complète.
- **Fréquence par entreprise** · `b-frequence` · événements/client. Événements réalisés ÷ entreprises clientes actives du périmètre, avec détail possible par compte.
- **Renouvellement des contrats récurrents** · `b-renouvellement` · %. Contrats renouvelés ÷ contrats éligibles arrivés à échéance.
- **Entreprises devenues inactives ou perdues** · `b-inactifs` · nombre / %. Comptes arrivés à échéance sans renouvellement ou dépassant un délai de retour défini. Éviter de mélanger perte déclarée et inactivité présumée.
- **Motifs de non-retour entreprise** · `b-motifs` · nombre / %. Ventiler les raisons déclarées et identifier les comptes dont le motif reste inconnu.

### BtoB · Valeur client

Fréquence proposée Mensuel / trimestriel. Sources envisagées Factures, coûts directs et historique entreprise.

- **CA cumulé par entreprise à 12 mois** · `b-ca12` · €/entreprise. CA reconnu auprès de l’entreprise dans les 12 mois suivant sa première prestation réalisée.
- **Marge cumulée par entreprise à 12 mois** · `b-marge12` · €/entreprise. Somme des marges directes attribuables à l’entreprise sur la même fenêtre.
- **LTV estimée par entreprise** · `b-ltv` · €/entreprise. Marge directe totale estimée sur la durée de la relation, avec hypothèses de fréquence, marge et renouvellement à valider.

### BtoC · École, cours et stages

Fréquence proposée Hebdomadaire / saison. Sources envisagées Inscriptions, présences, planning des coachs, comptabilité.

- **Inscriptions par groupe** · `e-inscriptions` · nombre. Nombre d’inscrits confirmés par groupe, niveau et sport. Distinguer inscrits, adhérents et licenciés.
- **Adhérents et licenciés** · `e-effectifs` · nombre. Dénombrer séparément les adhérents et les licenciés selon la saison et la structure.
- **Liste d’attente** · `e-attente` · nombre. Nombre de personnes en attente par groupe ou stage.
- **Remplissage des cours et stages** · `e-remplissage` · %. Places confirmées ÷ places ouvertes par groupe ou session.
- **Taux de présence** · `e-presence` · %. Présences constatées ÷ présences attendues aux séances.
- **CA et marge par groupe ou stage** · `e-marge` · €. CA attribué au groupe ou au stage moins les coûts directs correspondants pour la marge.
- **Coût d’encadrement par heure** · `e-encadrement` · €/h. Coût d’encadrement affecté ÷ heures d’encadrement assurées.
- **Renouvellement à la rentrée** · `e-renouvellement` · %. Inscrits de la saison précédente réinscrits ÷ anciens inscrits éligibles.

### BtoC · Animations

Fréquence proposée Hebdomadaire / après événement. Sources envisagées Inscriptions, réservations, caisse.

- **Remplissage des tournois et américaines** · `a-remplissage` · %. Places confirmées ÷ places ouvertes par édition, avec une unité homogène joueurs ou équipes.
- **Délai de remplissage des animations** · `a-delai` · jours. Délai entre ouverture des inscriptions et remplissage. Identifier les éditions jamais complètes.
- **Désistements des animations** · `a-desistements` · nombre / %. Désistements et part des inscrits ayant annulé par édition.
- **CA et marge par édition** · `a-marge` · €. CA attribué à l’édition et marge après coûts directs.
- **Participants qui reviennent après une animation** · `a-retour` · %. Participants identifiables qui reprennent une place ou réservent ensuite ÷ participants identifiables observables sur la durée choisie.
- **Ventes snack associées à l’animation** · `a-snack` · €. CA caisse traçable à l’édition, en évitant son double comptage dans le CA global.

### Commun · Snack

Fréquence proposée Hebdomadaire / mensuel. Sources envisagées Caisse, fournisseurs, inventaires, relevés d’heures.

- **CA snack par service et produit** · `s-ca` · €. CA net par service, produit et segment acheteur quand il est identifiable.
- **Tickets snack** · `s-tickets` · nombre. Tickets distincts sur la période, par service.
- **Panier moyen snack** · `s-panier` · €/ticket. CA net du service ÷ tickets correspondants.
- **Coût matière snack** · `s-matiere` · € / %. Coût des matières consommées, rapporté au CA snack si exprimé en pourcentage.
- **Pertes matières snack** · `s-pertes` · € / quantité. Produits jetés ou écartés, en quantités adaptées et en coût.
- **Marge snack par service et produit** · `s-marge` · €. CA moins coût matière et autres coûts directs affectés. Inclure le temps affecté quand il est mesurable.
- **Visites sportives avec achat snack** · `s-conversion` · %. Visites sportives identifiables associées à au moins un achat snack ÷ visites sportives pour lesquelles le rapprochement est fiable.

### BtoC · Anniversaires

Fréquence proposée Mensuel. Sources envisagées Réservations, caisse, planning.

- **Anniversaires vendus et réalisés** · `ann-ventes` · nombre. Réservations confirmées et prestations effectivement réalisées, suivies séparément.
- **Panier et marge par anniversaire** · `ann-marge` · €. CA moyen par prestation et marge directe par formule.

## 7. Critères de recette

- Toutes les pages sont accessibles et les douze cartes renvoient vers des fiches existantes.
- Le registre contient tous les identifiants uniques de cette spécification. Une recherche sans résultat propose un état vide et la réinitialisation rétablit le catalogue.
- Un lien direct ouvre sa fiche même si un filtre précédent l’excluait. Les fiches BtoC, BtoB et communes sont filtrables indépendamment.
- Un clic sur « Prêt à relier » change uniquement l’avancement après sauvegarde. La connexion et la valeur restent indisponibles.
- Une annotation et une décision modifiées survivent à un rechargement lorsque le stockage est disponible. La V1 affiche une liste initialement vide de décisions.
- Les filtres produits mettent à jour la liste d’offres. Les autres filtres restent disponibles pour le futur raccordement sans résultats simulés.
- Aucune requête réseau, aucun compte, aucun connecteur et aucune valeur métier inventée ne sont nécessaires. Vérifier au minimum les interactions principales et l’affichage en largeur mobile.
- Livrer le code complet et indiquer honnêtement la portée des vérifications et du stockage.
