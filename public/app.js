
"use strict";
/* ===== Données structurelles (catalogue issu de la spécification V1.0) ===== */
const D = {"groups": [{"seg": "Commun", "fam": "Finance", "freq": "Hebdomadaire / mensuel", "src": "Comptabilité, caisse, banque"}, {"seg": "Commun", "fam": "Terrains", "freq": "Hebdomadaire", "src": "Playtomic, planning des cours et événements, registre des fermetures"}, {"seg": "Commun", "fam": "Installations", "freq": "Mensuel / trimestriel", "src": "Registre de maintenance, factures, historique des réservations"}, {"seg": "Commun", "fam": "Équipe", "freq": "Hebdomadaire / mensuel", "src": "Planning salarié, relevés d’heures, paie"}, {"seg": "Commun", "fam": "Qualité", "freq": "Hebdomadaire / mensuel", "src": "Avis, réclamations, registre d’incidents, retours clients"}, {"seg": "BtoC", "fam": "Attirer", "freq": "Hebdomadaire", "src": "Playtomic, formulaires, appels, messages, dépenses marketing"}, {"seg": "BtoC", "fam": "Vendre", "freq": "Hebdomadaire / mensuel", "src": "Réservations, inscriptions, caisse, comptabilité"}, {"seg": "BtoC", "fam": "Répliquer", "freq": "Mensuel / saison", "src": "Réservations, inscriptions, présences et relances"}, {"seg": "BtoC", "fam": "Valeur client", "freq": "Mensuel / trimestriel", "src": "Ventes identifiées, coûts directs et historique client"}, {"seg": "BtoB", "fam": "Attirer", "freq": "Hebdomadaire", "src": "Suivi commercial, demandes et formulaires"}, {"seg": "BtoB", "fam": "Vendre", "freq": "Hebdomadaire / mensuel", "src": "Suivi des opportunités, devis, factures, banque, planning"}, {"seg": "BtoB", "fam": "Répliquer", "freq": "Mensuel / trimestriel", "src": "Suivi commercial, contrats et événements réalisés"}, {"seg": "BtoB", "fam": "Valeur client", "freq": "Mensuel / trimestriel", "src": "Factures, coûts directs et historique entreprise"}, {"seg": "BtoC", "fam": "École, cours et stages", "freq": "Hebdomadaire / saison", "src": "Inscriptions, présences, planning des coachs, comptabilité"}, {"seg": "BtoC", "fam": "Animations", "freq": "Hebdomadaire / après événement", "src": "Inscriptions, réservations, caisse"}, {"seg": "Commun", "fam": "Snack", "freq": "Hebdomadaire / mensuel", "src": "Caisse, fournisseurs, inventaires, relevés d’heures"}, {"seg": "BtoC", "fam": "Anniversaires", "freq": "Mensuel", "src": "Réservations, caisse, planning"}], "inds": [{"id": "ca", "l": "Chiffre d’affaires net", "u": "€", "m": "Somme des ventes reconnues sur la période, nette des remises et remboursements selon le traitement comptable retenu. Vue par activité, produit, segment et structure.", "g": 0}, {"id": "marge", "l": "Marge directe par activité et produit", "u": "€", "m": "CA net moins coûts directement attribuables, dont coût employeur des heures affectées. Une affectation manquante reste visible.", "g": 0}, {"id": "taux-marge", "l": "Taux de marge directe", "u": "%", "m": "Marge directe ÷ CA net.", "g": 0}, {"id": "resultat", "l": "Résultat d’exploitation", "u": "€", "m": "Produits d’exploitation moins charges d’exploitation, charges communes comprises. Vue mensuelle.", "g": 0}, {"id": "budget", "l": "Écart au budget et comparaison historique", "u": "€ / %", "m": "Réel moins budget de la même période. Comparer aussi à la période précédente comparable et à la même période de l’année précédente.", "g": 0}, {"id": "remises", "l": "Remises accordées", "u": "€", "m": "Total des remises sur les ventes de la période.", "g": 0}, {"id": "remboursements", "l": "Remboursements", "u": "€", "m": "Montants remboursés sur la période, avec motif et référence de la vente.", "g": 0}, {"id": "encaissements", "l": "Encaissements et décaissements", "u": "€", "m": "Sommes réellement reçues et payées, selon la date du mouvement de trésorerie.", "g": 0}, {"id": "creances", "l": "Créances et retards de paiement", "u": "€", "m": "Sommes facturées encore dues, dont les montants arrivés à échéance.", "g": 0}, {"id": "echeances", "l": "Échéances à payer", "u": "€", "m": "Montants dus à venir par date, structure et catégorie.", "g": 0}, {"id": "wallet", "l": "Crédits prépayés", "u": "€", "m": "Suivre les recharges, utilisations et crédits restant disponibles. Rapprocher avec les ventes et la comptabilité pour éviter le double comptage.", "g": 0}, {"id": "solde", "l": "Solde de trésorerie", "u": "€", "m": "Solde des comptes et caisses inclus dans le périmètre, par structure.", "g": 0}, {"id": "treize-semaines", "l": "Prévision de trésorerie sur 13 semaines", "u": "€", "m": "Solde d’ouverture augmenté des entrées attendues et diminué des sorties prévues, semaine par semaine.", "g": 0}, {"id": "point-bas", "l": "Point bas de trésorerie", "u": "€ / date", "m": "Le plus faible solde prévisionnel et la semaine correspondante.", "g": 0}, {"id": "capacite", "l": "Capacité totale des terrains", "u": "h", "m": "Somme des heures d’ouverture théoriques par terrain.", "g": 1}, {"id": "jouables", "l": "Heures de terrain jouables", "u": "h", "m": "Capacité totale moins les heures réellement indisponibles.", "g": 1}, {"id": "louables", "l": "Heures proposées à la location", "u": "h", "m": "Heures jouables mises en vente publique, créneaux affectés en exclusivité à d’autres usages déduits.", "g": 1}, {"id": "reservees", "l": "Heures réservées en location", "u": "h", "m": "Heures de location confirmées sur les créneaux proposés, selon la date de jeu.", "g": 1}, {"id": "occupation", "l": "Taux d’occupation commerciale", "u": "%", "m": "Heures réservées en location ÷ heures proposées à la location.", "g": 1}, {"id": "usage", "l": "Taux d’usage total des terrains", "u": "%", "m": "Heures effectivement utilisées, tous usages confondus, ÷ heures jouables. Éviter le chevauchement des usages.", "g": 1}, {"id": "vides", "l": "Heures proposées à la location restées vides", "u": "h", "m": "Heures proposées moins heures réservées en location. Préciser le statut des absences.", "g": 1}, {"id": "revenu-heure", "l": "Revenu par heure de terrain proposée", "u": "€/h", "m": "CA des locations correspondant aux créneaux du périmètre ÷ heures proposées à la location.", "g": 1}, {"id": "marge-heure", "l": "Marge par heure de terrain mobilisée", "u": "€/h", "m": "Marge directe des prestations comparées ÷ somme des heures-terrain mobilisées. Ventiler les usages mixtes avec une règle documentée.", "g": 1}, {"id": "prix-heure", "l": "Prix moyen réellement vendu", "u": "€/h", "m": "CA net des locations ÷ heures de location vendues.", "g": 1}, {"id": "duree", "l": "Durée moyenne des réservations", "u": "h", "m": "Durée totale des réservations retenues ÷ nombre de réservations retenues.", "g": 1}, {"id": "anticipation", "l": "Délai de réservation", "u": "jours", "m": "Écart entre la date de réservation et la date de jeu. Afficher la moyenne ou la médiane selon la définition choisie.", "g": 1}, {"id": "annulations", "l": "Annulations de réservation", "u": "nombre / %", "m": "Nombre d’annulations et part des réservations annulées, par motif.", "g": 1}, {"id": "absences-jeu", "l": "Absences aux réservations", "u": "nombre / %", "m": "Réservations confirmées non honorées ÷ réservations attendues, en distinguant le comptage brut du taux.", "g": 1}, {"id": "refus", "l": "Demandes refusées faute de place", "u": "nombre", "m": "Demandes identifiables auxquelles aucun créneau demandé n’a pu être proposé.", "g": 1}, {"id": "perdues", "l": "Heures de terrain perdues", "u": "h", "m": "Heures fermées, ventilées par pluie, humidité, chaleur, panne et autre cause. Une heure de fermeture est comptée une seule fois dans le total.", "g": 1}, {"id": "affectees", "l": "Réservations touchées par une fermeture", "u": "nombre", "m": "Réservations annulées ou déplacées à la suite d’une fermeture, dédupliquées.", "g": 1}, {"id": "pannes", "l": "Pannes et indisponibilité technique", "u": "nombre / h", "m": "Compter les pannes et les durées de fermeture technique correspondantes par terrain.", "g": 2}, {"id": "interventions", "l": "Interventions de maintenance", "u": "nombre / délai", "m": "Suivre les interventions ouvertes, clôturées et le délai de résolution.", "g": 2}, {"id": "entretien", "l": "Coût de maintenance par terrain", "u": "€", "m": "Somme des coûts d’entretien et interventions affectés à chaque terrain.", "g": 2}, {"id": "consommation", "l": "Consommation d’énergie et d’eau", "u": "kWh / m³ / €", "m": "Relevés et coûts associés sur la période.", "g": 2}, {"id": "heures-recuperables", "l": "Heures récupérables par investissement", "u": "h", "m": "Estimation des fermetures qu’un aménagement permettrait d’éviter, avec distinction des heures réellement vendables.", "g": 2}, {"id": "marge-recuperable", "l": "Marge récupérable par investissement", "u": "€", "m": "Heures récupérables estimées vendues × marge directe additionnelle par heure, selon les hypothèses documentées.", "g": 2}, {"id": "cout-personnel", "l": "Coût employeur complet", "u": "€", "m": "Coût du personnel pour la structure, ventilé par activité lorsque l’affectation est connue.", "g": 3}, {"id": "heures-equipe", "l": "Heures prévues et travaillées", "u": "h", "m": "Comparer planning et relevés d’heures par activité et créneau.", "g": 3}, {"id": "heures-sup", "l": "Heures supplémentaires", "u": "h", "m": "Heures supplémentaires identifiées selon les données de paie et de temps de travail.", "g": 3}, {"id": "absences-equipe", "l": "Absences de l’équipe", "u": "jours / h", "m": "Durée des absences selon les relevés autorisés.", "g": 3}, {"id": "couverture-equipe", "l": "Couverture des créneaux clés", "u": "%", "m": "Créneaux clés effectivement couverts ÷ créneaux clés prévus.", "g": 3}, {"id": "procedures", "l": "Suivi des procédures d’ouverture et de fermeture", "u": "%", "m": "Procédures validées ÷ procédures attendues selon les listes de contrôle.", "g": 3}, {"id": "avis", "l": "Note et volume d’avis", "u": "note / nombre", "m": "Note moyenne et nombre d’avis, avec période et source.", "g": 4}, {"id": "reclamations", "l": "Réclamations par motif", "u": "nombre", "m": "Compter les réclamations distinctes par motif et par activité.", "g": 4}, {"id": "resolution", "l": "Délai de résolution des réclamations", "u": "jours", "m": "Délai entre ouverture et résolution des réclamations clôturées.", "g": 4}, {"id": "incidents", "l": "Incidents d’exploitation", "u": "nombre", "m": "Incidents distincts par activité et catégorie.", "g": 4}, {"id": "satisfaction", "l": "Satisfaction après cours ou événement", "u": "note / %", "m": "Résultats des retours recueillis. Afficher le nombre de réponses et, si connu, le taux de réponse.", "g": 4}, {"id": "c-demandes", "l": "Demandes entrantes des particuliers", "u": "nombre", "m": "Compter les demandes identifiables, dédupliquées par besoin.", "g": 5}, {"id": "c-origine", "l": "Origine de découverte des nouveaux clients", "u": "nombre / %", "m": "Ventiler les premières ventes par origine déclarée ou attribuable. Prévoir une catégorie inconnue. Un événement entreprise peut être une origine.", "g": 5}, {"id": "c-canal", "l": "Canal de première réservation ou d’achat", "u": "nombre / %", "m": "Ventiler par canal utilisé pour le premier achat, distinct de l’origine de découverte.", "g": 5}, {"id": "c-premier-produit", "l": "Premier produit acheté", "u": "nombre / %", "m": "Ventiler les nouveaux clients d’après le produit de leur premier achat identifiable. Documenter le traitement des achats simultanés.", "g": 5}, {"id": "c-nouveaux", "l": "Nouveaux clients payants", "u": "nombre", "m": "Clients identifiables dont le premier achat connu tombe dans la période. Signaler un historique incomplet.", "g": 5}, {"id": "c-reponse", "l": "Délai de première réponse aux particuliers", "u": "h", "m": "Écart entre réception et première réponse sur les demandes suivies.", "g": 5}, {"id": "c-cac", "l": "Coût d’acquisition par canal", "u": "€/client", "m": "Dépenses d’acquisition attribuables au canal ÷ nouveaux clients payants attribués selon la même règle.", "g": 5}, {"id": "c-conversion", "l": "Conversion des demandes en réservations", "u": "%", "m": "Demandes suivies converties ÷ demandes suivies arrivées à décision sur le même périmètre.", "g": 6}, {"id": "c-commandes", "l": "Achats des particuliers", "u": "nombre", "m": "Achats distincts, hors doublons et selon le traitement documenté des annulations.", "g": 6}, {"id": "c-panier", "l": "Panier moyen par achat", "u": "€/achat", "m": "CA BtoC net ÷ nombre d’achats retenus sur le même périmètre.", "g": 6}, {"id": "c-ca-client", "l": "CA moyen par client acheteur", "u": "€/client", "m": "CA attribuable aux clients BtoC identifiés ÷ nombre de clients acheteurs identifiés.", "g": 6}, {"id": "c-couverture", "l": "Part des ventes rattachables à un client", "u": "%", "m": "Ventes liées à un client fiable ÷ total des ventes sur le même périmètre.", "g": 6}, {"id": "c-actifs", "l": "Clients actifs à 30 et 90 jours", "u": "nombre", "m": "Clients identifiés ayant acheté au moins une fois dans la fenêtre considérée.", "g": 7}, {"id": "c-retour30", "l": "Deuxième achat dans les 30 jours", "u": "%", "m": "Nouveaux clients observables au moins 30 jours ayant acheté de nouveau dans ce délai ÷ tous les nouveaux clients observables au moins 30 jours.", "g": 7}, {"id": "c-retour90", "l": "Deuxième achat dans les 90 jours", "u": "%", "m": "Même logique sur 90 jours, avec un groupe arrivé à maturité.", "g": 7}, {"id": "c-frequence", "l": "Fréquence d’achat par client", "u": "achats/client", "m": "Achats attribuables ÷ clients acheteurs identifiés sur la période. Prévoir aussi le détail individuel.", "g": 7}, {"id": "c-visites", "l": "Fréquentation par client", "u": "visites/client", "m": "Présences réellement identifiées par client sur 30 ou 90 jours. La réservation d’un joueur ne prouve pas la présence des autres.", "g": 7}, {"id": "c-delai-visites", "l": "Délai entre deux visites", "u": "jours", "m": "Nombre de jours entre deux présences successives du même client identifiable.", "g": 7}, {"id": "c-inactifs", "l": "Clients devenus inactifs ou perdus", "u": "nombre / %", "m": "Clients de la base à surveiller ayant dépassé le seuil d’inactivité propre au produit ÷ cette base pour le taux. Le seuil et la règle de perte sont à valider.", "g": 7}, {"id": "c-perte", "l": "Motifs de perte des particuliers", "u": "nombre / %", "m": "Motifs déclarés lors de la relance ou d’un non-renouvellement, dont inconnus. Suivre le nombre de clients relancés et le taux de réponse.", "g": 7}, {"id": "c-passerelles", "l": "Passage d’un produit à un autre", "u": "nombre / %", "m": "Part des clients d’un produit initial qui achètent un autre produit dans la fenêtre définie.", "g": 7}, {"id": "c-renouvellement", "l": "Renouvellement des particuliers", "u": "%", "m": "Clients ayant renouvelé ÷ clients arrivés à échéance, par produit et saison.", "g": 7}, {"id": "c-ca12", "l": "CA cumulé par particulier à 12 mois", "u": "€/client", "m": "Somme du CA par particulier pendant les 12 mois suivant son premier achat, pour les cohortes pleinement observables.", "g": 8}, {"id": "c-marge12", "l": "Marge cumulée par particulier à 12 mois", "u": "€/client", "m": "Somme des marges directes attribuables à ce client sur ses 12 premiers mois observables.", "g": 8}, {"id": "c-ltv", "l": "LTV estimée par particulier", "u": "€/client", "m": "Estimation de la marge directe cumulée sur la durée de la relation. Définir et valider l’horizon, la fréquence, la marge et les hypothèses de rétention avant activation.", "g": 8}, {"id": "b-prospection", "l": "Nouvelles entreprises prospectées", "u": "nombre", "m": "Entreprises distinctes contactées pour la première fois sur la période.", "g": 9}, {"id": "b-demandes", "l": "Demandes qualifiées des entreprises", "u": "nombre", "m": "Opportunités avec besoin identifié et retenues selon les critères de qualification à définir.", "g": 9}, {"id": "b-origine", "l": "Origine des contacts entreprise", "u": "nombre / %", "m": "Ventiler les opportunités selon la provenance connue du contact.", "g": 9}, {"id": "b-reponse", "l": "Délai de première réponse entreprise", "u": "h", "m": "Écart entre la réception du contact et la première réponse enregistrée.", "g": 9}, {"id": "b-devis", "l": "Devis envoyés", "u": "nombre / €", "m": "Nombre et valeur des opportunités chiffrées. Identifier la dernière version du devis pour éviter les doublons.", "g": 10}, {"id": "b-signatures", "l": "Entreprises signées", "u": "nombre", "m": "Entreprises distinctes ayant signé sur la période. Compter séparément les premières entreprises signées et le nombre de signatures.", "g": 10}, {"id": "b-conversion", "l": "Taux de signature", "u": "%", "m": "Opportunités gagnées ÷ opportunités clôturées gagnées ou perdues avec devis. Les dossiers ouverts restent dans le pipeline.", "g": 10}, {"id": "b-delai", "l": "Délai de signature", "u": "jours", "m": "Écart entre envoi du devis et signature selon la règle de date retenue.", "g": 10}, {"id": "b-pipeline", "l": "Opportunités ouvertes et prochaines actions", "u": "nombre / €", "m": "Lister chaque opportunité avec son stade, son montant, son échéance et la date de prochaine action.", "g": 10}, {"id": "b-pertes", "l": "Devis perdus et motifs de perte", "u": "nombre / %", "m": "Opportunités perdues et raisons connues. Prévoir la catégorie motif inconnu.", "g": 10}, {"id": "b-ca-signe", "l": "CA signé entreprises", "u": "€", "m": "Valeur des engagements signés, à la date de signature. Le CA réalisé suit la date de prestation et les règles comptables.", "g": 10}, {"id": "b-ca-realise", "l": "CA réalisé entreprises", "u": "€", "m": "Ventes reconnues pour les prestations réalisées sur la période.", "g": 10}, {"id": "b-panier", "l": "Panier moyen par événement", "u": "€/événement", "m": "CA réalisé des événements ÷ événements réalisés sur le même périmètre.", "g": 10}, {"id": "b-marge", "l": "Marge directe par événement", "u": "€", "m": "CA de l’événement moins restauration, encadrement, temps d’équipe affecté et autres coûts directs.", "g": 10}, {"id": "b-mediane", "l": "Marge médiane par événement", "u": "€", "m": "Médiane des marges directes des événements réalisés sur la période.", "g": 10}, {"id": "b-temps", "l": "Temps d’équipe par événement", "u": "h", "m": "Somme des heures de préparation, prestation et remise en état affectées à l’événement.", "g": 10}, {"id": "b-heures", "l": "Heures-terrain mobilisées par événement", "u": "h", "m": "Somme des durées de chaque terrain mobilisé, par sport et créneau.", "g": 10}, {"id": "b-marge-heure", "l": "Marge par heure-terrain entreprise", "u": "€/h", "m": "Marge directe de l’événement ÷ heures-terrain mobilisées.", "g": 10}, {"id": "b-creux", "l": "Événements sur les créneaux habituellement creux", "u": "nombre / %", "m": "Événements sur des créneaux classés creux selon l’historique à définir. Documenter les événements répartis sur plusieurs créneaux.", "g": 10}, {"id": "b-deplacement", "l": "Marge additionnelle après déplacement éventuel", "u": "€", "m": "Marge directe de l’événement moins marge estimée des ventes habituelles déplacées. Marquer l’estimation comme telle.", "g": 10}, {"id": "b-acomptes", "l": "Acomptes attendus et encaissés", "u": "€", "m": "Suivre les acomptes selon leur montant, leur échéance et leur date d’encaissement.", "g": 10}, {"id": "b-soldes", "l": "Soldes entreprises à encaisser", "u": "€", "m": "Solde dû par dossier et échéance, après rapprochement des encaissements.", "g": 10}, {"id": "b-demandes-retour", "l": "Demandes de deuxième date", "u": "nombre", "m": "Entreprises distinctes ayant demandé une deuxième date après un premier événement.", "g": 11}, {"id": "b-retour6", "l": "Deuxième réservation à six mois", "u": "%", "m": "Entreprises ayant réservé à nouveau dans les six mois suivant le premier événement ÷ entreprises dont le premier événement remonte à au moins six mois.", "g": 11}, {"id": "b-retour12", "l": "Deuxième réservation à douze mois", "u": "%", "m": "Même calcul sur douze mois pour les entreprises observables sur la fenêtre complète.", "g": 11}, {"id": "b-frequence", "l": "Fréquence par entreprise", "u": "événements/client", "m": "Événements réalisés ÷ entreprises clientes actives du périmètre, avec détail possible par compte.", "g": 11}, {"id": "b-renouvellement", "l": "Renouvellement des contrats récurrents", "u": "%", "m": "Contrats renouvelés ÷ contrats éligibles arrivés à échéance.", "g": 11}, {"id": "b-inactifs", "l": "Entreprises devenues inactives ou perdues", "u": "nombre / %", "m": "Comptes arrivés à échéance sans renouvellement ou dépassant un délai de retour défini. Éviter de mélanger perte déclarée et inactivité présumée.", "g": 11}, {"id": "b-motifs", "l": "Motifs de non-retour entreprise", "u": "nombre / %", "m": "Ventiler les raisons déclarées et identifier les comptes dont le motif reste inconnu.", "g": 11}, {"id": "b-ca12", "l": "CA cumulé par entreprise à 12 mois", "u": "€/entreprise", "m": "CA reconnu auprès de l’entreprise dans les 12 mois suivant sa première prestation réalisée.", "g": 12}, {"id": "b-marge12", "l": "Marge cumulée par entreprise à 12 mois", "u": "€/entreprise", "m": "Somme des marges directes attribuables à l’entreprise sur la même fenêtre.", "g": 12}, {"id": "b-ltv", "l": "LTV estimée par entreprise", "u": "€/entreprise", "m": "Marge directe totale estimée sur la durée de la relation, avec hypothèses de fréquence, marge et renouvellement à valider.", "g": 12}, {"id": "e-inscriptions", "l": "Inscriptions par groupe", "u": "nombre", "m": "Nombre d’inscrits confirmés par groupe, niveau et sport. Distinguer inscrits, adhérents et licenciés.", "g": 13}, {"id": "e-effectifs", "l": "Adhérents et licenciés", "u": "nombre", "m": "Dénombrer séparément les adhérents et les licenciés selon la saison et la structure.", "g": 13}, {"id": "e-attente", "l": "Liste d’attente", "u": "nombre", "m": "Nombre de personnes en attente par groupe ou stage.", "g": 13}, {"id": "e-remplissage", "l": "Remplissage des cours et stages", "u": "%", "m": "Places confirmées ÷ places ouvertes par groupe ou session.", "g": 13}, {"id": "e-presence", "l": "Taux de présence", "u": "%", "m": "Présences constatées ÷ présences attendues aux séances.", "g": 13}, {"id": "e-marge", "l": "CA et marge par groupe ou stage", "u": "€", "m": "CA attribué au groupe ou au stage moins les coûts directs correspondants pour la marge.", "g": 13}, {"id": "e-encadrement", "l": "Coût d’encadrement par heure", "u": "€/h", "m": "Coût d’encadrement affecté ÷ heures d’encadrement assurées.", "g": 13}, {"id": "e-renouvellement", "l": "Renouvellement à la rentrée", "u": "%", "m": "Inscrits de la saison précédente réinscrits ÷ anciens inscrits éligibles.", "g": 13}, {"id": "a-remplissage", "l": "Remplissage des tournois et américaines", "u": "%", "m": "Places confirmées ÷ places ouvertes par édition, avec une unité homogène joueurs ou équipes.", "g": 14}, {"id": "a-delai", "l": "Délai de remplissage des animations", "u": "jours", "m": "Délai entre ouverture des inscriptions et remplissage. Identifier les éditions jamais complètes.", "g": 14}, {"id": "a-desistements", "l": "Désistements des animations", "u": "nombre / %", "m": "Désistements et part des inscrits ayant annulé par édition.", "g": 14}, {"id": "a-marge", "l": "CA et marge par édition", "u": "€", "m": "CA attribué à l’édition et marge après coûts directs.", "g": 14}, {"id": "a-retour", "l": "Participants qui reviennent après une animation", "u": "%", "m": "Participants identifiables qui reprennent une place ou réservent ensuite ÷ participants identifiables observables sur la durée choisie.", "g": 14}, {"id": "a-snack", "l": "Ventes snack associées à l’animation", "u": "€", "m": "CA caisse traçable à l’édition, en évitant son double comptage dans le CA global.", "g": 14}, {"id": "s-ca", "l": "CA snack par service et produit", "u": "€", "m": "CA net par service, produit et segment acheteur quand il est identifiable.", "g": 15}, {"id": "s-tickets", "l": "Tickets snack", "u": "nombre", "m": "Tickets distincts sur la période, par service.", "g": 15}, {"id": "s-panier", "l": "Panier moyen snack", "u": "€/ticket", "m": "CA net du service ÷ tickets correspondants.", "g": 15}, {"id": "s-matiere", "l": "Coût matière snack", "u": "€ / %", "m": "Coût des matières consommées, rapporté au CA snack si exprimé en pourcentage.", "g": 15}, {"id": "s-pertes", "l": "Pertes matières snack", "u": "€ / quantité", "m": "Produits jetés ou écartés, en quantités adaptées et en coût.", "g": 15}, {"id": "s-marge", "l": "Marge snack par service et produit", "u": "€", "m": "CA moins coût matière et autres coûts directs affectés. Inclure le temps affecté quand il est mesurable.", "g": 15}, {"id": "s-conversion", "l": "Visites sportives avec achat snack", "u": "%", "m": "Visites sportives identifiables associées à au moins un achat snack ÷ visites sportives pour lesquelles le rapprochement est fiable.", "g": 15}, {"id": "ann-ventes", "l": "Anniversaires vendus et réalisés", "u": "nombre", "m": "Réservations confirmées et prestations effectivement réalisées, suivies séparément.", "g": 16}, {"id": "ann-marge", "l": "Panier et marge par anniversaire", "u": "€", "m": "CA moyen par prestation et marge directe par formule.", "g": 16}], "prods": [{"n": "Locations padel", "seg": "BtoC", "sports": "Padel", "ids": ["occupation", "prix-heure", "revenu-heure", "marge-heure"]}, {"n": "Locations tennis", "seg": "BtoC", "sports": "Tennis", "ids": ["occupation", "prix-heure", "revenu-heure", "marge-heure"]}, {"n": "Locations foot à 5", "seg": "BtoC", "sports": "Foot à 5", "ids": ["occupation", "prix-heure", "revenu-heure", "marge-heure"]}, {"n": "École et cours collectifs padel", "seg": "BtoC", "sports": "Padel", "ids": ["e-inscriptions", "e-remplissage", "e-presence", "e-marge", "e-renouvellement"]}, {"n": "École et cours collectifs tennis", "seg": "BtoC", "sports": "Tennis", "ids": ["e-inscriptions", "e-remplissage", "e-presence", "e-marge", "e-renouvellement"]}, {"n": "Stages padel", "seg": "BtoC", "sports": "Padel", "ids": ["e-inscriptions", "e-remplissage", "e-presence", "e-marge"]}, {"n": "Stages tennis", "seg": "BtoC", "sports": "Tennis", "ids": ["e-inscriptions", "e-remplissage", "e-presence", "e-marge"]}, {"n": "Cours individuels", "seg": "BtoC", "sports": "Padel, Tennis", "ids": ["ca", "marge", "e-encadrement"]}, {"n": "Américaines", "seg": "BtoC", "sports": "Padel", "ids": ["a-remplissage", "a-marge", "a-retour", "a-snack"]}, {"n": "Tournois ouverts", "seg": "BtoC", "sports": "À préciser", "ids": ["a-remplissage", "a-marge", "a-retour", "a-snack"]}, {"n": "Anniversaires", "seg": "BtoC", "sports": "À préciser", "ids": ["ann-ventes", "ann-marge"]}, {"n": "Team buildings", "seg": "BtoB", "sports": "À préciser", "ids": ["b-ca-realise", "b-marge", "b-marge-heure", "b-retour6"]}, {"n": "Tournois d’entreprise", "seg": "BtoB", "sports": "À préciser", "ids": ["b-ca-realise", "b-marge", "b-marge-heure", "b-retour6"]}, {"n": "Journées et séminaires", "seg": "BtoB", "sports": "À préciser", "ids": ["b-ca-realise", "b-marge", "b-temps", "b-retour6"]}, {"n": "Privatisations", "seg": "BtoB", "sports": "À préciser", "ids": ["b-marge", "b-marge-heure", "b-deplacement", "b-creux"]}, {"n": "Créneaux réguliers entreprises", "seg": "BtoB", "sports": "À préciser", "ids": ["b-ca-realise", "b-frequence", "b-renouvellement"]}, {"n": "Restauration de groupe", "seg": "BtoB", "sports": "À préciser", "ids": ["b-panier", "b-marge", "s-matiere"]}, {"n": "Snack", "seg": "Commun", "sports": "À préciser", "ids": ["s-ca", "s-tickets", "s-panier", "s-marge", "s-conversion"]}]};

