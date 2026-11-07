<?php
/**
 * Réservations : type de contenu, disponibilités, calcul du prix, e-mails.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LA_Anniv_Bookings {

	const CPT = 'la_anniv_resa';

	public static $statuts = array(
		'attente'   => 'Demande reçue · acompte en attente',
		'confirmee' => 'Confirmée',
		'terminee'  => 'Fête passée',
		'annulee'   => 'Annulée',
	);

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_cpt' ) );
	}

	public static function register_cpt() {
		register_post_type(
			self::CPT,
			array(
				'labels'          => array(
					'name'               => 'Anniversaires',
					'singular_name'      => 'Anniversaire',
					'menu_name'          => 'Anniversaires',
					'all_items'          => 'Réservations',
					'add_new'            => 'Ajouter',
					'add_new_item'       => 'Ajouter une réservation',
					'edit_item'          => 'Réservation d’anniversaire',
					'search_items'       => 'Rechercher',
					'not_found'          => 'Aucune réservation pour le moment.',
					'not_found_in_trash' => 'Aucune réservation dans la corbeille.',
				),
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => true,
				'menu_position'   => 26,
				'menu_icon'       => 'dashicons-buddicons-groups',
				'supports'        => array( 'title' ),
				'capability_type' => 'post',
				'map_meta_cap'    => true,
				'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			)
		);
	}

	/* ------------------------------------------------------------------
	 * Outils horaires
	 * ---------------------------------------------------------------- */

	public static function to_min( $hhmm ) {
		$p = explode( ':', (string) $hhmm );
		return ( (int) $p[0] ) * 60 + ( isset( $p[1] ) ? (int) $p[1] : 0 );
	}

	public static function to_hhmm( $min ) {
		$min = max( 0, (int) $min );
		return sprintf( '%02d:%02d', floor( $min / 60 ) % 24, $min % 60 );
	}

	public static function today() {
		return current_time( 'Y-m-d' );
	}

	public static function valid_date( $d ) {
		if ( ! is_string( $d ) || ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $d, $m ) ) {
			return false;
		}
		return checkdate( (int) $m[2], (int) $m[3], (int) $m[1] );
	}

	/**
	 * Dates fermées : [ 'Y-m-d' => true (journée) | [ 'HH:MM', ... ] ].
	 */
	public static function blocked() {
		static $out = null;
		if ( null !== $out ) {
			return $out;
		}
		$out = array();
		foreach ( preg_split( '/\r\n|\r|\n/', (string) LA_Anniv_Settings::get( 'dates_bloquees' ) ) as $line ) {
			$line = trim( $line );
			if ( '' === $line ) {
				continue;
			}
			$date = null;
			$time = null;
			if ( preg_match( '#^(\d{1,2})/(\d{1,2})/(\d{4})(?:\s+(\d{1,2})[:h](\d{2}))?#', $line, $m ) ) {
				$date = sprintf( '%04d-%02d-%02d', $m[3], $m[2], $m[1] );
				$time = isset( $m[4] ) && '' !== $m[4] ? sprintf( '%02d:%02d', $m[4], $m[5] ) : null;
			} elseif ( preg_match( '#^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{1,2})[:h](\d{2}))?#', $line, $m ) ) {
				$date = sprintf( '%04d-%02d-%02d', $m[1], $m[2], $m[3] );
				$time = isset( $m[4] ) && '' !== $m[4] ? sprintf( '%02d:%02d', $m[4], $m[5] ) : null;
			}
			if ( ! $date || ! self::valid_date( $date ) ) {
				continue;
			}
			if ( null === $time ) {
				$out[ $date ] = true;
			} elseif ( ! isset( $out[ $date ] ) || true !== $out[ $date ] ) {
				$out[ $date ]   = isset( $out[ $date ] ) ? $out[ $date ] : array();
				$out[ $date ][] = $time;
			}
		}
		return $out;
	}

	/**
	 * Fêtes qui occupent un créneau entre deux dates (incluses).
	 * Retourne [ 'Y-m-d' => [ [start_min, end_min], ... ] ].
	 */
	public static function occupancy( $from, $to, $exclude_id = 0 ) {
		$q = new WP_Query(
			array(
				'post_type'      => self::CPT,
				'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'post__not_in'   => $exclude_id ? array( $exclude_id ) : array(),
				'meta_query'     => array(
					'relation' => 'AND',
					array(
						'key'     => '_la_date',
						'value'   => array( $from, $to ),
						'compare' => 'BETWEEN',
						'type'    => 'CHAR',
					),
					array(
						'key'     => '_la_statut',
						'value'   => array( 'attente', 'confirmee', 'terminee' ),
						'compare' => 'IN',
					),
				),
			)
		);
		$exp = (int) LA_Anniv_Settings::get( 'expiration_h' );
		$now = time();
		$out = array();
		foreach ( $q->posts as $id ) {
			$statut = get_post_meta( $id, '_la_statut', true );
			if ( 'attente' === $statut && $exp > 0 ) {
				$created = (int) get_post_meta( $id, '_la_cree', true );
				if ( $created && $now - $created > $exp * HOUR_IN_SECONDS ) {
					continue; // Demande expirée : le créneau est libéré.
				}
			}
			$date  = get_post_meta( $id, '_la_date', true );
			$start = self::to_min( get_post_meta( $id, '_la_heure', true ) );
			$end   = $start + (int) get_post_meta( $id, '_la_duree', true );
			$out[ $date ][] = array( $start, $end, (string) get_post_meta( $id, '_la_terrain', true ) );
		}
		return $out;
	}

	/**
	 * Premier terrain libre entre $s et $e (minutes) : ni réservé dans Playtomic,
	 * ni déjà attribué à un autre anniversaire. '' si aucun.
	 */
	private static function free_court( $courts, $pt_day, $local, $s, $e ) {
		foreach ( $courts as $c ) {
			$busy = false;
			foreach ( isset( $pt_day[ $c ] ) ? $pt_day[ $c ] : array() as $r ) {
				if ( $r[0] < $e && $s < $r[1] ) {
					$busy = true;
					break;
				}
			}
			if ( ! $busy ) {
				foreach ( $local as $r ) {
					if ( ! empty( $r[2] ) && $r[2] === $c && $r[0] < $e && $s < $r[1] ) {
						$busy = true;
						break;
					}
				}
			}
			if ( ! $busy ) {
				return $c;
			}
		}
		return '';
	}

	private static function overlaps( $ranges, $s, $e ) {
		$n = 0;
		foreach ( (array) $ranges as $r ) {
			if ( $r[0] < $e && $s < $r[1] ) {
				$n++;
			}
		}
		return $n;
	}

	/**
	 * Créneaux d'une date, avec disponibilité.
	 */
	public static function slots_for( $date, $occ = null, $pt = false ) {
		$s = LA_Anniv_Settings::get();
		if ( ! self::valid_date( $date ) ) {
			return array();
		}
		$tz    = wp_timezone();
		$day   = new DateTimeImmutable( $date, $tz );
		$today = new DateTimeImmutable( self::today(), $tz );
		$diff  = (int) $today->diff( $day )->format( '%r%a' );
		if ( $diff < (int) $s['delai_min'] || $diff > (int) $s['horizon'] ) {
			return array();
		}
		$w   = (int) $day->format( 'w' );
		$raw = isset( $s['creneaux'][ $w ] ) ? $s['creneaux'][ $w ] : '';
		if ( '' === trim( $raw ) ) {
			return array();
		}
		$blocked = self::blocked();
		if ( isset( $blocked[ $date ] ) && true === $blocked[ $date ] ) {
			return array();
		}
		// Planning Playtomic (false = à charger, null = Playtomic injoignable).
		$pt_on = LA_Anniv_Playtomic::enabled();
		if ( $pt_on && false === $pt ) {
			$pt = LA_Anniv_Playtomic::for_range( $date, $date );
		}
		$pt_ok = $pt_on && is_array( $pt );
		if ( $pt_on && ! $pt_ok && 'fermer' === $s['pt_si_erreur'] ) {
			return array();
		}
		$pt_day = ( $pt_ok && isset( $pt[ $date ] ) ) ? $pt[ $date ] : array();
		$courts = $pt_ok ? LA_Anniv_Playtomic::courts_selected() : array();
		$marge  = (int) $s['pt_marge'];

		if ( null === $occ ) {
			$occ = self::occupancy( $date, $date );
		}
		$ranges = isset( $occ[ $date ] ) ? $occ[ $date ] : array();
		$cap    = max( 1, (int) $s['fetes_par_creneau'] );
		$duree  = (int) $s['duree'];
		$p_deb  = self::to_min( $s['pizza_debut'] );
		$p_fin  = self::to_min( $s['pizza_fin'] );
		$out    = array();
		foreach ( array_filter( array_map( 'trim', explode( ',', $raw ) ) ) as $t ) {
			$start   = self::to_min( $t );
			$closed  = isset( $blocked[ $date ] ) && is_array( $blocked[ $date ] ) && in_array( $t, $blocked[ $date ], true );
			$ok      = ! $closed && self::overlaps( $ranges, $start, $start + $duree ) < $cap;
			$extraok = $ok && self::overlaps( $ranges, $start, $start + $duree + 30 ) < $cap;
			$court   = '';
			$court_x = '';
			if ( $pt_ok ) {
				// Un terrain doit être libre dans Playtomic, marge d'installation comprise.
				$court   = $ok ? self::free_court( $courts, $pt_day, $ranges, $start - $marge, $start + $duree + $marge ) : '';
				$ok      = '' !== $court;
				$court_x = $ok ? self::free_court( $courts, $pt_day, $ranges, $start - $marge, $start + $duree + 30 + $marge ) : '';
				$extraok = $extraok && '' !== $court_x;
			}
			$gouter = $start + $duree - 30;
			$out[]  = array(
				'h'           => $t,
				'fin'         => self::to_hhmm( $start + $duree ),
				'ok'          => $ok,
				'extra'       => $extraok,
				'pizza'       => $gouter >= $p_deb && $gouter <= $p_fin,
				'court'       => $court,
				'court_extra' => $court_x,
			);
		}
		return $out;
	}

	/**
	 * Disponibilités d'un mois « Y-m ».
	 */
	public static function month( $ym ) {
		if ( ! preg_match( '/^(\d{4})-(\d{2})$/', $ym, $m ) ) {
			$ym = current_time( 'Y-m' );
			preg_match( '/^(\d{4})-(\d{2})$/', $ym, $m );
		}
		$days = (int) la_anniv_days_in_month( (int) $m[2], (int) $m[1] );
		$from = sprintf( '%s-01', $ym );
		$to   = sprintf( '%s-%02d', $ym, $days );
		$occ  = self::occupancy( $from, $to );
		$pt   = LA_Anniv_Playtomic::enabled() ? LA_Anniv_Playtomic::for_range( $from, $to ) : array();
		$out  = array();
		for ( $d = 1; $d <= $days; $d++ ) {
			$date  = sprintf( '%s-%02d', $ym, $d );
			$slots = self::slots_for( $date, $occ, $pt );
			if ( $slots ) {
				$out[ $date ] = $slots;
			}
		}
		return $out;
	}

	/** Première date avec un créneau libre (à partir d'une date). */
	public static function next_available( $from = null ) {
		$s     = LA_Anniv_Settings::get();
		$tz    = wp_timezone();
		$start = new DateTimeImmutable( $from && self::valid_date( $from ) ? $from : self::today(), $tz );
		$end   = ( new DateTimeImmutable( self::today(), $tz ) )->modify( '+' . (int) $s['horizon'] . ' days' );
		if ( $start > $end ) {
			return null;
		}
		$occ = self::occupancy( $start->format( 'Y-m-d' ), $end->format( 'Y-m-d' ) );
		$pt  = LA_Anniv_Playtomic::enabled() ? LA_Anniv_Playtomic::for_range( $start->format( 'Y-m-d' ), $end->format( 'Y-m-d' ) ) : array();
		for ( $d = $start; $d <= $end; $d = $d->modify( '+1 day' ) ) {
			foreach ( self::slots_for( $d->format( 'Y-m-d' ), $occ, $pt ) as $slot ) {
				if ( $slot['ok'] ) {
					return $d->format( 'Y-m-d' );
				}
			}
		}
		return null;
	}

	/* ------------------------------------------------------------------
	 * Prix
	 * ---------------------------------------------------------------- */

	/**
	 * @param array $r formule, enfants, options[pizza,ballon,sachet,extra].
	 */
	public static function price( $r ) {
		$formules = LA_Anniv_Settings::formules();
		$options  = LA_Anniv_Settings::options();
		$f        = isset( $formules[ $r['formule'] ] ) ? $formules[ $r['formule'] ] : $formules['complet'];
		$lignes   = array(
			array(
				'label' => 'Formule ' . $f['nom'] . ' · jusqu’à ' . (int) LA_Anniv_Settings::get( 'enfants_max' ) . ' enfants',
				'qte'   => 1,
				'total' => $f['prix'],
			),
		);
		$o = isset( $r['options'] ) ? $r['options'] : array();
		if ( ! empty( $o['pizza'] ) ) {
			$lignes[] = array( 'label' => $options['pizza']['nom'], 'qte' => (int) $o['pizza'], 'total' => (int) $o['pizza'] * $options['pizza']['prix'] );
		}
		if ( ! empty( $o['ballon'] ) ) {
			$lignes[] = array( 'label' => $options['ballon']['nom'], 'qte' => 1, 'total' => $options['ballon']['prix'] );
		}
		if ( ! empty( $o['sachet'] ) ) {
			$lignes[] = array( 'label' => $options['sachet']['nom'], 'qte' => (int) $r['enfants'], 'total' => (int) $r['enfants'] * $options['sachet']['prix'] );
		}
		if ( ! empty( $o['extra'] ) ) {
			$lignes[] = array( 'label' => $options['extra']['nom'], 'qte' => 1, 'total' => $options['extra']['prix'] );
		}
		$total   = array_sum( wp_list_pluck( $lignes, 'total' ) );
		$acompte = min( $total, (float) LA_Anniv_Settings::get( 'acompte' ) );
		return array(
			'lignes'  => $lignes,
			'total'   => $total,
			'acompte' => $acompte,
			'solde'   => $total - $acompte,
		);
	}

	/* ------------------------------------------------------------------
	 * Création d'une demande
	 * ---------------------------------------------------------------- */

	/**
	 * @return array|WP_Error
	 */
	public static function create( $p ) {
		$s        = LA_Anniv_Settings::get();
		$formules = LA_Anniv_Settings::formules();
		$univers  = LA_Anniv_Settings::univers();
		$err      = new WP_Error();

		$formule = isset( $p['formule'] ) ? sanitize_key( $p['formule'] ) : '';
		$uni     = isset( $p['univers'] ) ? sanitize_key( $p['univers'] ) : '';
		$date    = isset( $p['date'] ) ? sanitize_text_field( $p['date'] ) : '';
		$heure   = isset( $p['heure'] ) ? sanitize_text_field( $p['heure'] ) : '';
		$enfants = isset( $p['enfants'] ) ? (int) $p['enfants'] : 0;
		$age     = isset( $p['age'] ) ? (int) $p['age'] : 0;
		$opts    = isset( $p['options'] ) && is_array( $p['options'] ) ? $p['options'] : array();
		$c       = isset( $p['contact'] ) && is_array( $p['contact'] ) ? $p['contact'] : array();

		if ( ! isset( $formules[ $formule ] ) ) {
			$err->add( 'formule', 'Choisissez une formule.' );
		}
		if ( ! isset( $univers[ $uni ] ) ) {
			$err->add( 'univers', 'Choisissez un univers.' );
		}
		if ( $enfants < (int) $s['enfants_min'] || $enfants > (int) $s['enfants_max'] ) {
			$err->add( 'enfants', sprintf( 'Le nombre d’enfants doit être compris entre %d et %d.', $s['enfants_min'], $s['enfants_max'] ) );
		}
		if ( $age < 1 || $age > 18 ) {
			$err->add( 'age', 'Indiquez l’âge de l’enfant fêté.' );
		}

		$extra = ! empty( $opts['extra'] );
		$slot  = null;
		// Planning Playtomic relu sans cache au moment de valider.
		$pt_on = LA_Anniv_Playtomic::enabled();
		$pt    = ( $pt_on && self::valid_date( $date ) ) ? LA_Anniv_Playtomic::occupancy( $date, $date, true ) : array();
		foreach ( self::slots_for( $date, null, $pt ) as $sl ) {
			if ( $sl['h'] === $heure ) {
				$slot = $sl;
			}
		}
		if ( ! $slot || ! $slot['ok'] ) {
			$err->add( 'creneau', 'Ce créneau vient d’être réservé ou n’est plus disponible. Choisissez-en un autre.' );
		} elseif ( $extra && ! $slot['extra'] ) {
			$err->add( 'extra', 'Les 30 minutes supplémentaires ne sont pas possibles sur ce créneau.' );
		}

		$prenom  = isset( $p['prenom_enfant'] ) ? sanitize_text_field( $p['prenom_enfant'] ) : '';
		$nom     = isset( $c['nom'] ) ? sanitize_text_field( $c['nom'] ) : '';
		$tel     = isset( $c['tel'] ) ? sanitize_text_field( $c['tel'] ) : '';
		$email   = isset( $c['email'] ) ? sanitize_email( $c['email'] ) : '';
		$infos   = isset( $c['infos'] ) ? sanitize_textarea_field( $c['infos'] ) : '';
		$source  = isset( $c['source'] ) ? sanitize_text_field( $c['source'] ) : '';
		$present = isset( $c['parent_present'] ) ? sanitize_text_field( $c['parent_present'] ) : '';

		if ( '' === $prenom ) {
			$err->add( 'prenom_enfant', 'Indiquez le prénom de l’enfant fêté.' );
		}
		if ( '' === $nom ) {
			$err->add( 'nom', 'Indiquez votre nom.' );
		}
		if ( strlen( preg_replace( '/\D/', '', $tel ) ) < 9 ) {
			$err->add( 'tel', 'Indiquez un numéro de téléphone valide.' );
		}
		if ( ! is_email( $email ) ) {
			$err->add( 'email', 'Indiquez une adresse e-mail valide.' );
		}
		if ( empty( $p['accepte'] ) ) {
			$err->add( 'accepte', 'Merci d’accepter les conditions de réservation.' );
		}
		if ( $err->has_errors() ) {
			return $err;
		}

		$clean_opts = array(
			'pizza'  => ( ! empty( $slot['pizza'] ) && ! empty( $opts['pizza'] ) ) ? min( 40, max( 0, (int) $opts['pizza'] ) ) : 0,
			'ballon' => ! empty( $opts['ballon'] ) ? 1 : 0,
			'sachet' => ! empty( $opts['sachet'] ) ? 1 : 0,
			'extra'  => $extra ? 1 : 0,
		);
		$data = array(
			'formule'       => $formule,
			'univers'       => $uni,
			'date'          => $date,
			'heure'         => $heure,
			'enfants'       => $enfants,
			'age'           => $age,
			'prenom_enfant' => $prenom,
			'options'       => $clean_opts,
			'contact'       => array(
				'nom'            => $nom,
				'tel'            => $tel,
				'email'          => $email,
				'infos'          => $infos,
				'source'         => $source,
				'parent_present' => $present,
			),
		);
		$data['prix'] = self::price( $data );
		$duree        = (int) $s['duree'] + ( $extra ? 30 : 0 );
		$data['fin']  = self::to_hhmm( self::to_min( $heure ) + $duree );
		$data['terrain']     = $slot ? ( $extra ? $slot['court_extra'] : $slot['court'] ) : '';
		$data['terrain_nom'] = $data['terrain'] ? LA_Anniv_Playtomic::court_name( $data['terrain'] ) : '';
		$data['pt_verifie']  = $pt_on ? is_array( $pt ) : null;
		$data['ref']  = 'ANN-' . strtoupper( wp_generate_password( 6, false, false ) );
		$data['jeton']= wp_generate_password( 24, false, false );

		$id = wp_insert_post(
			array(
				'post_type'   => self::CPT,
				'post_status' => 'publish',
				'post_title'  => sprintf( '%s · %s %s – %s ans', $prenom, self::date_fr( $date, false ), LA_Anniv_Settings::h( $heure ), $age ),
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			return $id;
		}
		update_post_meta( $id, '_la_data', $data );
		update_post_meta( $id, '_la_date', $date );
		update_post_meta( $id, '_la_heure', $heure );
		update_post_meta( $id, '_la_duree', $duree );
		update_post_meta( $id, '_la_statut', 'attente' );
		update_post_meta( $id, '_la_cree', time() );
		update_post_meta( $id, '_la_ref', $data['ref'] );
		update_post_meta( $id, '_la_jeton', $data['jeton'] );
		update_post_meta( $id, '_la_terrain', $data['terrain'] );

		// Double réservation simultanée : on vérifie après coup.
		$occ    = self::occupancy( $date, $date, $id );
		$ranges = isset( $occ[ $date ] ) ? $occ[ $date ] : array();
		$start  = self::to_min( $heure );
		$same_court = 0;
		foreach ( $ranges as $r ) {
			if ( $data['terrain'] && ! empty( $r[2] ) && $r[2] === $data['terrain'] && $r[0] < $start + $duree && $start < $r[1] ) {
				$same_court++;
			}
		}
		if ( $same_court || self::overlaps( $ranges, $start, $start + $duree ) >= max( 1, (int) $s['fetes_par_creneau'] ) ) {
			wp_delete_post( $id, true );
			return new WP_Error( 'creneau', 'Ce créneau vient d’être réservé par une autre famille. Choisissez-en un autre.' );
		}

		$data['id'] = $id;
		self::mail_club( $data );
		self::mail_parent( $data, 'demande' );
		do_action( 'la_anniv_nouvelle_reservation', $id, $data );
		return $data;
	}

	public static function get_by_token( $jeton ) {
		if ( ! is_string( $jeton ) || strlen( $jeton ) < 20 ) {
			return null;
		}
		$q = get_posts(
			array(
				'post_type'      => self::CPT,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'meta_key'       => '_la_jeton',
				'meta_value'     => $jeton,
				'fields'         => 'ids',
			)
		);
		if ( ! $q ) {
			return null;
		}
		$data = get_post_meta( $q[0], '_la_data', true );
		if ( ! is_array( $data ) ) {
			return null;
		}
		$data['id']     = $q[0];
		$data['statut'] = get_post_meta( $q[0], '_la_statut', true );
		return $data;
	}

	/* ------------------------------------------------------------------
	 * Libellés
	 * ---------------------------------------------------------------- */

	public static function date_fr( $date, $long = true ) {
		$jours = array( 'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi' );
		$mois  = array( '', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre' );
		if ( ! self::valid_date( $date ) ) {
			return $date;
		}
		$t = new DateTimeImmutable( $date, wp_timezone() );
		$s = (int) $t->format( 'j' ) . ( '1' === $t->format( 'j' ) ? 'er' : '' ) . ' ' . $mois[ (int) $t->format( 'n' ) ];
		if ( $long ) {
			$s = $jours[ (int) $t->format( 'w' ) ] . ' ' . $s . ' ' . $t->format( 'Y' );
		} else {
			$s .= ' ' . $t->format( 'Y' );
		}
		return $s;
	}

	public static function invitation_url( $data ) {
		$pages = LA_Anniv_Front::page_ids();
		$base  = ! empty( $pages['tunnel'] ) ? get_permalink( $pages['tunnel'] ) : home_url( '/' );
		return add_query_arg( 'invitation', rawurlencode( $data['jeton'] ), $base );
	}

	/* ------------------------------------------------------------------
	 * E-mails
	 * ---------------------------------------------------------------- */

	private static function recap_html( $d ) {
		$f   = LA_Anniv_Settings::formules();
		$u   = LA_Anniv_Settings::univers();
		$row = function ( $k, $v ) {
			return '<tr><td style="padding:6px 12px 6px 0;color:#4A5B7F;vertical-align:top">' . esc_html( $k ) . '</td><td style="padding:6px 0;color:#0B1B3F;font-weight:600">' . nl2br( esc_html( $v ) ) . '</td></tr>';
		};
		$h  = '<table style="border-collapse:collapse;font-size:15px">';
		$h .= $row( 'Référence', $d['ref'] );
		$h .= $row( 'Date', ucfirst( self::date_fr( $d['date'] ) ) );
		$h .= $row( 'Horaire', LA_Anniv_Settings::h( $d['heure'] ) . ' – ' . LA_Anniv_Settings::h( $d['fin'] ) );
		$h .= $row( 'Enfant fêté', $d['prenom_enfant'] . ', ' . $d['age'] . ' ans' );
		$h .= $row( 'Nombre d’enfants', $d['enfants'] . ' (enfant fêté inclus)' );
		$h .= $row( 'Formule', isset( $f[ $d['formule'] ] ) ? $f[ $d['formule'] ]['nom'] : $d['formule'] );
		$h .= $row( 'Univers', isset( $u[ $d['univers'] ] ) ? $u[ $d['univers'] ]['nom'] : $d['univers'] );
		$h .= '</table>';
		$h .= '<table style="border-collapse:collapse;font-size:15px;margin-top:16px;width:100%;max-width:520px">';
		foreach ( $d['prix']['lignes'] as $l ) {
			$h .= '<tr><td style="padding:6px 0;border-bottom:1px solid #E6EEFF">' . esc_html( $l['label'] ) . ( $l['qte'] > 1 ? ' × ' . (int) $l['qte'] : '' ) . '</td><td style="padding:6px 0;border-bottom:1px solid #E6EEFF;text-align:right">' . esc_html( LA_Anniv_Settings::euros( $l['total'] ) ) . '</td></tr>';
		}
		$h .= '<tr><td style="padding:10px 0;font-weight:700">Total</td><td style="padding:10px 0;text-align:right;font-weight:700">' . esc_html( LA_Anniv_Settings::euros( $d['prix']['total'] ) ) . '</td></tr>';
		if ( $d['prix']['acompte'] > 0 ) {
			$h .= '<tr><td style="padding:4px 0;color:#4A5B7F">Acompte à la réservation</td><td style="padding:4px 0;text-align:right;color:#4A5B7F">' . esc_html( LA_Anniv_Settings::euros( $d['prix']['acompte'] ) ) . '</td></tr>';
			$h .= '<tr><td style="padding:4px 0;color:#4A5B7F">Solde le jour de la fête</td><td style="padding:4px 0;text-align:right;color:#4A5B7F">' . esc_html( LA_Anniv_Settings::euros( $d['prix']['solde'] ) ) . '</td></tr>';
		}
		$h .= '</table>';
		return $h;
	}

	private static function wrap_mail( $title, $body ) {
		return '<div style="background:#F4F8FF;padding:24px;font-family:Helvetica,Arial,sans-serif">'
			. '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden">'
			. '<div style="background:#2A5BE6;color:#fff;padding:22px 28px"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#BFD6FF;font-weight:600">Les Acacias · Anniversaires</div>'
			. '<div style="font-size:24px;font-weight:800;margin-top:6px">' . esc_html( $title ) . '</div></div>'
			. '<div style="padding:24px 28px;color:#0B1B3F;font-size:15px;line-height:1.55">' . $body . '</div>'
			. '</div></div>';
	}

	private static function send( $to, $subject, $html, $reply_to = '' ) {
		$headers = array( 'Content-Type: text/html; charset=UTF-8' );
		if ( $reply_to && is_email( $reply_to ) ) {
			$headers[] = 'Reply-To: ' . $reply_to;
		}
		return wp_mail( $to, $subject, $html, $headers );
	}

	/** Rappel de blocage du terrain dans Playtomic (l'API Playtomic est en lecture seule). */
	private static function playtomic_html( $d ) {
		if ( ! isset( $d['pt_verifie'] ) || null === $d['pt_verifie'] ) {
			return '';
		}
		$when = self::date_fr( $d['date'] ) . ', ' . LA_Anniv_Settings::h( $d['heure'] ) . ' – ' . LA_Anniv_Settings::h( $d['fin'] );
		if ( ! $d['pt_verifie'] ) {
			return '<p style="background:#FDE2E2;color:#9B1C1C;border-radius:12px;padding:12px 14px"><strong>⚠ Playtomic n’a pas pu être consulté</strong> au moment de la demande. Vérifiez dans Playtomic Manager qu’un terrain de foot est libre le ' . esc_html( $when ) . ', puis bloquez-le.</p>';
		}
		return '<p style="background:#FFF4D6;color:#5C3D00;border-radius:12px;padding:12px 14px"><strong>À faire dans Playtomic Manager :</strong> bloquer le terrain <strong>' . esc_html( $d['terrain_nom'] ? $d['terrain_nom'] : 'de foot' ) . '</strong> le ' . esc_html( $when ) . ' (le terrain était libre au moment de la demande).</p>';
	}

	public static function mail_club( $d ) {
		$to = LA_Anniv_Settings::get( 'email_notif' );
		if ( ! $to ) {
			return;
		}
		$c     = $d['contact'];
		$body  = '<p><strong>Nouvelle demande d’anniversaire.</strong> Le créneau est bloqué en attendant l’acompte.</p>';
		$body .= self::playtomic_html( $d );
		$body .= self::recap_html( $d );
		$body .= '<h3 style="margin:22px 0 8px">Parent</h3><p>' . esc_html( $c['nom'] ) . '<br>' . esc_html( $c['tel'] ) . '<br><a href="mailto:' . esc_attr( $c['email'] ) . '">' . esc_html( $c['email'] ) . '</a></p>';
		if ( $c['parent_present'] ) {
			$body .= '<p><strong>Parent présent pendant la fête :</strong> ' . esc_html( $c['parent_present'] ) . '</p>';
		}
		if ( $c['infos'] ) {
			$body .= '<p><strong>Allergies / infos :</strong><br>' . nl2br( esc_html( $c['infos'] ) ) . '</p>';
		}
		if ( $c['source'] ) {
			$body .= '<p><strong>Nous a connus par :</strong> ' . esc_html( $c['source'] ) . '</p>';
		}
		$body .= '<p><a href="' . esc_url( admin_url( 'post.php?post=' . (int) $d['id'] . '&action=edit' ) ) . '">Ouvrir la réservation dans WordPress</a></p>';
		self::send( $to, sprintf( 'Anniversaire %s · %s %s', $d['prenom_enfant'], self::date_fr( $d['date'], false ), LA_Anniv_Settings::h( $d['heure'] ) ), self::wrap_mail( 'Nouvelle demande', $body ), $c['email'] );
	}

	public static function mail_parent( $d, $type = 'demande' ) {
		$s    = LA_Anniv_Settings::get();
		$c    = $d['contact'];
		$inv  = self::invitation_url( $d );
		$btn  = function ( $url, $label ) {
			return '<p style="margin:18px 0"><a href="' . esc_url( $url ) . '" style="display:inline-block;background:#2A5BE6;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">' . esc_html( $label ) . '</a></p>';
		};
		if ( 'confirmee' === $type ) {
			$title = 'C’est confirmé !';
			$body  = '<p>Bonjour ' . esc_html( $c['nom'] ) . ',</p><p>L’anniversaire de <strong>' . esc_html( $d['prenom_enfant'] ) . '</strong> est confirmé. Toute l’équipe des Acacias a hâte de vous accueillir.</p>';
		} else {
			$title = 'Demande bien reçue';
			$body  = '<p>Bonjour ' . esc_html( $c['nom'] ) . ',</p><p>Merci ! Nous avons bien reçu votre demande pour l’anniversaire de <strong>' . esc_html( $d['prenom_enfant'] ) . '</strong>. Le créneau est bloqué pour vous.</p>';
			if ( $d['prix']['acompte'] > 0 ) {
				if ( $s['lien_paiement'] ) {
					$body .= '<p>Pour confirmer la réservation, réglez l’acompte de <strong>' . esc_html( LA_Anniv_Settings::euros( $d['prix']['acompte'] ) ) . '</strong>' . ( (int) $s['expiration_h'] > 0 ? ' sous ' . (int) $s['expiration_h'] . ' h' : '' ) . ' :</p>' . $btn( $s['lien_paiement'], 'Payer l’acompte' );
				} else {
					$body .= '<p>Nous vous appelons rapidement pour confirmer le créneau et le règlement de l’acompte de <strong>' . esc_html( LA_Anniv_Settings::euros( $d['prix']['acompte'] ) ) . '</strong>.</p>';
				}
			}
		}
		$body .= self::recap_html( $d );
		$body .= '<h3 style="margin:22px 0 8px">L’invitation à partager</h3><p>Envoyez cette invitation aux parents des copains (WhatsApp, SMS, e-mail) ou imprimez-la.</p>' . $btn( $inv, 'Voir l’invitation' );
		if ( $s['texte_meteo'] ) {
			$body .= '<h3 style="margin:22px 0 8px">Météo</h3><p>' . nl2br( esc_html( $s['texte_meteo'] ) ) . '</p>';
		}
		$body .= '<p style="margin-top:22px">Une question ? Appelez-nous au <a href="tel:' . esc_attr( preg_replace( '/\s/', '', $s['tel'] ) ) . '">' . esc_html( $s['tel'] ) . '</a>.<br>À très vite,<br>L’équipe des Acacias</p>';
		self::send( $c['email'], ( 'confirmee' === $type ? 'Anniversaire confirmé' : 'Votre demande d’anniversaire' ) . ' · Les Acacias', self::wrap_mail( $title, $body ), self::first_email( $s['email_notif'] ) );
	}

	private static function first_email( $list ) {
		$p = array_map( 'trim', explode( ',', (string) $list ) );
		return $p ? $p[0] : '';
	}
}

/**
 * cal_days_in_month() dépend de l'extension « calendar », absente de certains hébergements.
 */
function la_anniv_days_in_month( $month, $year ) {
	return (int) gmdate( 't', gmmktime( 0, 0, 0, (int) $month, 1, (int) $year ) );
}
