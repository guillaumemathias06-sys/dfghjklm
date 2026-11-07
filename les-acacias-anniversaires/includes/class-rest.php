<?php
/**
 * API REST du tunnel : disponibilités et envoi de la demande.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LA_Anniv_Rest {

	const NS = 'la-anniv/v1';

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes() {
		register_rest_route(
			self::NS,
			'/dispos',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => array( __CLASS__, 'dispos' ),
				'args'                => array(
					'mois' => array( 'type' => 'string' ),
				),
			)
		);
		register_rest_route(
			self::NS,
			'/reservation',
			array(
				'methods'             => 'POST',
				'permission_callback' => '__return_true',
				'callback'            => array( __CLASS__, 'reservation' ),
			)
		);
	}

	public static function dispos( WP_REST_Request $req ) {
		$mois = (string) $req->get_param( 'mois' );
		if ( ! preg_match( '/^\d{4}-\d{2}$/', $mois ) ) {
			$mois = current_time( 'Y-m' );
		}
		$res = new WP_REST_Response(
			array(
				'mois'      => $mois,
				'jours'     => (object) self::public_slots( LA_Anniv_Bookings::month( $mois ) ),
				'prochaine' => LA_Anniv_Bookings::next_available(),
			)
		);
		$res->header( 'Cache-Control', 'no-store' );
		return $res;
	}

	/** Les identifiants de terrains restent internes. */
	private static function public_slots( $days ) {
		foreach ( $days as $d => $slots ) {
			foreach ( $slots as $i => $sl ) {
				unset( $days[ $d ][ $i ]['court'], $days[ $d ][ $i ]['court_extra'] );
			}
		}
		return $days;
	}

	public static function reservation( WP_REST_Request $req ) {
		$p = $req->get_json_params();
		if ( ! is_array( $p ) ) {
			$p = $req->get_body_params();
		}

		// Anti-spam : champ piège et temps de remplissage minimal.
		if ( ! empty( $p['site_web'] ) ) {
			return new WP_REST_Response( array( 'ok' => true ), 200 );
		}
		if ( isset( $p['t0'] ) && ( time() * 1000 - (int) $p['t0'] ) < 8000 ) {
			return new WP_Error( 'trop_rapide', 'Merci de vérifier vos informations avant d’envoyer.', array( 'status' => 400 ) );
		}

		// Limite : 5 demandes par heure et par adresse IP.
		$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$key = 'la_anniv_rl_' . md5( $ip );
		$n   = (int) get_transient( $key );
		if ( $n >= 5 ) {
			return new WP_Error( 'limite', 'Trop de demandes envoyées. Appelez-nous directement, nous vous répondrons avec plaisir.', array( 'status' => 429 ) );
		}
		$r = LA_Anniv_Bookings::create( $p );
		if ( is_wp_error( $r ) ) {
			return new WP_REST_Response(
				array(
					'ok'      => false,
					'erreurs' => $r->get_error_messages(),
					'champs'  => $r->get_error_codes(),
				),
				422
			);
		}
		set_transient( $key, $n + 1, HOUR_IN_SECONDS );
		$s = LA_Anniv_Settings::get();
		return new WP_REST_Response(
			array(
				'ok'          => true,
				'ref'         => $r['ref'],
				'prix'        => $r['prix'],
				'date_txt'    => LA_Anniv_Bookings::date_fr( $r['date'] ),
				'horaire'     => LA_Anniv_Settings::h( $r['heure'] ) . ' – ' . LA_Anniv_Settings::h( $r['fin'] ),
				'paiement'    => $r['prix']['acompte'] > 0 ? $s['lien_paiement'] : '',
				'invitation'  => LA_Anniv_Bookings::invitation_url( $r ),
				'expiration'  => (int) $s['expiration_h'],
			),
			201
		);
	}
}