const AV = ["À relier", "Process en cours", "Prêt à relier"];
const SEGS = ["BtoC", "BtoB", "Commun"];
const IND = D.inds.map(function (i) {
  const g = D.groups[i.g];
  return { id: i.id, l: i.l, u: i.u, m: i.m, seg: g.seg, fam: g.fam, freq: g.freq, src: g.src };
});
const BY = {}; IND.forEach(function (i) { BY[i.id] = i; });
const FAMS = []; D.groups.forEach(function (g) { if (FAMS.indexOf(g.fam) < 0) FAMS.push(g.fam); });

const CARDS = [
  { t: "Chiffre d’affaires par activité", ids: ["ca"], d: "Identifier les activités qui expliquent l’écart de CA." },
  { t: "Marge par activité", ids: ["marge"], d: "Évaluer les prix et les coûts directement affectés." },
  { t: "Résultat d’exploitation mensuel", ids: ["resultat"], d: "Mesurer la rentabilité après les charges communes." },
  { t: "Trésorerie prévisionnelle", ids: ["solde", "point-bas", "treize-semaines"], d: "Repérer les échéances et le point bas de trésorerie." },
  { t: "Occupation des terrains", ids: ["occupation", "usage"], d: "Repérer les créneaux à remplir ou qui saturent." },
  { t: "Revenu par heure de terrain disponible", ids: ["revenu-heure", "marge-heure"], d: "Comparer les créneaux et arbitrer leur usage." },
  { t: "Heures de terrain perdues", ids: ["perdues", "affectees"], d: "Mesurer les fermetures et leurs conséquences." },
  { t: "Nouveaux clients payants", ids: ["c-nouveaux", "c-origine", "c-canal"], d: "Identifier les origines des premiers achats." },
  { t: "Retour à 30 jours", ids: ["c-retour30"], d: "Mesurer le deuxième achat des particuliers." },
  { t: "Entreprises signées et marge par événement", ids: ["b-signatures", "b-ca-signe", "b-marge", "b-demandes-retour"], d: "Vérifier la rentabilité et les premiers signes de récurrence." },
  { t: "Remplissage des activités encadrées", ids: ["e-remplissage", "a-remplissage"], d: "Ajuster les places ouvertes selon la demande." },
  { t: "Coût et heures du personnel", ids: ["cout-personnel", "heures-equipe"], d: "Adapter le planning aux besoins des activités." }
];

