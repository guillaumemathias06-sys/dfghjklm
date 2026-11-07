<?php
/**
 * Réglages : tarifs, créneaux, options, coordonnées du club.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LA_Anniv_Settings {

	const OPTION = 'la_anniv_settings';

	/** Jours de la semaine (index PHP date('w')). */
	public static $jours = array(
		1 => 'Lundi',
		2 => 'Mardi',
		3 => 'Mercredi',
		4 => 'Jeudi',
		5 => 'Vendredi',
		6 => 'Samedi',
		0 => 'Dimanche',
	);

	public static function init() {
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
	}

	public static function defaults() {
		return array(
			// Formules.
			'prix_essentiel'    => 250,
			'prix_complet'      => 290,
			'enfants_min'       => 6,
			'enfants_max'       => 12,
			'age_min'           => 6,
			'age_max'           => 12,
			'duree'             => 120,
			// Réservation.
			'acompte'           => 50,
			'fetes_par_creneau' => 1,
			'delai_min'         => 3,
			'horizon'           => 120,
			'expiration_h'      => 72,
			'creneaux'          => array(
				0 => '10:00, 14:00',
				1 => '',
				2 => '',
				3 => '14:00, 16:30',
				4 => '',
				5 => '',
				6 => '10:00, 14:00, 16:30',
			),
			'dates_bloquees'    => '',
			// Options.
			'opt_pizza'         => 12,
			'pizza_debut'       => '11:00',
			'pizza_fin'         => '15:00',
			'opt_ballon'        => 20,
			'opt_sachet'        => 6,
			'opt_extra'         => 40,
			// Club.
			'email_notif'       => get_option( 'admin_email' ),
			'tel'               => '06 25 57 52 68',
			'whatsapp'          => '33695958264',
			'adresse'           => '2500 chemin des Colles et des Régagnades, 06610 La Gaude',
			'lien_paiement'     => '',
			'page_cgv'          => '',
			'texte_meteo'       => "Les activités se déroulent sur nos terrains extérieurs. Si la météo ne permet pas de jouer, nous vous appelons au plus tard le matin de la fête (avant 10h) et nous reportons l'anniversaire à une date de votre choix, sans frais. L'acompte reste valable pour la nouvelle date.",
			'gabarit'           => 'club',
			// Photos (vide = photos du site Les Acacias).
			'img_hero'          => '',
			'img_foot'          => '',
			'img_defis'         => '',
			'img_gouter'        => '',
		);
	}

	public static function get( $key = null ) {
		static $cache = null;
		if ( null === $cache ) {
			$saved = get_option( self::OPTION, array() );
			$cache = wp_parse_args( is_array( $saved ) ? $saved : array(), self::defaults() );
			if ( ! is_array( $cache['creneaux'] ) ) {
				$cache['creneaux'] = self::defaults()['creneaux'];
			}
		}
		if ( null === $key ) {
			return $cache;
		}
		return isset( $cache[ $key ] ) ? $cache[ $key ] : null;
	}

	/* ------------------------------------------------------------------
	 * Catalogue (textes affichés sur les pages et dans le tunnel)
	 * ---------------------------------------------------------------- */

	public static function formules() {
		$s = self::get();
		return array(
			'complet'   => array(
				'id'      => 'complet',
				'nom'     => 'Tout compris',
				'prix'    => (float) $s['prix_complet'],
				'badge'   => 'Recommandé',
				'accroche'=> 'On s’occupe de tout, goûter compris. Vous profitez.',
				'inclus'  => array(
					'2 h de fête sur un terrain réservé',
					'Animateur dédié au groupe',
					'Programme Foot party ou Jeux & défis',
					'Gâteau, bougies, boissons et bonbons',
					'Espace goûter, vaisselle, mise en place et rangement',
					'Invitation numérique à partager',
					'Souvenir pour l’enfant fêté',
				),
			),
			'essentiel' => array(
				'id'      => 'essentiel',
				'nom'     => 'Essentiel',
				'prix'    => (float) $s['prix_essentiel'],
				'badge'   => '',
				'accroche'=> 'L’animation et l’espace goûter. Vous apportez le goûter.',
				'inclus'  => array(
					'2 h de fête sur un terrain réservé',
					'Animateur dédié au groupe',
					'Programme Foot party ou Jeux & défis',
					'Espace goûter et vaisselle',
					'Invitation numérique à partager',
					'Souvenir pour l’enfant fêté',
				),
				'apporte' => 'Gâteau, bougies, boissons et bonbons apportés par vos soins',
			),
		);
	}

	public static function univers() {
		$img = LA_Anniv_Front::images();
		return array(
			'foot'  => array(
				'id'      => 'foot',
				'nom'     => 'Foot party',
				'accroche'=> 'Défis de précision, matchs courts et grande finale.',
				'pour'    => 'Pour les enfants qui aiment le foot, tous niveaux.',
				'img'     => $img['foot'],
				'points'  => array(
					'Ateliers de précision et de conduite de balle',
					'Petits challenges par équipes',
					'Matchs courts sur le terrain de foot à 5',
					'Grande finale et célébration',
				),
			),
			'defis' => array(
				'id'      => 'defis',
				'nom'     => 'Jeux & défis des Acacias',
				'accroche'=> 'Relais, parcours, adresse et coopération : tout le monde joue.',
				'pour'    => 'Pour les groupes aux envies variées, filles et garçons.',
				'img'     => $img['defis'],
				'points'  => array(
					'Relais et parcours d’agilité',
					'Jeux d’adresse et cibles',
					'Défis d’équipe et de coopération',
					'Grande finale des Acacias',
				),
			),
		);
	}

	public static function options() {
		$s = self::get();
		return array(
			'pizza'  => array(
				'id'    => 'pizza',
				'nom'   => 'Repas pizza des enfants',
				'desc'  => sprintf( 'Pizzas du snack du club, pour les fêtes dont le goûter a lieu entre %s et %s.', self::h( $s['pizza_debut'] ), self::h( $s['pizza_fin'] ) ),
				'prix'  => (float) $s['opt_pizza'],
				'unite' => 'pizza',
				'type'  => 'qte',
			),
			'ballon' => array(
				'id'    => 'ballon',
				'nom'   => 'Ballon souvenir signé par les copains',
				'desc'  => 'Un ballon que tous les invités signent pendant le goûter. L’enfant fêté repart avec.',
				'prix'  => (float) $s['opt_ballon'],
				'unite' => '',
				'type'  => 'case',
			),
			'sachet' => array(
				'id'    => 'sachet',
				'nom'   => 'Sachets cadeaux invités',
				'desc'  => 'Un petit sachet surprise remis à chaque enfant au moment du départ.',
				'prix'  => (float) $s['opt_sachet'],
				'unite' => 'enfant',
				'type'  => 'enfant',
			),
			'extra'  => array(
				'id'    => 'extra',
				'nom'   => '30 minutes de jeux supplémentaires',
				'desc'  => 'La fête dure 2 h 30 au lieu de 2 h. Selon la disponibilité du terrain.',
				'prix'  => (float) $s['opt_extra'],
				'unite' => 'groupe',
				'type'  => 'case',
			),
		);
	}

	/** « 14:00 » → « 14h », « 16:30 » → « 16h30 ». */
	public static function h( $hhmm ) {
		$p = explode( ':', (string) $hhmm );
		$h = (int) $p[0];
		$m = isset( $p[1] ) ? (int) $p[1] : 0;
		return $h . 'h' . ( $m ? sprintf( '%02d', $m ) : '' );
	}

	/** « 06 25 57 52 68 » → « tel:+33625575268 ». */
	public static function tel_href() {
		$d = preg_replace( '/\D/', '', (string) self::get( 'tel' ) );
		if ( 10 === strlen( $d ) && '0' === $d[0] ) {
			$d = '33' . substr( $d, 1 );
		}
		return 'tel:+' . $d;
	}

	public static function euros( $n ) {
		$n = (float) $n;
		$txt = ( floor( $n ) == $n ) ? number_format( $n, 0, ',', ' ' ) : number_format( $n, 2, ',', ' ' );
		return $txt . ' €';
	}

	/* ------------------------------------------------------------------
	 * Page de réglages
	 * ---------------------------------------------------------------- */

	public static function register() {
		register_setting(
			'la_anniv',
			self::OPTION,
			array( 'sanitize_callback' => array( __CLASS__, 'sanitize' ) )
		);
	}

	public static function sanitize( $in ) {
		$d   = self::defaults();
		$out = array();
		$num = array( 'prix_essentiel', 'prix_complet', 'acompte', 'opt_pizza', 'opt_ballon', 'opt_sachet', 'opt_extra' );
		foreach ( $num as $k ) {
			$out[ $k ] = isset( $in[ $k ] ) ? max( 0, (float) str_replace( ',', '.', $in[ $k ] ) ) : $d[ $k ];
		}
		$int = array( 'enfants_min', 'enfants_max', 'age_min', 'age_max', 'duree', 'fetes_par_creneau', 'delai_min', 'horizon', 'expiration_h' );
		foreach ( $int as $k ) {
			$out[ $k ] = isset( $in[ $k ] ) ? max( 0, (int) $in[ $k ] ) : $d[ $k ];
		}
		$out['enfants_min']       = max( 1, $out['enfants_min'] );
		$out['enfants_max']       = max( $out['enfants_min'], $out['enfants_max'] );
		$out['duree']             = max( 30, $out['duree'] );
		$out['fetes_par_creneau'] = max( 1, $out['fetes_par_creneau'] );
		$out['horizon']           = max( 7, $out['horizon'] );

		$out['creneaux'] = array();
		foreach ( array_keys( self::$jours ) as $j ) {
			$raw   = isset( $in['creneaux'][ $j ] ) ? $in['creneaux'][ $j ] : '';
			$times = array();
			foreach ( preg_split( '/[\s,;]+/', (string) $raw ) as $t ) {
				$t = str_replace( array( 'h', 'H' ), ':', trim( $t ) );
				if ( preg_match( '/^(\d{1,2}):?(\d{2})?$/', rtrim( $t, ':' ), $m ) ) {
					$hh = (int) $m[1];
					$mm = isset( $m[2] ) ? (int) $m[2] : 0;
					if ( $hh < 24 && $mm < 60 ) {
						$times[] = sprintf( '%02d:%02d', $hh, $mm );
					}
				}
			}
			$times = array_unique( $times );
			sort( $times );
			$out['creneaux'][ $j ] = implode( ', ', $times );
		}

		foreach ( array( 'pizza_debut', 'pizza_fin' ) as $k ) {
			$v         = isset( $in[ $k ] ) ? trim( $in[ $k ] ) : '';
			$out[ $k ] = preg_match( '/^\d{1,2}:\d{2}$/', $v ) ? $v : $d[ $k ];
		}

		$out['dates_bloquees'] = isset( $in['dates_bloquees'] ) ? sanitize_textarea_field( $in['dates_bloquees'] ) : '';
		$out['email_notif']    = isset( $in['email_notif'] ) ? implode( ', ', array_filter( array_map( 'sanitize_email', explode( ',', $in['email_notif'] ) ) ) ) : $d['email_notif'];
		$out['tel']            = isset( $in['tel'] ) ? sanitize_text_field( $in['tel'] ) : $d['tel'];
		$out['whatsapp']       = isset( $in['whatsapp'] ) ? preg_replace( '/\D/', '', $in['whatsapp'] ) : $d['whatsapp'];
		$out['adresse']        = isset( $in['adresse'] ) ? sanitize_text_field( $in['adresse'] ) : $d['adresse'];
		$out['texte_meteo']    = isset( $in['texte_meteo'] ) ? sanitize_textarea_field( $in['texte_meteo'] ) : $d['texte_meteo'];
		$out['gabarit']        = ( isset( $in['gabarit'] ) && 'theme' === $in['gabarit'] ) ? 'theme' : 'club';
		foreach ( array( 'lien_paiement', 'page_cgv', 'img_hero', 'img_foot', 'img_defis', 'img_gouter' ) as $k ) {
			$out[ $k ] = isset( $in[ $k ] ) ? esc_url_raw( trim( $in[ $k ] ) ) : '';
		}
		return $out;
	}

	public static function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$s = self::get();
		$n = self::OPTION;

		$field = function ( $key, $label, $type = 'text', $help = '', $attrs = '' ) use ( $s, $n ) {
			printf(
				'<tr><th scope="row"><label for="%1$s">%2$s</label></th><td><input type="%3$s" id="%1$s" name="%4$s[%1$s]" value="%5$s" class="%6$s" %7$s>%8$s</td></tr>',
				esc_attr( $key ),
				esc_html( $label ),
				esc_attr( $type ),
				esc_attr( $n ),
				esc_attr( $s[ $key ] ),
				'number' === $type ? 'small-text' : 'regular-text',
				$attrs, // phpcs:ignore WordPress.Security.EscapeOutput
				$help ? '<p class="description">' . wp_kses_post( $help ) . '</p>' : ''
			);
		};
		$pages = LA_Anniv_Front::page_ids();
		?>
		<div class="wrap">
			<h1>Anniversaires – Réglages</h1>
			<?php if ( ! empty( $pages['landing'] ) ) : ?>
				<p>
					Pages : <a href="<?php echo esc_url( get_permalink( $pages['landing'] ) ); ?>" target="_blank">Présentation des anniversaires</a>
					<?php if ( ! empty( $pages['tunnel'] ) ) : ?>
						· <a href="<?php echo esc_url( get_permalink( $pages['tunnel'] ) ); ?>" target="_blank">Tunnel de réservation</a>
					<?php endif; ?>
				</p>
			<?php endif; ?>
			<form method="post" action="options.php">
				<?php settings_fields( 'la_anniv' ); ?>

				<h2 class="title">Formules</h2>
				<table class="form-table" role="presentation">
					<?php
					$field( 'prix_complet', 'Prix « Tout compris » (€)', 'number', 'Animation + goûter fourni par le club.', 'step="1" min="0"' );
					$field( 'prix_essentiel', 'Prix « Essentiel » (€)', 'number', 'Animation + espace goûter, goûter apporté par les parents.', 'step="1" min="0"' );
					$field( 'enfants_min', 'Nombre d’enfants minimum', 'number', '', 'min="1"' );
					$field( 'enfants_max', 'Nombre d’enfants inclus (maximum)', 'number', 'Enfant fêté inclus. Au-delà, le tunnel invite à appeler le club.', 'min="1"' );
					$field( 'age_min', 'Âge minimum', 'number' );
					$field( 'age_max', 'Âge maximum', 'number' );
					$field( 'duree', 'Durée de la fête (minutes)', 'number', '', 'min="30" step="15"' );
					?>
				</table>

				<h2 class="title">Créneaux et disponibilités</h2>
				<p>Heures de début des fêtes, séparées par des virgules (ex. <code>10:00, 14:00, 16:30</code>). Laisser vide = pas d’anniversaire ce jour-là.</p>
				<table class="form-table" role="presentation">
					<?php foreach ( self::$jours as $j => $nom ) : ?>
						<tr>
							<th scope="row"><label for="cr<?php echo (int) $j; ?>"><?php echo esc_html( $nom ); ?></label></th>
							<td><input type="text" class="regular-text" id="cr<?php echo (int) $j; ?>" name="<?php echo esc_attr( $n ); ?>[creneaux][<?php echo (int) $j; ?>]" value="<?php echo esc_attr( isset( $s['creneaux'][ $j ] ) ? $s['creneaux'][ $j ] : '' ); ?>"></td>
						</tr>
					<?php endforeach; ?>
					<?php
					$field( 'fetes_par_creneau', 'Fêtes simultanées possibles', 'number', 'Commencez à 1 : le premier goulot sera l’animateur.', 'min="1"' );
					$field( 'delai_min', 'Délai minimum de réservation (jours)', 'number' );
					$field( 'horizon', 'Réservable jusqu’à (jours)', 'number' );
					$field( 'expiration_h', 'Libérer une demande non confirmée après (heures)', 'number', 'Une demande en attente bloque le créneau pendant ce délai. 0 = jamais libérée automatiquement.' );
					?>
					<tr>
						<th scope="row"><label for="dates_bloquees">Dates fermées</label></th>
						<td>
							<textarea id="dates_bloquees" name="<?php echo esc_attr( $n ); ?>[dates_bloquees]" rows="5" class="large-text code" placeholder="25/12/2026&#10;01/01/2027&#10;14/11/2026 14:00"><?php echo esc_textarea( $s['dates_bloquees'] ); ?></textarea>
							<p class="description">Une date par ligne (JJ/MM/AAAA). Ajoutez une heure pour ne bloquer qu’un créneau (ex. <code>14/11/2026 14:00</code>) : tournoi, terrain loué…</p>
						</td>
					</tr>
				</table>

				<h2 class="title">Options (upsells)</h2>
				<table class="form-table" role="presentation">
					<?php
					$field( 'opt_pizza', 'Repas pizza (€ / pizza)', 'number', '', 'step="0.5" min="0"' );
					$field( 'pizza_debut', 'Pizza : goûter entre', 'text', 'Format HH:MM', 'style="width:90px"' );
					$field( 'pizza_fin', '… et', 'text', 'L’option n’est proposée que si le goûter (fin de fête – 30 min) tombe dans cette plage.', 'style="width:90px"' );
					$field( 'opt_ballon', 'Ballon souvenir signé (€)', 'number', '', 'step="0.5" min="0"' );
					$field( 'opt_sachet', 'Sachet cadeau (€ / enfant)', 'number', '', 'step="0.5" min="0"' );
					$field( 'opt_extra', '30 min supplémentaires (€ / groupe)', 'number', '', 'step="0.5" min="0"' );
					?>
				</table>

				<h2 class="title">Acompte et paiement</h2>
				<table class="form-table" role="presentation">
					<?php
					$field( 'acompte', 'Acompte (€)', 'number', 'Déduit du total. 0 = pas d’acompte.', 'step="1" min="0"' );
					$field( 'lien_paiement', 'Lien de paiement de l’acompte', 'url', 'Facultatif : lien Stripe, SumUp, PayPal… affiché après la demande et dans l’e-mail. Sinon, le club rappelle la famille.' );
					$field( 'page_cgv', 'Lien des conditions de réservation', 'url', 'Facultatif : page de conditions (annulation, acompte, encadrement).' );
					?>
					<tr>
						<th scope="row"><label for="texte_meteo">Règle météo</label></th>
						<td><textarea id="texte_meteo" name="<?php echo esc_attr( $n ); ?>[texte_meteo]" rows="4" class="large-text"><?php echo esc_textarea( $s['texte_meteo'] ); ?></textarea>
						<p class="description">Affichée sur la page, dans le tunnel (à accepter) et dans l’e-mail.</p></td>
					</tr>
				</table>

				<h2 class="title">Club</h2>
				<table class="form-table" role="presentation">
					<?php
					$field( 'email_notif', 'E-mail(s) de notification', 'text', 'Séparez plusieurs adresses par une virgule.' );
					$field( 'tel', 'Téléphone affiché', 'text' );
					$field( 'whatsapp', 'WhatsApp (format international)', 'text', 'Ex. 33695958264' );
					$field( 'adresse', 'Adresse du club', 'text', 'Utilisée sur l’invitation numérique.' );
					?>
					<tr>
						<th scope="row">Mise en page</th>
						<td>
							<label><input type="radio" name="<?php echo esc_attr( $n ); ?>[gabarit]" value="club" <?php checked( $s['gabarit'], 'club' ); ?>> En-tête et pied de page du site Les Acacias (recommandé)</label><br>
							<label><input type="radio" name="<?php echo esc_attr( $n ); ?>[gabarit]" value="theme" <?php checked( $s['gabarit'], 'theme' ); ?>> Laisser le thème afficher la page</label>
						</td>
					</tr>
				</table>

				<h2 class="title">Photos</h2>
				<p>Laissez vide pour utiliser les photos du site Les Acacias. Pour une vraie photo d’anniversaire, collez l’URL d’une image de la médiathèque.</p>
				<table class="form-table" role="presentation">
					<?php
					$field( 'img_hero', 'Photo principale', 'url' );
					$field( 'img_foot', 'Photo « Foot party »', 'url' );
					$field( 'img_defis', 'Photo « Jeux & défis »', 'url' );
					$field( 'img_gouter', 'Photo du goûter', 'url' );
					?>
				</table>

				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
