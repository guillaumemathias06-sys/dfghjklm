<?php
/**
 * Pages publiques : création des pages, shortcodes, gabarit, scripts.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LA_Anniv_Front {

	const PAGES_OPTION = 'la_anniv_pages';
	const SC_LANDING   = 'acacias_anniversaires';
	const SC_TUNNEL    = 'acacias_anniversaires_reservation';

	/** Dossier du plugin principal du site (polices, photos, styles). */
	const CLUB_SLUG = 'les-acacias-site';

	public static function init() {
		add_shortcode( self::SC_LANDING, array( __CLASS__, 'sc_landing' ) );
		add_shortcode( self::SC_TUNNEL, array( __CLASS__, 'sc_tunnel' ) );
		add_filter( 'template_include', array( __CLASS__, 'template' ), 999 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'assets' ), 20 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'drop_theme_assets' ), 999 );
		add_filter( 'body_class', array( __CLASS__, 'body_class' ) );
		add_action( 'wp_head', array( __CLASS__, 'head' ), 2 );
	}

	/* ------------------------------------------------------------------
	 * Pages
	 * ---------------------------------------------------------------- */

	public static function activate() {
		LA_Anniv_Bookings::register_cpt();
		$pages = self::page_ids();

		if ( empty( $pages['landing'] ) || ! get_post( $pages['landing'] ) || 'trash' === get_post_status( $pages['landing'] ) ) {
			$existing = get_page_by_path( 'anniversaires' );
			$pages['landing'] = $existing ? $existing->ID : wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_title'   => 'Anniversaires enfants',
					'post_name'    => 'anniversaires',
					'post_content' => '<!-- wp:shortcode -->[' . self::SC_LANDING . ']<!-- /wp:shortcode -->',
				)
			);
		}
		if ( empty( $pages['tunnel'] ) || ! get_post( $pages['tunnel'] ) || 'trash' === get_post_status( $pages['tunnel'] ) ) {
			$existing = get_page_by_path( 'anniversaires/reserver' );
			$pages['tunnel'] = $existing ? $existing->ID : wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_title'   => 'Réserver un anniversaire',
					'post_name'    => 'reserver',
					'post_parent'  => (int) $pages['landing'],
					'post_content' => '<!-- wp:shortcode -->[' . self::SC_TUNNEL . ']<!-- /wp:shortcode -->',
				)
			);
		}
		update_option( self::PAGES_OPTION, $pages, false );
		flush_rewrite_rules();
	}

	public static function page_ids() {
		$p = get_option( self::PAGES_OPTION, array() );
		return wp_parse_args( is_array( $p ) ? $p : array(), array( 'landing' => 0, 'tunnel' => 0 ) );
	}

	public static function landing_url() {
		$p = self::page_ids();
		return $p['landing'] ? get_permalink( $p['landing'] ) : home_url( '/anniversaires/' );
	}

	public static function tunnel_url( $args = array() ) {
		$p   = self::page_ids();
		$url = $p['tunnel'] ? get_permalink( $p['tunnel'] ) : home_url( '/anniversaires/reserver/' );
		return $args ? add_query_arg( $args, $url ) : $url;
	}

	/** Page courante = une page anniversaires ? Retourne 'landing', 'tunnel' ou ''. */
	public static function current() {
		static $cur = null;
		if ( null !== $cur ) {
			return $cur;
		}
		$cur = '';
		if ( ! is_singular() ) {
			return $cur;
		}
		$post = get_queried_object();
		if ( ! $post instanceof WP_Post ) {
			return $cur;
		}
		if ( has_shortcode( $post->post_content, self::SC_TUNNEL ) ) {
			$cur = 'tunnel';
		} elseif ( has_shortcode( $post->post_content, self::SC_LANDING ) ) {
			$cur = 'landing';
		}
		return $cur;
	}

	/* ------------------------------------------------------------------
	 * Ressources du site principal
	 * ---------------------------------------------------------------- */

	public static function club_url( $path = '' ) {
		return trailingslashit( WP_PLUGIN_URL ) . self::CLUB_SLUG . '/' . ltrim( $path, '/' );
	}

	public static function club_has( $path ) {
		return file_exists( trailingslashit( WP_PLUGIN_DIR ) . self::CLUB_SLUG . '/' . ltrim( $path, '/' ) );
	}

	private static function club_ver( $path ) {
		$f = trailingslashit( WP_PLUGIN_DIR ) . self::CLUB_SLUG . '/' . ltrim( $path, '/' );
		return file_exists( $f ) ? (string) filemtime( $f ) : LA_ANNIV_VERSION;
	}

	public static function images() {
		$s   = LA_Anniv_Settings::get();
		$pic = function ( $custom, $files ) {
			if ( $custom ) {
				return $custom;
			}
			foreach ( (array) $files as $f ) {
				if ( self::club_has( 'assets/img/' . $f ) ) {
					return self::club_url( 'assets/img/' . $f );
				}
			}
			return '';
		};
		return array(
			'hero'     => $pic( $s['img_hero'], array( 'five-ballons.jpg', 'five-large.jpg', 'five-terrain.jpg' ) ),
			'foot'     => $pic( $s['img_foot'], array( 'five-terrain.jpg', 'five-large.jpg' ) ),
			'defis'    => $pic( $s['img_defis'], array( 'five-aerien.jpg', 'five-ballons.jpg' ) ),
			'buffet'   => $pic( '', array( 'tournoi-buffet.jpg', 'terrasse.jpg' ) ),
			'gouter'   => $pic( $s['img_gouter'], array( 'terrasse.jpg', 'tournoi-buffet.jpg' ) ),
			'souvenir' => $pic( '', array( 'medailles.jpg' ) ),
			'logo'     => $pic( '', array( 'logo-96.png', 'logo.png' ) ),
			'mm_padel' => $pic( '', array( 'padel-terrain-640.webp' ) ),
			'mm_tennis'=> $pic( '', array( 'tennis-terre-640.webp' ) ),
			'mm_five'  => $pic( '', array( 'five-terrain-640.webp' ) ),
		);
	}

	/* ------------------------------------------------------------------
	 * Gabarit
	 * ---------------------------------------------------------------- */

	public static function template( $template ) {
		if ( self::current() && 'club' === LA_Anniv_Settings::get( 'gabarit' ) ) {
			return LA_ANNIV_DIR . 'templates/shell.php';
		}
		return $template;
	}

	public static function body_class( $classes ) {
		if ( self::current() ) {
			$classes[] = 'la-site';
			$classes[] = 'la-anniv-page';
			$classes[] = 'la-anniv-' . self::current();
		}
		return $classes;
	}

	public static function head() {
		if ( ! self::current() ) {
			return;
		}
		if ( ! empty( $_GET['invitation'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			echo '<meta name="robots" content="noindex, nofollow">' . "\n";
		}
		foreach ( array( 'bricolage-grotesque-latin-wght-normal.woff2', 'instrument-sans-latin-wght-normal.woff2' ) as $f ) {
			if ( self::club_has( 'assets/fonts/' . $f ) ) {
				printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( self::club_url( 'assets/fonts/' . $f ) ) );
			}
		}
		// Description pour les moteurs de recherche, si aucune extension SEO ne s'en charge.
		if ( ! defined( 'WPSEO_VERSION' ) && ! class_exists( 'RankMath' ) && ! defined( 'SEOPRESS_VERSION' ) ) {
			$s = LA_Anniv_Settings::get();
			if ( 'tunnel' === self::current() ) {
				$desc = 'Réservez l’anniversaire de votre enfant aux Acacias : choisissez la formule, l’univers Foot ou Défis, la date et les options en quelques minutes.';
			} else {
				$desc = sprintf( 'Anniversaires enfants aux Acacias, à La Gaude : 2 h de fête Foot ou Jeux & défis avec un animateur dédié, jusqu’à %d enfants. Formules à %s et %s.', (int) $s['enfants_max'], LA_Anniv_Settings::euros( $s['prix_essentiel'] ), LA_Anniv_Settings::euros( $s['prix_complet'] ) );
			}
			printf( '<meta name="description" content="%s">' . "\n", esc_attr( $desc ) );
		}
	}

	public static function assets() {
		$cur = self::current();
		if ( ! $cur ) {
			return;
		}
		$deps = array();
		if ( self::club_has( 'assets/site.css' ) ) {
			// Mêmes identifiants que le plugin du site : jamais chargés deux fois.
			if ( ! wp_style_is( 'la-site', 'registered' ) ) {
				wp_register_style( 'la-site', self::club_url( 'assets/site.css' ), array(), self::club_ver( 'assets/site.css' ) );
			}
			$deps[] = 'la-site';
		}
		wp_enqueue_style( 'la-anniv', LA_ANNIV_URL . 'assets/css/anniv.css', $deps, LA_ANNIV_VERSION );

		if ( 'club' === LA_Anniv_Settings::get( 'gabarit' ) && self::club_has( 'assets/pages.js' ) && ! wp_script_is( 'la-site', 'enqueued' ) && ! wp_script_is( 'la-inner', 'enqueued' ) ) {
			if ( ! wp_script_is( 'la-pages', 'registered' ) ) {
				wp_register_script( 'la-pages', self::club_url( 'assets/pages.js' ), array(), self::club_ver( 'assets/pages.js' ), true );
			}
			wp_enqueue_script( 'la-pages' );
		}

		wp_enqueue_script( 'la-anniv', LA_ANNIV_URL . 'assets/js/anniv.js', array(), LA_ANNIV_VERSION, true );

		if ( 'tunnel' === $cur && ! empty( $_GET['invitation'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			wp_enqueue_script( 'la-anniv-jspdf', LA_ANNIV_URL . 'assets/vendor/jspdf.umd.min.js', array(), '2.5.2', true );
			wp_enqueue_script( 'la-anniv-invitation', LA_ANNIV_URL . 'assets/js/invitation-print.js', array( 'la-anniv-jspdf' ), LA_ANNIV_VERSION, true );
		}
		if ( 'tunnel' === $cur && empty( $_GET['invitation'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			wp_enqueue_script( 'la-anniv-tunnel', LA_ANNIV_URL . 'assets/js/tunnel.js', array(), LA_ANNIV_VERSION, true );
			wp_add_inline_script( 'la-anniv-tunnel', 'window.LA_ANNIV=' . wp_json_encode( self::tunnel_config() ) . ';', 'before' );
		}
	}

	/**
	 * Gabarit « club » : la page n'utilise pas le thème, ses feuilles de style
	 * (Kadence…) ne doivent pas modifier les boutons, champs et titres.
	 */
	public static function drop_theme_assets() {
		if ( ! self::current() || 'club' !== LA_Anniv_Settings::get( 'gabarit' ) ) {
			return;
		}
		$roots = array_unique( array( get_stylesheet_directory_uri(), get_template_directory_uri() ) );
		foreach ( array( wp_styles(), wp_scripts() ) as $deps ) {
			foreach ( (array) $deps->queue as $handle ) {
				$src = isset( $deps->registered[ $handle ] ) ? (string) $deps->registered[ $handle ]->src : '';
				foreach ( $roots as $root ) {
					if ( $src && 0 === strpos( $src, $root ) ) {
						$deps === wp_styles() ? wp_dequeue_style( $handle ) : wp_dequeue_script( $handle );
					}
				}
			}
		}
		$extra = apply_filters( 'la_anniv_dequeue_styles', array( 'kadence-global', 'kadence-header', 'kadence-content', 'kadence-footer' ) );
		foreach ( $extra as $h ) {
			wp_dequeue_style( $h );
		}
	}

	public static function tunnel_config() {
		$s = LA_Anniv_Settings::get();
		// Pré-sélection depuis la page de présentation.
		$pre = array();
		foreach ( array( 'formule', 'univers' ) as $k ) {
			if ( isset( $_GET[ $k ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
				$pre[ $k ] = sanitize_key( wp_unslash( $_GET[ $k ] ) ); // phpcs:ignore WordPress.Security.NonceVerification
			}
		}
		$formules = array_values( LA_Anniv_Settings::formules() );
		$univers  = array_values( LA_Anniv_Settings::univers() );
		$options  = array_values( LA_Anniv_Settings::options() );
		return array(
			'api'       => esc_url_raw( rest_url( LA_Anniv_Rest::NS ) ),
			'aujourdhui'=> LA_Anniv_Bookings::today(),
			'formules'  => $formules,
			'univers'   => $univers,
			'options'   => $options,
			'enfantsMin'=> (int) $s['enfants_min'],
			'enfantsMax'=> (int) $s['enfants_max'],
			'ageMin'    => (int) $s['age_min'],
			'ageMax'    => (int) $s['age_max'],
			'duree'     => (int) $s['duree'],
			'horizon'   => (int) $s['horizon'],
			'jours'     => LA_Anniv_Settings::jours_txt(),
			'dureeTxt'  => LA_Anniv_Settings::duree_txt(),
			'acompte'   => (float) $s['acompte'],
			'expiration'=> (int) $s['expiration_h'],
			'meteo'     => $s['texte_meteo'],
			'cgv'       => $s['page_cgv'],
			'tel'       => $s['tel'],
			'whatsapp'  => $s['whatsapp'],
			'pizza'     => array( LA_Anniv_Settings::h( $s['pizza_debut'] ), LA_Anniv_Settings::h( $s['pizza_fin'] ) ),
			'pre'       => (object) $pre,
			'landing'   => self::landing_url(),
		);
	}

	/* ------------------------------------------------------------------
	 * Shortcodes
	 * ---------------------------------------------------------------- */

	public static function sc_landing() {
		ob_start();
		include LA_ANNIV_DIR . 'templates/landing.php';
		return ob_get_clean();
	}

	public static function sc_tunnel() {
		ob_start();
		$jeton = isset( $_GET['invitation'] ) ? sanitize_text_field( wp_unslash( $_GET['invitation'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		if ( $jeton ) {
			$resa = LA_Anniv_Bookings::get_by_token( $jeton );
			include LA_ANNIV_DIR . 'templates/invitation.php';
		} else {
			include LA_ANNIV_DIR . 'templates/tunnel.php';
		}
		return ob_get_clean();
	}

	/* ------------------------------------------------------------------
	 * En-tête et pied de page identiques au site Les Acacias
	 * ---------------------------------------------------------------- */

	public static function icon( $name ) {
		$icons = array(
			'arrow'  => '<path d="M5 12h14M13 6l6 6-6 6"/>',
			'check'  => '<path d="M20 6 9 17l-5-5"/>',
			'phone'  => '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
			'clock'  => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
			'kids'   => '<circle cx="9" cy="7" r="3"/><path d="M3 21v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 21v-.5a4.5 4.5 0 0 1 6-4.2"/>',
			'whistle'=> '<circle cx="11" cy="7" r="4"/><path d="M3 21v-1a8 8 0 0 1 10.5-7.6"/><path d="m15 19 2 2 4-4"/>',
			'shirt'  => '<path d="M8 3 3 6l2 5 3-1v11h8V10l3 1 2-5-5-3c-.6 1.5-2.1 2.5-4 2.5S8.6 4.5 8 3z"/>',
			'ball'   => '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10z"/><path d="M12 3v4M16 10l4.5-1.5M14.5 14.5 17 19M9.5 14.5 7 19M8 10 3.5 8.5"/>',
			'cake'   => '<path d="M4 21V12h16v9M2 21h20M4 16c2 1.5 4 1.5 5.3 0 1.4 1.5 4 1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0M8 12V8M12 12V8M16 12V8"/><path d="M8 5.5a1 1 0 0 0 0-2M12 5.5a1 1 0 0 0 0-2M16 5.5a1 1 0 0 0 0-2"/>',
			'trophy' => '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
			'gift'   => '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
			'pizza'  => '<path d="M12 2 2 20c6 3 14 3 20 0z"/><path d="M5 14.5c4.5 1.5 9.5 1.5 14 0"/><circle cx="11" cy="11" r="1"/><circle cx="14" cy="16" r="1"/><circle cx="9" cy="17" r="1"/>',
			'plus30' => '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/>',
			'sun'    => '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
			'shield' => '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
			'star'   => '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
			'calendar'=> '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
			'pin'    => '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
			'share'  => '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
			'print'  => '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
		);
		if ( ! isset( $icons[ $name ] ) ) {
			return '';
		}
		return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $icons[ $name ] . '</svg>';
	}

	public static function header_html() {
		$img = self::images();
		$h   = function ( $p ) {
			return esc_url( home_url( $p ) );
		};
		$s   = LA_Anniv_Settings::get();
		ob_start();
		?>
<header class="hdr" id="hdr">
  <div class="hdr-in">
    <a class="logo" href="<?php echo $h( '/' ); ?>" aria-label="Les Acacias, accueil"><?php if ( $img['logo'] ) : ?><img class="mark" src="<?php echo esc_url( $img['logo'] ); ?>" alt="" width="46" height="46"><?php endif; ?>Les Acacias</a>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      <div class="dk">
      <a href="<?php echo $h( '/padel-tarif-coachs/' ); ?>">Padel</a>
      <a href="<?php echo $h( '/tarifs-tennis/' ); ?>">Tennis</a>
      <a href="<?php echo $h( '/calcetto/' ); ?>">Foot à 5</a>
      <a href="<?php echo $h( '/ecole-de-tennis-et-padel/' ); ?>">École</a>
      <a href="<?php echo esc_url( self::landing_url() ); ?>" aria-current="page">Anniversaires</a>
      <a href="<?php echo $h( '/tournois/' ); ?>">Tournois</a>
      <a href="<?php echo $h( '/#club' ); ?>">Le club</a>
      <a href="<?php echo $h( '/#contact' ); ?>">Contact</a>
      <a class="btn" href="<?php echo esc_url( self::tunnel_url() ); ?>">Réserver une fête</a>
      </div>
      <div class="mm">
        <p class="mm-open"><i></i><span>Ouvert 7j/7</span><em>· La Gaude</em></p>
        <div class="mm-sp">
          <a href="<?php echo $h( '/padel-tarif-coachs/' ); ?>" style="--bg:url(<?php echo esc_url( $img['mm_padel'] ); ?>)"><b>Padel</b></a>
          <a href="<?php echo $h( '/tarifs-tennis/' ); ?>" style="--bg:url(<?php echo esc_url( $img['mm_tennis'] ); ?>)"><b>Tennis</b></a>
          <a href="<?php echo $h( '/calcetto/' ); ?>" style="--bg:url(<?php echo esc_url( $img['mm_five'] ); ?>)"><b>Five</b></a>
        </div>
        <div class="mm-g">
          <a class="wide" href="<?php echo esc_url( self::landing_url() ); ?>"><?php echo self::icon( 'cake' ); // phpcs:ignore ?>Anniversaires enfants</a>
          <a href="<?php echo $h( '/ecole-de-tennis-et-padel/' ); ?>"><?php echo self::icon( 'star' ); // phpcs:ignore ?>École</a>
          <a href="<?php echo $h( '/tournois/' ); ?>"><?php echo self::icon( 'trophy' ); // phpcs:ignore ?>Tournois</a>
          <a href="<?php echo $h( '/acces/' ); ?>"><?php echo self::icon( 'pin' ); // phpcs:ignore ?>Accès &amp; horaires</a>
          <a href="<?php echo $h( '/#contact' ); ?>"><?php echo self::icon( 'phone' ); // phpcs:ignore ?>Contact</a>
        </div>
        <div class="mm-bt">
          <a href="<?php echo esc_url( LA_Anniv_Settings::tel_href() ); ?>"><?php echo self::icon( 'phone' ); // phpcs:ignore ?>Appeler</a>
          <a class="wa" href="https://wa.me/<?php echo esc_attr( $s['whatsapp'] ); ?>" target="_blank" rel="noopener">WhatsApp</a>
        </div>
        <a class="mm-cta" href="<?php echo esc_url( self::tunnel_url() ); ?>">Réserver une fête <span aria-hidden="true">→</span></a>
      </div>
    </nav>
    <button class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span></button>
  </div>
</header>
		<?php
		return apply_filters( 'la_anniv_header_html', ob_get_clean() );
	}

	public static function footer_html() {
		$img = self::images();
		$h   = function ( $p ) {
			return esc_url( home_url( $p ) );
		};
		$s   = LA_Anniv_Settings::get();
		ob_start();
		?>
<footer>
  <div class="wrap">
    <div><a class="logo" href="<?php echo $h( '/' ); ?>"><?php if ( $img['logo'] ) : ?><img class="mark" src="<?php echo esc_url( $img['logo'] ); ?>" alt="" width="46" height="46"><?php endif; ?>Les Acacias</a><p style="margin-top:14px">Tennis · Padel · Foot à 5<br><?php echo esc_html( $s['adresse'] ); ?></p></div>
    <div><p><a href="<?php echo $h( '/padel-tarif-coachs/' ); ?>">Padel</a> · <a href="<?php echo $h( '/tarifs-tennis/' ); ?>">Tennis</a> · <a href="<?php echo $h( '/calcetto/' ); ?>">Foot à 5</a> · <a href="<?php echo esc_url( self::landing_url() ); ?>">Anniversaires</a> · <a href="<?php echo $h( '/actualites/' ); ?>">Actualités</a> · <a href="<?php echo $h( '/acces/' ); ?>">Accès</a></p><p style="margin-top:10px"><a href="<?php echo $h( '/ecole-de-tennis-et-padel/' ); ?>">École</a> · <a href="<?php echo $h( '/tournois/' ); ?>">Tournois</a> · <a href="<?php echo $h( '/#contact' ); ?>">Contact</a></p><p style="margin-top:14px"><a href="<?php echo $h( '/politique-de-confidentialite/' ); ?>">Politique de confidentialité</a> · © <?php echo esc_html( gmdate( 'Y' ) ); ?> Tennis Club Les Acacias</p></div>
  </div>
</footer>
		<?php
		return apply_filters( 'la_anniv_footer_html', ob_get_clean() );
	}
}