/* Classement de navigation par activité (ne préjuge pas d’une offre commercialisée). */
const ACTS = ["Location de terrains", "École, cours et stages", "Animations", "Anniversaires", "Offres entreprise", "Restauration et snack"];
const PROD_META = [
  ["Location de terrains", "Heures vendues et capacité proposée"],
  ["Location de terrains", "Heures vendues et capacité proposée"],
  ["Location de terrains", "Heures vendues et capacité proposée"],
  ["École, cours et stages", "Places vendues, capacité, renouvellement"],
  ["École, cours et stages", "Places vendues, capacité, renouvellement"],
  ["École, cours et stages", "Places vendues, capacité, réachat"],
  ["École, cours et stages", "Places vendues, capacité, réachat"],
  ["École, cours et stages", "Réachat"],
  ["Animations", "Places vendues, capacité, réachat"],
  ["Animations", "Places vendues, capacité, réachat"],
  ["Anniversaires", "Réachat"],
  ["Offres entreprise", "Réachat"],
  ["Offres entreprise", "Réachat"],
  ["Offres entreprise", "Réachat"],
  ["Offres entreprise", "Réachat"],
  ["Offres entreprise", "Renouvellement"],
  ["Offres entreprise", "Réachat"],
  ["Restauration et snack", "Sans objet en V1"]
];
function slug(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
const PRODS = D.prods.map(function (p, k) {
  const known = p.sports === "À préciser" ? [] : p.sports.split(",").map(function (s) { return s.trim(); });
  return { slug: slug(p.n), n: p.n, seg: p.seg, sports: known, act: PROD_META[k][0], fut: PROD_META[k][1], ids: p.ids };
});
const SPORTS = ["Padel", "Tennis", "Foot à 5"];

const SCOPE_OPTS = {
  periode: [["7j", "7 derniers jours"], ["28j", "28 derniers jours"], ["mois", "Mois en cours"], ["mois-1", "Mois précédent"]],
  structure: ["Association", "SARL"],
  sport: SPORTS,
  activite: ACTS,
  creneau: ["Journée", "Soirée", "Week-end"]
};
const SCOPE_LBL = { periode: "Période", structure: "Association / SARL", sport: "Sport", activite: "Activité", creneau: "Créneau" };

const RULES = [
  "Chaque vente porte un segment acheteur BtoC ou BtoB et une structure de facturation ou d’encaissement. Une vente occasionnée par un événement BtoB et payée ensuite à titre personnel relève du BtoC ; l’événement peut être son origine de découverte. L’origine et le canal de réservation demeurent distincts.",
  "La synthèse affiche BtoC, BtoB et le périmètre commun. Les dimensions segment et structure sont indépendantes. Distinguer les éventuels flux internes des flux externes pour une vue globale dédupliquée. Documenter le traitement comptable avant connexion.",
  "Enregistrer des dates distinctes pour demande, achat, réservation, prestation, facture et encaissement quand elles s’appliquent. Distinguer CA signé, CA réalisé, encaissement et crédits prépayés.",
  "Distinguer capacité théorique, capacité jouable, capacité mise en vente, réservation et usage réel. Les cours, événements et fermetures demandent des états distincts. Une heure ouverte simultanément sur plusieurs terrains correspond à plusieurs heures-terrain.",
  "Pour les ratios futurs, préciser le périmètre et le dénominateur. Une source absente ou un dénominateur nul rend le résultat indisponible. Utiliser des groupes observables sur la totalité de la fenêtre pour mesurer le retour ou la valeur sur douze mois.",
  "Distinguer panier par achat, CA par client, fréquentation et LTV. Présenter la valeur réellement observée à douze mois avant toute estimation de LTV. L’hypothèse d’inactivité varie par produit. Retenir « motif inconnu » si la raison d’un départ est absente.",
  "Pendant le raccordement, confirmer pour chaque fiche le propriétaire, la source, la clé de rapprochement, les dates, la méthode, les conditions d’éligibilité et la fréquence. Contrôler doublons, périodes manquantes et cohérence avec les sources. Les objectifs et seuils seront validés sur l’historique comparable. Aucun chiffre ni seuil de performance n’est prérempli."
];

/* ===== Données : API du site (Supabase côté serveur) ===== */
const store = { mode: "boot", loaded: false, broken: false, last: null, canWrite: true,
  data: { v: 1, notes: {}, decisions: [] }, pending: false, dirty: false, pendingDel: null,
  reglages: null, playtomic: null };
const M = { loading: false, res: null, err: "" };
const PAIE = ["cout-personnel", "heures-equipe"];
const LIVE = ["capacite", "jouables", "louables", "reservees", "occupation", "usage", "vides", "revenu-heure", "prix-heure", "duree", "annulations"];
function str(v, max) { return typeof v === "string" ? v.slice(0, max || 2000) : ""; }
function isoDate(v) { return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ""; }
function cleanNote(n) {
  n = n || {};
  return { resp: str(n.resp, 200), src: str(n.src, 400), date: isoDate(n.date), proc: str(n.proc), next: str(n.next), av: AV.indexOf(n.av) >= 0 ? n.av : AV[0] };
}
function noteFromRow(r) { return cleanNote({ resp: r.responsable, src: r.source, date: r.date_cible, proc: r.process, next: r.prochaine, av: r.avancement }); }
function noteToRow(n) { return { responsable: n.resp, source: n.src, date_cible: n.date || "", process: n.proc, prochaine: n.next, avancement: n.av }; }
function cleanDec(d) {
  if (!d || typeof d !== "object" || !str(d.id, 60) || !str(d.titre, 300)) return null;
  return { id: str(d.id, 60), titre: str(d.titre, 300), resp: str(d.resp, 200), ech: isoDate(d.ech), per: SEGS.indexOf(d.per) >= 0 ? d.per : "",
    ind: BY[d.ind] ? d.ind : "", constat: str(d.constat), attendu: str(d.attendu),
    statut: ["À faire", "En cours", "Terminée"].indexOf(d.statut) >= 0 ? d.statut : "À faire", prio: d.prio === true, cree: str(d.cree, 40) };
}
function decFromRow(r) { return cleanDec({ id: r.id, titre: r.titre, resp: r.responsable, ech: r.echeance, per: r.perimetre, ind: r.indicator_id, constat: r.constat, attendu: r.attendu, statut: r.statut, prio: r.prioritaire, cree: r.created_at }); }
function decToRow(d) { return { titre: d.titre, responsable: d.resp || "", echeance: d.ech || "", perimetre: d.per || "", indicator_id: d.ind || "", constat: d.constat || "", attendu: d.attendu || "", statut: d.statut, prioritaire: !!d.prio }; }
function sortDecs(list) { return list.sort(function (a, b) { return a.cree < b.cree ? 1 : a.cree > b.cree ? -1 : 0; }); }
function setStatus(state, text) {
  const el = document.getElementById("save-status");
  el.dataset.state = state; document.getElementById("save-text").textContent = text;
}
function hhmm(d) { return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
function fmtDateTime(iso) { const d = new Date(iso); return d.toLocaleDateString("fr-FR") + " à " + hhmm(d); }
function showStatus() {
  if (!store.loaded) return setStatus(store.broken ? "error" : "wait", store.broken ? "Données indisponibles. Rechargez la page." : "Chargement…");
  const s = store.playtomic && store.playtomic.syncs && store.playtomic.syncs[0];
  const sync = s ? (s.status === "failed" ? "dernière synchronisation Playtomic en échec" : "Playtomic synchronisé le " + fmtDateTime(s.finished_at || s.started_at)) : "Playtomic pas encore synchronisé";
  setStatus(s && s.status === "failed" ? "error" : "on", (store.last ? "Enregistré à " + hhmm(store.last) + " · " : "") + sync);
}
function note(id) { return store.data.notes[id] || { resp: "", src: "", date: "", proc: "", next: "", av: AV[0] }; }

async function api(method, url, body) {
  const res = await fetch(url, { method: method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
  if (res.status === 401) { window.location.href = "/login"; throw { message: "Session expirée : reconnectez-vous." }; }
  const json = await res.json().catch(function () { return null; });
  if (!res.ok) throw { message: (json && json.error) || "Le serveur a répondu " + res.status + "." };
  return json;
}
/* ops : [{col:"notes"|"decisions", id, rec} ou {col, id, del:true}] ; renvoie {ok, where, text} */
async function commit(ops) {
  if (!store.loaded) return { ok: false, text: "Chargement en cours. Réessayez dans quelques secondes." };
  try {
    for (const op of ops) {
      if (op.col === "notes") {
        const row = await api("PUT", "/api/fiches/" + encodeURIComponent(op.id), noteToRow(cleanNote(op.rec)));
        store.data.notes[op.id] = noteFromRow(row);
      } else if (op.del) {
        await api("DELETE", "/api/decisions/" + encodeURIComponent(op.id));
        store.data.decisions = store.data.decisions.filter(function (d) { return d.id !== op.id; });
      } else {
        const exists = store.data.decisions.some(function (d) { return d.id === op.id; });
        const row = exists ? await api("PUT", "/api/decisions/" + encodeURIComponent(op.id), decToRow(op.rec)) : await api("POST", "/api/decisions", decToRow(op.rec));
        const dec = decFromRow(row);
        store.data.decisions = sortDecs(store.data.decisions.filter(function (d) { return d.id !== op.id && d.id !== dec.id; }).concat([dec]));
      }
    }
    store.last = new Date(); showStatus();
    return { ok: true, where: "dans la base" };
  } catch (e) { return { ok: false, text: e && e.message ? e.message : "Enregistrement impossible pour l’instant. Réessayez." }; }
}
function isEditing() {
  const a = document.activeElement, m = document.getElementById("contenu");
  return store.dirty || (a && m.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
}
document.addEventListener("input", function (e) { if (e.target.closest && e.target.closest("#note-form, #dec-form, #reg-form")) store.dirty = true; });

async function loadAll() {
  try {
    const s = await api("GET", "/api/etat");
    const n = {}; (s.notes || []).forEach(function (r) { if (BY[r.indicator_id]) n[r.indicator_id] = noteFromRow(r); });
    const l = []; (s.decisions || []).forEach(function (r) { const d = decFromRow(r); if (d) l.push(d); });
    store.data = { v: 1, notes: n, decisions: sortDecs(l) };
    store.reglages = s.reglages; store.playtomic = s.playtomic;
    store.loaded = true; store.broken = false;
  } catch (e) { store.broken = true; }
  showStatus();
  if (!isEditing()) rerender();
  loadMesures();
}
let mesuresSeq = 0;
async function loadMesures() {
  const seq = ++mesuresSeq;
  M.loading = true; M.err = "";
  const q = new URLSearchParams({ periode: scope.periode || "28j", sport: scope.sport || "", creneau: scope.creneau || "" });
  try { const r = await api("GET", "/api/mesures?" + q.toString()); if (seq !== mesuresSeq) return; M.res = r; }
  catch (e) { if (seq !== mesuresSeq) return; M.res = null; M.err = e && e.message ? e.message : "Mesures indisponibles."; }
  M.loading = false;
  if (!isEditing()) rerender();
}
/* Une mesure calculée, ou null si indisponible. */
function metric(id) {
  if (!M.res || !M.res.mesures) return null;
  const m = M.res.mesures[id];
  return m && m.status !== "na" ? m : null;
}
function sourceOf(id) {
  if (!M.res) return null;
  if (LIVE.indexOf(id) >= 0 && M.res.connecte) return "Playtomic (réservations)";
  if (PAIE.indexOf(id) >= 0 && M.res.sources && M.res.sources.paie) return "Bulletins de paie";
  return null;
}
/* Libellé de période d'une mesure : mois de paie, ou période et filtres choisis. */
function periodOf(id) {
  const m = metric(id);
  if (!m) return "";
  if (m.periode) return m.periode;
  return M.res.periode.libelle + (scope.sport ? " · " + scope.sport : "") + (scope.creneau ? " · " + scope.creneau : "");
}
function metricReason(id) {
  if (LIVE.indexOf(id) < 0 && PAIE.indexOf(id) < 0) return null;
  if (M.loading && !M.res) return "Calcul en cours…";
  if (M.err) return M.err;
  if (!M.res) return null;
  if (LIVE.indexOf(id) >= 0 && !M.res.connecte) return M.res.raison;
  const m = M.res.mesures[id];
  return m && m.status === "na" ? m.reason : null;
}
function valHtml(id) {
  const m = metric(id);
  return m ? '<span class="val">' + esc(m.display) + "</span>" : NA;
}
function trendHtml(id) {
  const t = M.res && M.res.tendances ? M.res.tendances[id] : null;
  return t ? '<span class="val">' + esc(t) + '</span><span class="sr"> par rapport à la période précédente</span>' : NA;
}

/* ===== Outils d’affichage ===== */
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
const NA = '<span class="na"><span aria-hidden="true">—</span><span class="sr">Indisponible</span></span>';
function segTag(s) { return '<span class="tag seg-' + esc(s) + '">' + esc(s === "Commun" ? "Commun" : s) + "</span>"; }
function avTag(id) { const a = note(id).av; return '<span class="tag av-' + AV.indexOf(a) + '"><span class="sr">Avancement : </span>' + esc(a) + "</span>"; }
function connTag(id) {
  const s = id ? sourceOf(id) : null;
  if (s) return '<span class="tag live">Connexion : ' + esc(s.split(" (")[0]) + "</span>";
  return '<span class="tag conn">Connexion : À relier</span>';
}
function estTag(id) { const m = metric(id); return m && m.status === "estimate" ? '<span class="tag est">Estimation</span>' : ""; }
function ficheHref(id) { return "#fiche-" + id; }
function ficheLink(id) { const i = BY[id]; return '<a href="' + ficheHref(id) + '">' + esc(i.l) + ' <span class="id">' + esc(id) + "</span></a>"; }
function linksList(ids) { return '<ul class="links">' + ids.map(function (id) { return "<li>" + ficheLink(id) + "</li>"; }).join("") + "</ul>"; }
function fmtDate(iso) { if (!iso) return ""; const p = iso.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

function indRow(i) {
  return '<div class="row"><div><h3><a href="' + ficheHref(i.id) + '">' + esc(i.l) + '</a></h3>' +
    '<div class="meta"><code>' + esc(i.id) + "</code> · " + esc(i.u) + " · " + esc(i.freq) + "</div></div>" +
    '<div class="side"><div class="tags">' + avTag(i.id) + connTag(i.id) + estTag(i.id) + '</div><div class="small muted">Valeur : ' + valHtml(i.id) + "</div></div></div>";
}
function famSection(seg, fam, intro) {
  const g = D.groups.find(function (x) { return x.seg === seg && x.fam === fam; });
  const list = IND.filter(function (i) { return i.seg === seg && i.fam === fam; });
  return '<section aria-labelledby="h-' + slug(seg + fam) + '"><div class="section-head"><h2 id="h-' + slug(seg + fam) + '">' + esc(fam) + "</h2>" +
    '<span class="small muted">' + list.length + " fiches · " + esc(g.freq) + " · Sources envisagées : " + esc(g.src) + "</span></div>" +
    (intro ? '<p class="small muted">' + esc(intro) + "</p>" : "") +
    '<div class="list">' + list.map(indRow).join("") + "</div></section>";
}

/* Filtres de périmètre partagés (cadrent l’analyse à venir). */
const scope = { periode: "28j", structure: "", sport: "", activite: "", creneau: "" };
function scopeBar(active, note) {
  let h = '<form class="filters" data-scope aria-label="Filtres de périmètre" onsubmit="return false">';
  Object.keys(SCOPE_OPTS).forEach(function (k) {
    const all = (k === "activite" || k === "structure") ? "Toutes" : "Tous";
    h += '<div class="field"><label for="sc-' + k + '">' + esc(SCOPE_LBL[k]) + '</label><select id="sc-' + k + '" data-k="' + k + '">' + (k === "periode" ? "" : '<option value="">' + all + "</option>") +
      SCOPE_OPTS[k].map(function (o) {
        const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o;
        return '<option value="' + esc(v) + '"' + (scope[k] === v ? " selected" : "") + ">" + esc(l) + "</option>";
      }).join("") + "</select></div>";
  });
  h += "</form>";
  h += '<p class="note">' + esc(note || "Période, sport et créneau s’appliquent aux mesures Terrains calculées depuis Playtomic. Association / SARL et activité cadrent l’analyse à venir : aucune source ne les renseigne encore.") + "</p>";
  return h;
}
function bindScope(onChange) {
  $all("form[data-scope] select").forEach(function (s) {
    s.addEventListener("change", function () {
      scope[s.dataset.k] = s.value;
      if (onChange) onChange();
      if (["periode", "sport", "creneau"].indexOf(s.dataset.k) >= 0) { s.blur(); loadMesures(); }
    });
  });
}

/* ===== Vues ===== */
let synthSeg = "";
function viewSynthese(m) {
  let h = "<h1>Synthèse de direction</h1>" +
    '<p class="lede">Douze cartes pour piloter l’activité. Les cartes Terrains sont calculées depuis Playtomic ; la tendance compare à la période précédente de même durée. Les autres valeurs, et tous les objectifs, restent indisponibles tant que leur source n’est pas reliée.</p>';
  h += '<div class="filters" role="group" aria-label="Périmètre des cartes"><div class="field"><span class="lbl" id="seg-lbl">Cartes disposant de fiches du périmètre</span><div class="seg-switch" role="radiogroup" aria-labelledby="seg-lbl">' +
    [["", "Tous"], ["BtoC", "BtoC"], ["BtoB", "BtoB"], ["Commun", "Commun"]].map(function (o) {
      return '<label><input type="radio" name="synth-seg" value="' + o[0] + '"' + (synthSeg === o[0] ? " checked" : "") + "><span>" + o[1] + "</span></label>";
    }).join("") + "</div></div></div>";
  h += scopeBar();
  h += '<p class="small muted" id="cards-count" aria-live="polite"></p><div class="grid" id="cards"></div>';
  m.innerHTML = h;
  function draw() {
    const cards = CARDS.filter(function (c) { return !synthSeg || c.ids.some(function (id) { return BY[id].seg === synthSeg; }); });
    $("#cards-count").textContent = cards.length + " carte" + (cards.length > 1 ? "s" : "") + " sur 12";
    $("#cards").innerHTML = cards.map(function (c) {
      const segs = []; c.ids.forEach(function (id) { if (segs.indexOf(BY[id].seg) < 0) segs.push(BY[id].seg); });
      const main = c.ids[0];
      const per = metric(main) ? '<p class="small muted" style="margin:0">' + esc(BY[main].l) + " · " + esc(periodOf(main)) + "</p>" : "";
      return '<article class="card"><h3>' + esc(c.t) + '</h3><div class="tags">' + segs.map(segTag).join("") + connTag(main) + estTag(main) + "</div>" +
        '<dl class="kv"><div><dt>Valeur</dt><dd>' + valHtml(main) + "</dd></div><div><dt>Objectif</dt><dd>" + NA + "</dd></div><div><dt>Écart</dt><dd>" + NA + "</dd></div><div><dt>Tendance</dt><dd>" + trendHtml(main) + "</dd></div></dl>" + per +
        '<p class="decision"><strong>Décision éclairée :</strong> ' + esc(c.d) + "</p>" +
        '<div class="small muted">Fiches correspondantes</div>' + linksList(c.ids) + "</article>";
    }).join("");
  }
  $all('input[name="synth-seg"]').forEach(function (r) { r.addEventListener("change", function () { synthSeg = r.value; draw(); }); });
  bindScope();
  draw();
}

function viewBtoC(m) {
  let h = "<h1>BtoC · Particuliers</h1>" +
    '<p class="lede">Le BtoC identifie le particulier qui achète. Les présents à une séance et l’auteur d’une réservation restent des unités distinctes : la réservation d’un joueur ne prouve pas la présence des autres.</p>' + scopeBar();
  ["Attirer", "Vendre", "Répliquer", "Valeur client"].forEach(function (f) { h += famSection("BtoC", f); });
  h += '<h2 style="margin-top:36px">Vues d’activité</h2>';
  h += famSection("BtoC", "École, cours et stages", "Distinguer inscrits, adhérents et licenciés.");
  h += famSection("BtoC", "Animations", "Unité homogène joueurs ou équipes par édition.");
  h += famSection("BtoC", "Anniversaires", "Réservations confirmées et prestations réalisées suivies séparément.");
  m.innerHTML = h; bindScope();
}

function viewBtoB(m) {
  let h = "<h1>BtoB · Entreprises</h1>" +
    '<p class="lede">Une entreprise est un compte client distinct d’un contact ou d’un participant. Les fiches et méthodes sont disponibles en V1 ; aucun dossier commercial n’est initialisé.</p>' + scopeBar();
  ["Attirer", "Vendre", "Répliquer", "Valeur client"].forEach(function (f) { h += famSection("BtoB", f); });
  h += '<section aria-labelledby="h-fut"><div class="section-head"><h2 id="h-fut">Vues futures</h2><span class="small muted">Activées au raccordement du suivi commercial</span></div>' +
    '<p class="small muted">Chaque opportunité pourra être suivie par stade et par prochaine action une fois son process raccordé.</p><div class="grid">';
  [["Pipeline", "Stade, montant, échéance et date de prochaine action par opportunité.", ["b-pipeline", "b-devis", "b-conversion"]],
   ["Signatures", "Premières entreprises signées et nombre de signatures, comptés séparément.", ["b-signatures", "b-ca-signe", "b-delai"]],
   ["Événements", "Événements réalisés, marge, temps d’équipe et heures-terrain.", ["b-ca-realise", "b-marge", "b-heures"]],
   ["Acomptes", "Montant, échéance et date d’encaissement.", ["b-acomptes"]],
   ["Soldes", "Solde dû par dossier après rapprochement des encaissements.", ["b-soldes"]]].forEach(function (v) {
    h += '<article class="card"><h3>' + esc(v[0]) + '</h3><p class="small muted">' + esc(v[1]) + '</p><div class="empty small" style="padding:10px"><p style="margin:0">Aucun dossier commercial initialisé.</p></div>' +
      '<div class="small muted" style="margin-top:8px">Fiches liées</div>' + linksList(v[2]) + "</article>";
  });
  h += "</div></section>";
  m.innerHTML = h; bindScope();
}

function viewExploitation(m) {
  let h = "<h1>Exploitation</h1>" +
    '<p class="lede">Données communes aux deux segments. Elles restent identifiées comme communes : une vente ou un coût n’est compté qu’une fois dans la vue globale (ex. ventes snack d’une animation, crédits prépayés, charges partagées).</p>' + scopeBar();
  ["Finance", "Terrains", "Installations", "Équipe", "Qualité", "Snack"].forEach(function (f) { h += famSection("Commun", f); });
  m.innerHTML = h; bindScope();
}

function prodMatches(p) {
  if (scope.activite && p.act !== scope.activite) return false;
  if (scope.sport && p.sports.length && p.sports.indexOf(scope.sport) < 0) return false;
  return true;
}
function prodCard(p) {
  return '<article class="card"><h3><a href="#produit-' + p.slug + '">' + esc(p.n) + "</a></h3>" +
    '<div class="tags">' + segTag(p.seg) + '<span class="tag">' + esc(p.act) + "</span>" +
    (p.sports.length ? p.sports.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") : '<span class="tag conn">Sports à préciser</span>') + "</div>" +
    '<dl class="kv three"><div><dt>Volume</dt><dd>' + NA + "</dd></div><div><dt>CA</dt><dd>" + NA + "</dd></div><div><dt>Marge</dt><dd>" + NA + "</dd></div></dl>" +
    '<p class="small muted">Mesures futures : ' + esc(p.fut) + "</p>" +
    '<div class="small muted">Fiches liées</div>' + linksList(p.ids) + "</article>";
}
function viewProduits(m) {
  let h = "<h1>Produits</h1>" +
    '<p class="lede">Catalogue de navigation des offres. Les sports et activités sont un classement de navigation : il n’en découle pas qu’une offre est commercialisée. Une offre dont les sports restent à préciser demeure visible quel que soit le sport choisi.</p>' +
    scopeBar(null, "Sport et activité filtrent le catalogue ci-dessous. Volume, CA et marge par offre restent à relier.");
  h += '<p class="small muted" id="prod-count" aria-live="polite"></p><div class="grid" id="prods"></div>';
  h += '<h2>Classement par sport et activité</h2><p class="small muted">Nombre de fiches produit du catalogue (donnée structurelle).</p><div class="table-wrap"><table><thead><tr><th scope="col">Activité</th>' +
    SPORTS.map(function (s) { return '<th scope="col">' + esc(s) + "</th>"; }).join("") + '<th scope="col">À préciser</th></tr></thead><tbody>' +
    ACTS.map(function (a) {
      const ps = PRODS.filter(function (p) { return p.act === a; });
      function cell(list) { return list.length ? list.map(function (p) { return '<a href="#produit-' + p.slug + '">' + esc(p.n) + "</a>"; }).join("<br>") : '<span class="muted">·</span>'; }
      return '<tr><th scope="row">' + esc(a) + "</th>" + SPORTS.map(function (s) { return "<td>" + cell(ps.filter(function (p) { return p.sports.indexOf(s) >= 0; })) + "</td>"; }).join("") +
        "<td>" + cell(ps.filter(function (p) { return !p.sports.length; })) + "</td></tr>";
    }).join("") + "</tbody></table></div>";
  m.innerHTML = h;
  function draw() {
    const list = PRODS.filter(prodMatches);
    $("#prod-count").textContent = list.length + " offre" + (list.length > 1 ? "s" : "") + " sur " + PRODS.length;
    $("#prods").innerHTML = list.length ? list.map(prodCard).join("") :
      '<div class="empty"><p>Aucune offre ne correspond à ce sport et à cette activité.</p><button type="button" id="prod-reset">Réinitialiser sport et activité</button></div>';
    const r = $("#prod-reset");
    if (r) r.addEventListener("click", function () { scope.sport = ""; scope.activite = ""; $("#sc-sport").value = ""; $("#sc-activite").value = ""; draw(); $("#sc-sport").focus(); });
  }
  bindScope(draw); draw();
}
function viewProduit(m, s) {
  const p = PRODS.find(function (x) { return x.slug === s; });
  if (!p) return viewNotFound(m, "Offre introuvable.");
  m.innerHTML = '<div class="crumbs"><a href="#produits">← Produits</a></div><h1>' + esc(p.n) + "</h1>" +
    '<div class="tags">' + segTag(p.seg) + '<span class="tag">' + esc(p.act) + "</span>" + (p.sports.length ? p.sports.map(function (x) { return '<span class="tag">' + esc(x) + "</span>"; }).join("") : '<span class="tag conn">Sports à préciser</span>') + connTag() + "</div>" +
    '<dl class="kv three" style="max-width:560px"><div><dt>Volume</dt><dd>' + NA + "</dd></div><div><dt>CA</dt><dd>" + NA + "</dd></div><div><dt>Marge</dt><dd>" + NA + "</dd></div></dl>" +
    '<p class="small muted">Mesures futures applicables : ' + esc(p.fut) + ". Classement sport/activité à titre de navigation.</p>" +
    '<h2>Mesures reliées</h2><div class="list">' + p.ids.map(function (id) { return indRow(BY[id]); }).join("") + "</div>";
}

/* Registre des indicateurs */
const reg = { q: "", seg: "", fam: "", av: "" };
function norm(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
function viewIndicateurs(m) {
  let h = "<h1>Indicateurs à relier</h1>" +
    '<p class="lede">Registre complet des ' + IND.length + " fiches, y compris celles qui ne figurent pas en synthèse. " + LIVE.length + " fiches Terrains sont calculées depuis Playtomic et " + PAIE.length + " fiches Équipe depuis les bulletins de paie ; les autres restent « À relier » tant que leur source n’est pas branchée.</p>";
  h += '<form class="filters" role="search" aria-label="Rechercher et filtrer les fiches" onsubmit="return false">' +
    '<div class="field wide"><label for="r-q">Recherche (libellé, identifiant, méthode, source)</label><input type="search" id="r-q" autocomplete="off" value="' + esc(reg.q) + '"></div>' +
    '<div class="field"><label for="r-seg">Périmètre</label><select id="r-seg"><option value="">Tous</option>' + SEGS.map(function (s) { return "<option" + (reg.seg === s ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select></div>" +
    '<div class="field"><label for="r-fam">Famille</label><select id="r-fam"><option value="">Toutes</option>' + FAMS.map(function (f) { return "<option" + (reg.fam === f ? " selected" : "") + ">" + esc(f) + "</option>"; }).join("") + "</select></div>" +
    '<div class="field"><label for="r-av">Avancement</label><select id="r-av"><option value="">Tous</option>' + AV.map(function (a) { return "<option" + (reg.av === a ? " selected" : "") + ">" + esc(a) + "</option>"; }).join("") + "</select></div>" +
    '<div class="field" style="flex:0 0 auto"><button type="button" id="r-reset">Réinitialiser</button></div></form>';
  h += '<p class="small muted" id="r-count" aria-live="polite"></p><div class="list" id="r-list"></div>';
  h += '<details><summary>Règles métier avant connexion</summary><ul>' + RULES.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul></details>";
  m.innerHTML = h;
  function draw() {
    const q = norm(reg.q.trim());
    const list = IND.filter(function (i) {
      if (reg.seg && i.seg !== reg.seg) return false;
      if (reg.fam && i.fam !== reg.fam) return false;
      if (reg.av && note(i.id).av !== reg.av) return false;
      if (q) { const n = note(i.id); if (norm(i.l + " " + i.id + " " + i.m + " " + i.src + " " + n.src).indexOf(q) < 0) return false; }
      return true;
    });
    $("#r-count").textContent = list.length + " fiche" + (list.length > 1 ? "s" : "") + " sur " + IND.length;
    $("#r-list").innerHTML = list.length ? list.map(function (i) {
      return '<div class="row"><div><h3><a href="' + ficheHref(i.id) + '">' + esc(i.l) + '</a></h3><div class="meta"><code>' + esc(i.id) + "</code> · " + esc(i.seg) + " · " + esc(i.fam) + " · " + esc(i.u) + " · " + esc(i.freq) + '</div><p class="small" style="margin:4px 0 0">' + esc(i.m) + '</p><div class="small muted">Source envisagée : ' + esc(i.src) + '</div></div><div class="side"><div class="tags">' + segTag(i.seg) + avTag(i.id) + connTag(i.id) + estTag(i.id) + '</div><div class="small muted">Valeur : ' + valHtml(i.id) + "</div></div></div>";
    }).join("") : '<div class="empty"><p>Aucune fiche ne correspond à cette recherche ou à ces filtres.</p><button type="button" id="r-reset2">Réinitialiser la recherche et les filtres</button></div>';
    const r2 = $("#r-reset2"); if (r2) r2.addEventListener("click", reset);
  }
  function reset() { reg.q = reg.seg = reg.fam = reg.av = ""; $("#r-q").value = ""; $("#r-seg").value = ""; $("#r-fam").value = ""; $("#r-av").value = ""; draw(); $("#r-q").focus(); }
  $("#r-q").addEventListener("input", function (e) { reg.q = e.target.value; draw(); });
  $("#r-seg").addEventListener("change", function (e) { reg.seg = e.target.value; draw(); });
  $("#r-fam").addEventListener("change", function (e) { reg.fam = e.target.value; draw(); });
  $("#r-av").addEventListener("change", function (e) { reg.av = e.target.value; draw(); });
  $("#r-reset").addEventListener("click", reset);
  draw();
}

function viewFiche(m, id) {
  const i = BY[id];
  if (!i) return viewNotFound(m, "Fiche introuvable : l’identifiant « " + id + " » n’existe pas dans le registre.");
  const n = note(id);
  const inCards = CARDS.filter(function (c) { return c.ids.indexOf(id) >= 0; });
  const inProds = PRODS.filter(function (p) { return p.ids.indexOf(id) >= 0; });
  let h = '<div class="crumbs"><a href="#indicateurs">← Registre des indicateurs</a></div>' +
    "<h1>" + esc(i.l) + '</h1><div class="tags"><code class="tag">' + esc(i.id) + "</code>" + segTag(i.seg) + '<span class="tag">' + esc(i.fam) + "</span>" + avTag(id) + connTag(id) + estTag(id) + "</div>";
  h += '<div class="two" style="margin-top:14px"><div>' +
    '<section class="card" aria-labelledby="h-def"><h2 id="h-def" style="margin-top:0">Définition</h2><dl class="facts">' +
    "<dt>Identifiant stable</dt><dd><code>" + esc(i.id) + "</code></dd><dt>Segment</dt><dd>" + esc(i.seg) + "</dd><dt>Famille</dt><dd>" + esc(i.fam) + "</dd>" +
    "<dt>Unité</dt><dd>" + esc(i.u) + "</dd><dt>Fréquence proposée</dt><dd>" + esc(i.freq) + "</dd><dt>Méthode</dt><dd>" + esc(i.m) + "</dd>" +
    "<dt>Source envisagée</dt><dd>" + esc(i.src) + "</dd></dl></section>" +
    '<section class="card" style="margin-top:12px" aria-labelledby="h-val"><h2 id="h-val" style="margin-top:0">État de la donnée</h2><dl class="facts">' +
    "<dt>Valeur</dt><dd>" + valHtml(id) + (metric(id) ? ' <span class="small muted">' + esc(periodOf(id)) + "</span>" : "") +
    (metric(id) ? '<ul class="lines">' + metric(id).lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" : (metricReason(id) ? '<p class="small muted" style="margin:4px 0 0">' + esc(metricReason(id)) + "</p>" : "")) +
    "</dd><dt>Objectif / seuil</dt><dd>" + NA + " <span class=\"small muted\">à valider sur l’historique comparable</span></dd><dt>Tendance</dt><dd>" + trendHtml(id) +
    "</dd><dt>Connexion</dt><dd>" + (sourceOf(id) ? esc(sourceOf(id)) : "À relier") + "</dd><dt>Dernière synchronisation</dt><dd>" + (LIVE.indexOf(id) >= 0 && sourceOf(id) ? esc(fmtDateTime(M.res.synchro)) : PAIE.indexOf(id) >= 0 && sourceOf(id) ? "Import des bulletins (" + esc(metric(id) ? metric(id).periode.replace("Paie de ", "jusqu’à ") : "") + ")" : NA) + "</dd></dl>" +
    (LIVE.indexOf(id) >= 0 ? scopeBar(null, "Période, sport et créneau recalculent cette mesure.") : "") + "</section>" +
    '<section class="card" style="margin-top:12px" aria-labelledby="h-use"><h2 id="h-use" style="margin-top:0">Utilisée dans</h2>' +
    (inCards.length || inProds.length
      ? (inCards.length ? '<div class="small muted">Cartes de synthèse</div><ul class="links">' + inCards.map(function (c) { return '<li><a href="#synthese">' + esc(c.t) + "</a></li>"; }).join("") + "</ul>" : "") +
        (inProds.length ? '<div class="small muted" style="margin-top:8px">Produits</div><ul class="links">' + inProds.map(function (p) { return '<li><a href="#produit-' + p.slug + '">' + esc(p.n) + "</a></li>"; }).join("") + "</ul>" : "")
      : '<p class="small muted" style="margin:0">Cette fiche n’apparaît ni en synthèse ni dans le catalogue produits.</p>') + "</section></div>";
  h += '<form class="card" id="note-form" aria-labelledby="h-note" novalidate><h2 id="h-note" style="margin-top:0">Préparer le raccordement</h2>' +
    '<p class="small muted">Ces informations ne relient aucune source : elles documentent le process. La connexion reste « À relier ».</p><div class="form-grid">' +
    '<div class="field"><label for="n-resp">Responsable</label><input type="text" id="n-resp" maxlength="200" value="' + esc(n.resp) + '"></div>' +
    '<div class="field"><label for="n-date">Date cible</label><input type="date" id="n-date" value="' + esc(n.date) + '"></div>' +
    '<div class="field full"><label for="n-src">Source retenue</label><input type="text" id="n-src" maxlength="400" value="' + esc(n.src) + '"></div>' +
    '<div class="field full"><label for="n-proc">Process</label><textarea id="n-proc" maxlength="2000">' + esc(n.proc) + "</textarea></div>" +
    '<div class="field full"><label for="n-next">Prochaine étape</label><textarea id="n-next" maxlength="2000">' + esc(n.next) + "</textarea></div>" +
    '<fieldset class="full"><legend>Avancement</legend><div class="radios">' + AV.map(function (a, k) {
      return '<label><input type="radio" name="n-av" value="' + esc(a) + '"' + (n.av === a ? " checked" : "") + "> " + esc(a) + "</label>";
    }).join("") + "</div></fieldset></div>" +
    '<div class="actions"><button type="submit" class="primary">Enregistrer</button><span class="msg" id="n-msg" role="status" aria-live="polite"></span></div></form></div>';
  m.innerHTML = h;
  bindScope();
  let busy = false;
  $("#note-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (busy) return;
    const av = ($('input[name="n-av"]:checked') || {}).value;
    const rec = { resp: $("#n-resp").value.trim().slice(0, 200), src: $("#n-src").value.trim().slice(0, 400),
      date: isoDate($("#n-date").value), proc: $("#n-proc").value.trim().slice(0, 2000),
      next: $("#n-next").value.trim().slice(0, 2000), av: AV.indexOf(av) >= 0 ? av : AV[0] };
    busy = true; $("#n-msg").className = "msg"; $("#n-msg").textContent = "Enregistrement…";
    const r = await commit([{ col: "notes", id: id, rec: rec }]);
    busy = false;
    if (!r.ok) { $("#n-msg").className = "msg err"; $("#n-msg").textContent = r.text; return; }
    store.dirty = false; store.pending = false;
    rerender();
    const msg = $("#n-msg");
    if (!msg) return;
    msg.className = "msg" + (r.warn ? " err" : "");
    msg.textContent = "Fiche enregistrée " + r.where + ". Avancement : " + rec.av + ". Connexion : " + (sourceOf(id) ? sourceOf(id) + "." : "À relier.");
  });
}

/* Registre des décisions */
let editing = null;
const STATUTS = ["À faire", "En cours", "Terminée"];
function indOptions(sel) {
  let h = '<option value="">Aucun</option>';
  D.groups.forEach(function (g) {
    h += '<optgroup label="' + esc(g.seg + " · " + g.fam) + '">' + IND.filter(function (i) { return i.seg === g.seg && i.fam === g.fam; }).map(function (i) {
      return '<option value="' + esc(i.id) + '"' + (sel === i.id ? " selected" : "") + ">" + esc(i.l) + " (" + esc(i.id) + ")</option>";
    }).join("") + "</optgroup>";
  });
  return h;
}
function decCard(d) {
  return '<article class="dec' + (d.prio ? " prio" : "") + '"><div class="tags">' + (d.prio ? '<span class="tag av-2">Prioritaire cette semaine</span>' : "") +
    '<span class="tag">' + esc(d.statut) + "</span>" + (d.per ? segTag(d.per) : "") + "</div><h3>" + esc(d.titre) + "</h3><dl>" +
    "<dt>Responsable</dt><dd>" + (d.resp ? esc(d.resp) : NA) + "</dd><dt>Échéance</dt><dd>" + (d.ech ? esc(fmtDate(d.ech)) : NA) + "</dd>" +
    "<dt>Indicateur</dt><dd>" + (d.ind ? ficheLink(d.ind) : NA) + "</dd><dt>Constat</dt><dd>" + (d.constat ? esc(d.constat) : NA) + "</dd>" +
    "<dt>Résultat attendu</dt><dd>" + (d.attendu ? esc(d.attendu) : NA) + "</dd></dl>" +
    '<div class="actions"><button type="button" data-edit="' + esc(d.id) + '">Modifier<span class="sr"> : ' + esc(d.titre) + "</span></button>" +
    '<button type="button" data-prio="' + esc(d.id) + '" aria-pressed="' + d.prio + '">' + (d.prio ? "Retirer des priorités" : "Marquer prioritaire") + '<span class="sr"> : ' + esc(d.titre) + "</span></button>" +
    (store.pendingDel === d.id
      ? '<span class="msg err">Supprimer définitivement cette action pour tout le monde ?</span><button type="button" class="danger" data-del-yes="' + esc(d.id) + '">Confirmer la suppression</button><button type="button" data-del-no="' + esc(d.id) + '">Annuler</button>'
      : '<button type="button" class="danger" data-del="' + esc(d.id) + '">Supprimer<span class="sr"> : ' + esc(d.titre) + "</span></button>") + "</div></article>";
}
function viewDecisions(m, focusForm) {
  const decs = store.data.decisions;
  const e = editing ? decs.find(function (d) { return d.id === editing; }) : null;
  if (editing && !e) editing = null;
  const v = e || { titre: "", resp: "", ech: "", per: "", ind: "", constat: "", attendu: "", statut: "À faire", prio: false };
  const prioCount = decs.filter(function (d) { return d.prio; }).length;
  let h = "<h1>Décisions</h1>" +
    '<p class="lede">Registre des actions décidées à partir des fiches. Il est vide au démarrage et ne contient que les saisies de l’équipe.</p>' +
    '<div class="grid" style="margin-bottom:6px">' +
    '<div class="card"><h3>Revue hebdomadaire</h3><p class="small" style="margin:0">Sélectionner jusqu’à trois actions prioritaires.</p></div>' +
    '<div class="card"><h3>Revue mensuelle</h3><p class="small" style="margin:0">Revoir la finance, les marges et le budget.</p></div>' +
    '<div class="card"><h3>Arbitrage trimestriel</h3><p class="small" style="margin:0">Décider des offres et investissements à développer, ajuster ou arrêter.</p></div></div>';
  h += '<form class="card" id="dec-form" style="margin-top:16px" aria-labelledby="h-dec" novalidate><h2 id="h-dec" style="margin-top:0">' + (e ? "Modifier l’action" : "Ajouter une action") + '</h2><div class="form-grid">' +
    '<div class="field full"><label for="d-titre">Action <span aria-hidden="true">*</span><span class="sr">(obligatoire)</span></label><input type="text" id="d-titre" maxlength="300" required aria-describedby="d-msg" value="' + esc(v.titre) + '"></div>' +
    '<div class="field"><label for="d-resp">Responsable</label><input type="text" id="d-resp" maxlength="200" value="' + esc(v.resp) + '"></div>' +
    '<div class="field"><label for="d-ech">Échéance</label><input type="date" id="d-ech" value="' + esc(v.ech) + '"></div>' +
    '<div class="field"><label for="d-per">Périmètre</label><select id="d-per"><option value="">Non précisé</option>' + SEGS.map(function (s) { return "<option" + (v.per === s ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select></div>" +
    '<div class="field"><label for="d-statut">Statut</label><select id="d-statut">' + STATUTS.map(function (s) { return "<option" + (v.statut === s ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select></div>" +
    '<div class="field full"><label for="d-ind">Indicateur</label><select id="d-ind">' + indOptions(v.ind) + "</select></div>" +
    '<div class="field full"><label for="d-constat">Constat</label><textarea id="d-constat" maxlength="2000">' + esc(v.constat) + "</textarea></div>" +
    '<div class="field full"><label for="d-attendu">Résultat attendu</label><textarea id="d-attendu" maxlength="2000">' + esc(v.attendu) + "</textarea></div>" +
    '<div class="field full"><label style="display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" id="d-prio"' + (v.prio ? " checked" : "") + "> Prioritaire pour la revue hebdomadaire (" + prioCount + "/3 sélectionnées)</label></div></div>" +
    '<div class="actions"><button type="submit" class="primary">' + (e ? "Enregistrer les modifications" : "Ajouter l’action") + "</button>" +
    (e ? '<button type="button" id="d-cancel">Annuler</button>' : "") + '<span class="msg" id="d-msg" role="status" aria-live="polite"></span></div></form>';
  const prios = decs.filter(function (d) { return d.prio; });
  h += '<div class="section-head"><h2>Priorités de la semaine</h2><span class="small muted">' + prios.length + "/3</span>" +
    (prios.length ? '<button type="button" id="d-clear-prio">Vider les priorités</button>' : "") + "</div>";
  h += prios.length ? '<div class="list">' + prios.map(decCard).join("") + "</div>" : '<div class="empty"><p style="margin:0">Aucune action prioritaire sélectionnée.</p></div>';
  h += '<div class="section-head"><h2>Toutes les actions</h2><span class="small muted">' + decs.length + " action" + (decs.length > 1 ? "s" : "") + "</span></div>";
  h += decs.length ? '<div class="list">' + STATUTS.map(function (s) {
    const l = decs.filter(function (d) { return d.statut === s; });
    return l.length ? '<h3 style="margin:10px 0 0">' + esc(s) + " (" + l.length + ")</h3>" + l.map(decCard).join("") : "";
  }).join("") + "</div>" : '<div class="empty"><p style="margin:0">Le registre est vide. Ajoutez une première action avec le formulaire ci-dessus.</p></div>';
  m.innerHTML = h;
  const msg = $("#d-msg");
  function fail(t) { msg.className = "msg err"; msg.textContent = t; }
  let busy = false;
  $("#dec-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const titre = $("#d-titre").value.trim();
    if (!titre) { fail("Indiquez l’action à mener."); $("#d-titre").setAttribute("aria-invalid", "true"); $("#d-titre").focus(); return; }
    const prio = $("#d-prio").checked;
    const others = decs.filter(function (d) { return d.prio && d.id !== editing; }).length;
    if (prio && others >= 3) { fail("Trois actions prioritaires sont déjà sélectionnées. Retirez-en une avant d’en ajouter une autre."); $("#d-prio").focus(); return; }
    const old = editing ? decs.find(function (d) { return d.id === editing; }) : null;
    const id = editing || ("d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    const rec = { titre: titre.slice(0, 300),
      resp: $("#d-resp").value.trim().slice(0, 200), ech: isoDate($("#d-ech").value),
      per: $("#d-per").value, ind: BY[$("#d-ind").value] ? $("#d-ind").value : "", constat: $("#d-constat").value.trim().slice(0, 2000),
      attendu: $("#d-attendu").value.trim().slice(0, 2000), statut: $("#d-statut").value, prio: prio,
      cree: old && old.cree ? old.cree : new Date().toISOString() };
    const wasEdit = !!editing;
    if (busy) return;
    busy = true; msg.className = "msg"; msg.textContent = "Enregistrement…";
    const r = await commit([{ col: "decisions", id: id, rec: rec }]);
    busy = false;
    if (!r.ok) { fail(r.text); return; }
    editing = null; store.dirty = false; store.pending = false;
    viewDecisions(m);
    const msg2 = $("#d-msg");
    msg2.className = "msg" + (r.warn ? " err" : "");
    msg2.textContent = (wasEdit ? "Action modifiée" : "Action ajoutée") + " et enregistrée " + r.where + ".";
    $("#d-titre").focus();
  });
  async function quick(ops) {
    if (busy) return;
    busy = true; const r = await commit(ops); busy = false;
    store.pendingDel = null;
    if (!r.ok) { fail(r.text); return; }
    viewDecisions(m);
  }
  function decOp(d, patch) { const rec = Object.assign({}, d, patch); delete rec.id; return { col: "decisions", id: d.id, rec: rec }; }
  const c = $("#d-cancel"); if (c) c.addEventListener("click", function () { editing = null; store.dirty = false; viewDecisions(m, true); });
  const cp = $("#d-clear-prio"); if (cp) cp.addEventListener("click", function () {
    quick(decs.filter(function (d) { return d.prio; }).map(function (d) { return decOp(d, { prio: false }); }));
  });
  $all("[data-edit]", m).forEach(function (b) { b.addEventListener("click", function () { editing = b.dataset.edit; store.dirty = false; viewDecisions(m, true); }); });
  $all("[data-prio]", m).forEach(function (b) {
    b.addEventListener("click", function () {
      const d = decs.find(function (x) { return x.id === b.dataset.prio; });
      if (!d) return;
      if (!d.prio && decs.filter(function (x) { return x.prio; }).length >= 3) { fail("Trois actions prioritaires sont déjà sélectionnées."); return; }
      quick([decOp(d, { prio: !d.prio })]);
    });
  });
  $all("[data-del]", m).forEach(function (b) {
    b.addEventListener("click", function () {
      store.pendingDel = b.dataset.del; viewDecisions(m);
      const y = $('[data-del-yes="' + CSS.escape(b.dataset.del) + '"]', m); if (y) y.focus();
    });
  });
  $all("[data-del-no]", m).forEach(function (b) {
    b.addEventListener("click", function () {
      const id = b.dataset.delNo; store.pendingDel = null; viewDecisions(m);
      const x = $('[data-del="' + CSS.escape(id) + '"]', m); if (x) x.focus();
    });
  });
  $all("[data-del-yes]", m).forEach(function (b) {
    b.addEventListener("click", function () {
      const id = b.dataset.delYes;
      if (editing === id) editing = null;
      quick([{ col: "decisions", id: id, del: true }]);
    });
  });
  if (focusForm) { $("#dec-form").scrollIntoView({ block: "start" }); $("#d-titre").focus(); }
}

/* Réglages : horaires, début de soirée, terrains, synchronisation Playtomic. */
/* Messages qui doivent survivre au réaffichage qui suit un rechargement des données. */
const flash = { reg: null, sync: null };
function flashHtml(k) { const f = flash[k]; return f ? esc(f.text) : ""; }
function flashCls(k) { const f = flash[k]; return "msg" + (f && f.err ? " err" : ""); }
const DAYS = [["mon", "Lundi"], ["tue", "Mardi"], ["wed", "Mercredi"], ["thu", "Jeudi"], ["fri", "Vendredi"], ["sat", "Samedi"], ["sun", "Dimanche"]];
function viewReglages(m) {
  if (!store.loaded) { m.innerHTML = "<h1>Réglages</h1>" + (store.broken ? '<div class="empty"><p>Données indisponibles. Rechargez la page.</p></div>' : '<p class="muted">Chargement…</p>'); return; }
  const r = store.reglages || { horaires: {}, debut_soiree: "18:00", terrains: {} };
  const pt = store.playtomic || { configure: false, reservations: 0, terrainsVus: {}, syncs: [] };
  let h = "<h1>Réglages</h1>" +
    '<p class="lede">Ces réglages servent au calcul de la capacité des terrains. Un jour sans horaire est considéré comme fermé, jamais comme ouvert.</p>';
  h += '<form class="card" id="reg-form" novalidate aria-labelledby="h-hor"><h2 id="h-hor" style="margin-top:0">Horaires d’ouverture</h2><div class="hours">';
  DAYS.forEach(function (d) {
    const x = r.horaires[d[0]];
    h += '<span class="day">' + d[1] + "</span>" +
      '<div class="field"><label for="o-' + d[0] + '">Ouverture</label><input type="text" inputmode="numeric" placeholder="09:00" id="o-' + d[0] + '" value="' + esc(x ? x.open : "") + '"></div>' +
      '<div class="field"><label for="c-' + d[0] + '">Fermeture</label><input type="text" inputmode="numeric" placeholder="23:00" id="c-' + d[0] + '" value="' + esc(x ? x.close : "") + '"></div>' +
      '<span class="small muted">' + (x ? "" : "Fermé") + "</span>";
  });
  h += '</div><p class="small muted">Format HH:MM. Laissez vide un jour de fermeture. Une fermeture à minuit s’écrit 00:00.</p>' +
    '<h2>Créneaux</h2><div class="field" style="max-width:220px"><label for="soir">Début de la soirée (lundi au vendredi)</label><input type="text" inputmode="numeric" id="soir" value="' + esc(r.debut_soiree) + '"></div>' +
    '<p class="small muted">Journée : de l’ouverture au début de la soirée. Week-end : samedi et dimanche entiers.</p>' +
    '<h2>Terrains</h2><div class="form-grid">';
  [["PADEL", "Padel"], ["TENNIS", "Tennis"], ["FOOTBALL", "Foot à 5"]].forEach(function (s) {
    const seen = pt.terrainsVus && pt.terrainsVus[s[0]];
    h += '<div class="field"><label for="t-' + s[0] + '">' + s[1] + '</label><input type="text" inputmode="numeric" id="t-' + s[0] + '" value="' + esc(r.terrains[s[0]] ? String(r.terrains[s[0]]) : "") + '" placeholder="' + (seen ? String(seen) : "") + '">' +
      '<span class="small muted">' + (seen ? seen + " terrain(s) vu(s) dans Playtomic" : "Aucun terrain vu dans Playtomic") + " · laissez vide pour utiliser Playtomic</span></div>";
  });
  h += '</div><div class="actions"><button type="submit" class="primary">Enregistrer les réglages</button><span class="' + flashCls("reg") + '" id="reg-msg" role="status" aria-live="polite">' + flashHtml("reg") + '</span></div></form>';
  h += '<section class="card" style="margin-top:14px" aria-labelledby="h-pt"><h2 id="h-pt" style="margin-top:0">Playtomic</h2>' +
    (pt.configure ? '<p>Connexion configurée. ' + pt.reservations + " réservation(s) en base. Synchronisation automatique chaque nuit.</p>"
      : '<p class="msg err">Identifiants Playtomic absents : ajoutez PLAYTOMIC_CLIENT_ID, PLAYTOMIC_CLIENT_SECRET et PLAYTOMIC_TENANT_ID dans les variables d’environnement Vercel, puis redéployez.</p>') +
    '<div class="actions"><button type="button" id="sync-now"' + (pt.configure ? "" : " disabled") + '>Synchroniser maintenant</button><span class="' + flashCls("sync") + '" id="sync-msg" role="status" aria-live="polite">' + flashHtml("sync") + '</span></div>' +
    "<h3 style=\"margin-top:14px\">Dernières synchronisations</h3>" +
    (pt.syncs && pt.syncs.length ? '<div class="table-wrap"><table><thead><tr><th scope="col">Début</th><th scope="col">Statut</th><th scope="col">Lues</th><th scope="col">Origine</th><th scope="col">Détail</th></tr></thead><tbody>' +
      pt.syncs.map(function (s) {
        const st = { completed: "Terminée", partial: "Partielle", failed: "Échec", running: "En cours" }[s.status] || s.status;
        return "<tr><td>" + esc(fmtDateTime(s.started_at)) + "</td><td>" + esc(st) + "</td><td>" + esc(String(s.records_read)) + "</td><td>" + esc(s.triggered_by === "cron" ? "Automatique" : "Manuelle") + "</td><td>" + esc(s.error || "") + "</td></tr>";
      }).join("") + "</tbody></table></div>" : '<p class="small muted">Aucune synchronisation pour l’instant.</p>') + "</section>";
  m.innerHTML = h;
  const msg = $("#reg-msg");
  $("#reg-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const re = /^([01]\d|2[0-3]):[0-5]\d$/;
    const horaires = {};
    for (const d of DAYS) {
      const o = $("#o-" + d[0]).value.trim(), c = $("#c-" + d[0]).value.trim();
      if (!o && !c) { horaires[d[0]] = null; continue; }
      if (!re.test(o) || !re.test(c)) { msg.className = "msg err"; msg.textContent = d[1] + " : indiquez l’ouverture et la fermeture au format HH:MM."; $("#o-" + d[0]).focus(); return; }
      horaires[d[0]] = { open: o, close: c };
    }
    const soir = $("#soir").value.trim();
    if (!re.test(soir)) { msg.className = "msg err"; msg.textContent = "Début de la soirée : format HH:MM."; $("#soir").focus(); return; }
    const terrains = {};
    for (const s of ["PADEL", "TENNIS", "FOOTBALL"]) {
      const v = $("#t-" + s).value.trim();
      if (v && !/^\d{1,2}$/.test(v)) { msg.className = "msg err"; msg.textContent = "Nombre de terrains : un nombre entier."; $("#t-" + s).focus(); return; }
      terrains[s] = v ? Number(v) : null;
    }
    msg.className = "msg"; msg.textContent = "Enregistrement…";
    try {
      await api("PUT", "/api/reglages", { horaires: horaires, debut_soiree: soir, terrains: terrains });
      store.dirty = false; store.last = new Date();
      flash.reg = { text: "Réglages enregistrés. Les mesures sont recalculées.", err: false };
      await loadAll();
    } catch (err) { msg.className = "msg err"; msg.textContent = err.message; }
  });
  $("#sync-now").addEventListener("click", async function () {
    const b = $("#sync-now"), sm = $("#sync-msg");
    b.disabled = true; sm.className = "msg"; sm.textContent = "Synchronisation en cours (jusqu’à quelques minutes)…";
    let text = "", ok = true;
    try { const r = await api("POST", "/api/sync"); text = r.read + " réservation(s) lue(s)" + (r.error ? " · " + r.error : "") + "."; ok = r.status !== "failed"; }
    catch (err) { text = err.message; ok = false; }
    flash.sync = { text: text, err: !ok };
    await loadAll();
  });
}

function viewNotFound(m, t) {
  m.innerHTML = "<h1>Page introuvable</h1><div class=\"empty\"><p>" + esc(t || "Cette adresse ne correspond à aucune vue.") + '</p><a class="btn" href="#synthese">Retour à la synthèse</a></div>';
}

/* ===== Routeur par fragment ===== */
const ROUTES = { reglages: viewReglages, synthese: viewSynthese, btoc: viewBtoC, btob: viewBtoB, produits: viewProduits, exploitation: viewExploitation, indicateurs: viewIndicateurs, decisions: viewDecisions };
const NAV_OF = { fiche: "indicateurs", produit: "produits" };
let firstRender = true;
function rerender() {
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
}
function route() {
  store.pendingDel = null; flash.reg = null; flash.sync = null;
  store.dirty = false; store.pending = false;
  render();
  const h1 = $("h1", $("#contenu"));
  if (!firstRender && h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  firstRender = false;
}
function render() {
  let h = location.hash.slice(1);
  try { h = decodeURIComponent(h); } catch (e) { /* fragment mal formé */ }
  if (!h || h === "contenu") h = "synthese";
  let name = h, arg = "";
  if (h.indexOf("fiche-") === 0) { name = "fiche"; arg = h.slice(6); }
  else if (h.indexOf("produit-") === 0) { name = "produit"; arg = h.slice(8); }
  const m = $("#contenu");
  if (name !== "decisions") editing = null;
  if (name === "fiche") viewFiche(m, arg);
  else if (name === "produit") viewProduit(m, arg);
  else if (ROUTES[name]) ROUTES[name](m);
  else viewNotFound(m);
  const nav = NAV_OF[name] || name;
  $all("nav.main a").forEach(function (a) { if (a.dataset.r === nav) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  const h1 = $("h1", m);
  document.title = (h1 ? h1.textContent + " · " : "") + "Les Acacias";
}
$("#skip").addEventListener("click", function (e) { e.preventDefault(); const m = $("#contenu"); m.focus(); });
window.addEventListener("hashchange", route);
document.documentElement.lang = "fr";
showStatus();
route();
loadAll();
