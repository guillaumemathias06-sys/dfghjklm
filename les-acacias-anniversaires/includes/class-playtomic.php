<?php
/**
 * Connexion à l'API Playtomic (Third Party API, lecture seule).
 *
 * Lit le planning des terrains de foot à 5 pour ne proposer un créneau
 * d'anniversaire que si un terrain est réellement libre dans Playtomic.
 * Documentation : https://third-party.playtomic.io/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LA_Anniv_Playtomic {

	const API          = 'https://thirdparty.playtomic.io';
	const TOKEN_KEY    = 'la_anniv_pt_token';
	const COURTS_KEY   = 'la_anniv_pt_courts';
	const STATUS_KEY   = 'la_anniv_pt_status';
	const CACHE_PREFIX = 'la_anniv_pt_bk_';

	/** Dernière erreur rencontrée pendant la requête en cours. */
	public static $error = '';

	/* ------------------------------------------------------------------
	 * Réglages
	 * ---------------------------------------------------------------- */

	public static function enabled() {
		$s = LA_Anniv_Settings::get();
		return ! empty( $s['pt_actif'] ) && self::client_id() && self::secret() && ! empty( $s['pt_tenant'] );
	}

	/** Identifiants : constantes de wp-config.php en priorité, sinon réglages. */
	public static function client_id() {
		if ( defined( 'LA_ANNIV_PLAYTOMIC_CLIENT_ID' ) ) {
			return (string) LA_ANNIV_PLAYTOMIC_CLIENT_ID;
		}
		return (string) LA_Anniv_Settings::get( 'pt_client_id' );
	}

	public static function secret() {
		if ( defined( 'LA_ANNIV_PLAYTOMIC_SECRET' ) ) {
			return (string) LA_ANNIV_PLAYTOMIC_SECRET;
		}
		return (string) LA_Anniv_Settings::get( 'pt_secret' );
	}

	/** Terrains (resource_id) utilisables pour les anniversaires. */
	public static function courts_selected() {
		$sel = LA_Anniv_Settings::get( 'pt_terrains' );
		$sel = is_array( $sel ) ? array_values( array_filter( $sel ) ) : array();
		if ( ! $sel ) {
			$sel = array_keys( self::courts_known() ); // Par défaut : tous les terrains du sport choisi.
		}
		return $sel;
	}

	/** Terrains déjà vus dans le planning : [ resource_id => nom ]. */
	public static function courts_known() {
		$c = get_option( self::COURTS_KEY, array() );
		return is_array( $c ) ? $c : array();
	}

	public static function court_name( $id ) {
		$c = self::courts_known();
		return isset( $c[ $id ] ) ? $c[ $id ] : '';
	}

	/* ------------------------------------------------------------------
	 * HTTP
	 * ---------------------------------------------------------------- */

	public static function token( $force = false ) {
		if ( ! $force ) {
			$t = get_transient( self::TOKEN_KEY );
			if ( $t ) {
				return $t;
			}
		}
		$res = wp_remote_post(
			self::API . '/api/v1/oauth/token',
			array(
				'timeout' => 12,
				'headers' => array( 'Content-Type' => 'application/json' ),
				'body'    => wp_json_encode(
					array(
						'client_id' => self::client_id(),
						'secret'    => self::secret(),
					)
				),
			)
		);
		if ( is_wp_error( $res ) ) {
			self::$error = 'Connexion impossible à Playtomic : ' . $res->get_error_message();
			return '';
		}
		$code = wp_remote_retrieve_response_code( $res );
		$body = json_decode( wp_remote_retrieve_body( $res ), true );
		if ( 200 !== $code || empty( $body['token'] ) ) {
			self::$error = 401 === $code ? 'Identifiants Playtomic refusés (vérifiez l’ID et la clé secrète).' : 'Playtomic a répondu ' . $code . ' à la demande de jeton.';
			return '';
		}
		$ttl = isset( $body['expires_in'] ) ? (int) $body['expires_in'] : 3600;
		set_transient( self::TOKEN_KEY, $body['token'], max( 60, $ttl - 120 ) );
		return $body['token'];
	}

	private static function get( $path, $query, $retry = true ) {
		$token = self::token();
		if ( ! $token ) {
			return null;
		}
		$url = add_query_arg( array_map( 'rawurlencode', $query ), self::API . $path );
		$res = wp_remote_get(
			$url,
			array(
				'timeout' => 15,
				'headers' => array(
					'Authorization' => 'Bearer ' . $token,
					'Content-Type'  => 'application/json',
				),
			)
		);
		if ( is_wp_error( $res ) ) {
			self::$error = 'Connexion impossible à Playtomic : ' . $res->get_error_message();
			return null;
		}
		$code = wp_remote_retrieve_response_code( $res );
		if ( ( 401 === $code || 403 === $code ) && $retry ) {
			delete_transient( self::TOKEN_KEY );
			return self::get( $path, $query, false );
		}
		if ( 200 !== $code ) {
			self::$error = 429 === $code ? 'Trop de requêtes envoyées à Playtomic, réessayez dans quelques minutes.' : 'Playtomic a répondu ' . $code . '.';
			return null;
		}
		$data = json_decode( wp_remote_retrieve_body( $res ), true );
		return is_array( $data ) ? $data : null;
	}

	/* ------------------------------------------------------------------
	 * Planning
	 * ---------------------------------------------------------------- */

	/**
	 * Réservations Playtomic entre deux dates locales (incluses), regroupées
	 * par jour local et par terrain, en minutes depuis minuit :
	 * [ 'Y-m-d' => [ resource_id => [ [debut, fin, libellé], ... ] ] ].
	 *
	 * Retourne null si Playtomic n'a pas pu être interrogé.
	 */
	public static function occupancy( $from, $to, $fresh = false ) {
		if ( ! self::enabled() ) {
			return array();
		}
		$s     = LA_Anniv_Settings::get();
		$key   = self::CACHE_PREFIX . md5( $from . '|' . $to . '|' . $s['pt_sport'] . '|' . $s['pt_tenant'] );
		$cache = $fresh ? false : get_transient( $key );
		if ( is_array( $cache ) ) {
			return $cache;
		}

		$tz    = wp_timezone();
		$utc   = new DateTimeZone( 'UTC' );
		$start = ( new DateTimeImmutable( $from . ' 00:00:00', $tz ) )->setTimezone( $utc );
		$end   = ( new DateTimeImmutable( $to . ' 23:59:59', $tz ) )->setTimezone( $utc );

		$rows = array();
		for ( $page = 0; $page < 20; $page++ ) {
			$q = array(
				'tenant_id'          => $s['pt_tenant'],
				'start_booking_date' => $start->format( 'Y-m-d\TH:i:s' ),
				'end_booking_date'   => $end->format( 'Y-m-d\TH:i:s' ),
				'page'               => $page,
				'size'               => 200,
			);
			if ( $s['pt_sport'] ) {
				$q['sport_id'] = $s['pt_sport'];
			}
			$data = self::get( '/api/v1/bookings', $q );
			if ( null === $data ) {
				self::status( false );
				return null;
			}
			$rows = array_merge( $rows, $data );
			if ( count( $data ) < 200 ) {
				break;
			}
		}

		$out    = array();
		$courts = self::courts_known();
		foreach ( $rows as $b ) {
			if ( empty( $b['resource_id'] ) || empty( $b['booking_start_date'] ) || empty( $b['booking_end_date'] ) ) {
				continue;
			}
			if ( ! empty( $b['resource_name'] ) ) {
				$courts[ $b['resource_id'] ] = $b['resource_name'];
			}
			if ( ! empty( $b['is_canceled'] ) || ( isset( $b['status'] ) && 'CANCELED' === $b['status'] ) ) {
				continue;
			}
			try {
				$bs = ( new DateTimeImmutable( $b['booking_start_date'], $utc ) )->setTimezone( $tz );
				$be = ( new DateTimeImmutable( $b['booking_end_date'], $utc ) )->setTimezone( $tz );
			} catch ( Exception $e ) {
				continue;
			}
			// Découpe par jour local (une réservation peut passer minuit).
			for ( $d = $bs->setTime( 0, 0 ); $d < $be; $d = $d->modify( '+1 day' ) ) {
				$day   = $d->format( 'Y-m-d' );
				$smin  = $bs > $d ? ( (int) $bs->format( 'G' ) * 60 + (int) $bs->format( 'i' ) ) : 0;
				$next  = $d->modify( '+1 day' );
				$emin  = $be < $next ? ( (int) $be->format( 'G' ) * 60 + (int) $be->format( 'i' ) ) : 1440;
				$label = self::label( $b );
				$out[ $day ][ $b['resource_id'] ][] = array( $smin, $emin, $label );
			}
		}
		uasort( $courts, 'strnatcasecmp' );
		update_option( self::COURTS_KEY, $courts, false );
		self::status( true );
		set_transient( $key, $out, max( 1, (int) $s['pt_cache'] ) * MINUTE_IN_SECONDS );
		return $out;
	}

	private static function label( $b ) {
		$types = array(
			'REGULAR_BOOKING'   => 'Réservation',
			'RECURRING_BOOKING' => 'Réservation récurrente',
			'OPEN_MATCH'        => 'Match ouvert',
			'LEAGUE_MATCH'      => 'Match de ligue',
			'PRIVATE_CLASS'     => 'Cours particulier',
			'COURSE_CLASS'      => 'Cours collectif',
			'TOURNAMENT'        => 'Tournoi',
			'PUBLIC_CLASS'      => 'Cours',
			'OPEN_PLAY'         => 'Open play',
		);
		$t = isset( $b['booking_type'] ) && isset( $types[ $b['booking_type'] ] ) ? $types[ $b['booking_type'] ] : 'Réservation';
		if ( ! empty( $b['activity_name'] ) ) {
			$t .= ' · ' . $b['activity_name'];
		} elseif ( ! empty( $b['course_name'] ) ) {
			$t .= ' · ' . $b['course_name'];
		}
		return $t;
	}

	/** Mémorise l'état de la dernière synchronisation (affiché dans l'administration). */
	private static function status( $ok ) {
		$st = get_option( self::STATUS_KEY, array() );
		$st = is_array( $st ) ? $st : array();
		if ( $ok ) {
			$st['ok'] = time();
		} else {
			$st['err']     = time();
			$st['message'] = self::$error;
		}
		update_option( self::STATUS_KEY, $st, false );
	}

	public static function last_status() {
		$st = get_option( self::STATUS_KEY, array() );
		return is_array( $st ) ? $st : array();
	}

	/**
	 * Fenêtre couverte par le cache principal : d'aujourd'hui à l'horizon de réservation.
	 * Une seule requête (paginée) alimente le calendrier de tous les mois.
	 */
	public static function window() {
		$tz    = wp_timezone();
		$today = new DateTimeImmutable( LA_Anniv_Bookings::today(), $tz );
		$end   = $today->modify( '+' . ( (int) LA_Anniv_Settings::get( 'horizon' ) + 1 ) . ' days' );
		return array( $today->format( 'Y-m-d' ), $end->format( 'Y-m-d' ) );
	}

	/** Planning Playtomic d'une plage de dates, depuis le cache de la fenêtre si possible. */
	public static function for_range( $from, $to, $fresh = false ) {
		if ( ! self::enabled() ) {
			return array();
		}
		list( $wf, $wt ) = self::window();
		if ( ! $fresh && $from >= $wf && $to <= $wt ) {
			return self::occupancy( $wf, $wt );
		}
		return self::occupancy( $from, $to, $fresh );
	}

	/** Vide le cache (après un changement de réglages). */
	public static function flush() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", '_transient_' . self::CACHE_PREFIX . '%', '_transient_timeout_' . self::CACHE_PREFIX . '%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		delete_transient( self::TOKEN_KEY );
	}

	/**
	 * Teste la connexion : jeton + lecture du planning sur la fenêtre.
	 *
	 * @return array{ok:bool,message:string,courts:array}
	 */
	public static function test() {
		self::$error = '';
		self::flush();
		if ( ! self::client_id() || ! self::secret() || ! LA_Anniv_Settings::get( 'pt_tenant' ) ) {
			return array( 'ok' => false, 'message' => 'Renseignez l’ID du club, l’ID API et la clé secrète.', 'courts' => array() );
		}
		if ( ! self::token( true ) ) {
			return array( 'ok' => false, 'message' => self::$error, 'courts' => array() );
		}
		$tz    = wp_timezone();
		$today = new DateTimeImmutable( LA_Anniv_Bookings::today(), $tz );
		// Les terrains sont découverts à partir des réservations : on regarde large.
		$occ = self::occupancy( $today->modify( '-60 days' )->format( 'Y-m-d' ), $today->modify( '+60 days' )->format( 'Y-m-d' ), true );
		if ( null === $occ ) {
			return array( 'ok' => false, 'message' => self::$error, 'courts' => array() );
		}
		$n = 0;
		foreach ( $occ as $courts ) {
			foreach ( $courts as $list ) {
				$n += count( $list );
			}
		}
		return array(
			'ok'      => true,
			'message' => sprintf( 'Connexion réussie : %d réservations lues sur les terrains %s.', $n, LA_Anniv_Settings::get( 'pt_sport' ) ? 'du sport choisi' : 'du club' ),
			'courts'  => self::courts_known(),
		);
	}
}
