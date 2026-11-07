=== Les Acacias – Anniversaires enfants ===
Version : 1.1.0
Nécessite : WordPress 6.0, PHP 7.4, et le plugin « les-acacias-site » (design du site)

Pages « Anniversaires » et tunnel de réservation en 6 étapes aux couleurs du site Les Acacias.

== Installation ==

1. Extensions › Ajouter › Téléverser : choisissez « les-acacias-anniversaires.zip », puis Activer.
2. À l'activation, deux pages sont créées :
   - /anniversaires/            présentation (shortcode [acacias_anniversaires])
   - /anniversaires/reserver/   tunnel de réservation (shortcode [acacias_anniversaires_reservation])
3. Menu « Anniversaires › Réglages » : vérifiez les créneaux, l'e-mail de notification,
   l'adresse, la règle météo et, si vous en avez un, le lien de paiement de l'acompte.
4. Ajoutez un lien « Anniversaires » vers /anniversaires/ dans le menu du site principal
   (plugin les-acacias-site) et sur la page « Foot à 5 ».

== Le tunnel ==

1. Formule : Tout compris (290 €, mise en avant) ou Essentiel (250 €)
2. Univers : Foot party ou Jeux & défis des Acacias
3. Date : calendrier des disponibilités, créneaux libres ou complets
4. Invités : prénom et âge de l'enfant fêté, nombre d'enfants (6 à 12)
5. Options : pizza (12 €/pizza, si le goûter tombe entre 11h et 15h), ballon signé (20 €),
   sachets cadeaux (6 €/enfant), 30 min supplémentaires (40 €, si le terrain est libre)
6. Coordonnées, allergies, acceptation de la règle météo et de l'acompte

Le prix est recalculé côté serveur. Chaque demande :
- bloque le créneau (libéré automatiquement après 72 h sans confirmation, réglable) ;
- envoie un e-mail au club et un e-mail récapitulatif à la famille ;
- donne à la famille un lien d'invitation numérique à partager (WhatsApp, lien, impression).

== Gestion ==

Menu « Anniversaires » : liste des fêtes à venir, détail, statut (en attente, confirmée,
passée, annulée), note interne. Passer une fête à « Confirmée » envoie l'e-mail
« C'est confirmé » à la famille. Un widget « Prochains anniversaires » est ajouté au tableau de bord.

Dates fermées (Réglages) : une date par ligne, JJ/MM/AAAA, ou JJ/MM/AAAA HH:MM pour un seul créneau.

== Playtomic ==

Anniversaires › Réglages › « Planning Playtomic » :
1. Collez l'ID API (clb_…) et la clé secrète (Playtomic Manager › Réglages › Outils de développement),
   cochez « Vérifier les disponibilités dans Playtomic », enregistrez.
2. Cliquez sur « Tester la connexion Playtomic » : les terrains Football 1, 2, 3 apparaissent.
3. Cochez les terrains utilisables pour les anniversaires (aucun = tous).

Un créneau n'est proposé que si un terrain est libre dans Playtomic (réservations, récurrences,
cours, tournois) et n'est pas déjà attribué à un autre anniversaire. Le terrain est attribué
à la demande et revérifié en direct au moment de l'envoi.

L'API Playtomic est en lecture seule : elle ne permet pas de créer la réservation. L'e-mail
du club indique le terrain à bloquer dans Playtomic Manager, et la liste des réservations
affiche « ✓ bloqué dans Playtomic » dès que le blocage est fait.

Option plus sûre pour la clé : dans wp-config.php
  define( 'LA_ANNIV_PLAYTOMIC_CLIENT_ID', 'clb_…' );
  define( 'LA_ANNIV_PLAYTOMIC_SECRET', '…' );

== E-mails ==

Les e-mails passent par wp_mail(). Si vos e-mails WordPress arrivent mal, installez une
extension SMTP (WP Mail SMTP, FluentSMTP…).
