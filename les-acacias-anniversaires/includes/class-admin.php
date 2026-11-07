<?php
/**
 * Administration : liste des réservations, fiche, statuts, réglages.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LA_Anniv_Admin {

	public static function init() {
		if ( ! is_admin() ) {
			return;
		}
		$cpt = LA_Anniv_Bookings::CPT;
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_filter( "manage_{$cpt}_posts_columns", array( __CLASS__, 'columns' ) );
		add_action( "manage_{$cpt}_posts_custom_column", array( __CLASS__, 'column' ), 10, 2 );
		add_filter( "manage_edit-{$cpt}_sortable_columns", array( __CLASS__, 'sortable' ) );
		add_action( 'pre_get_posts', array( __CLASS__, 'order' ) );
		add_action( 'restrict_manage_posts', array( __CLASS__, 'filters' ) );
		add_action( 'add_meta_boxes', array( __CLASS__, 'boxes' ) );
		add_action( "save_post_{$cpt}", array( __CLASS__, 'save' ), 10, 2 );
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'admin_notices', array( __CLASS__, 'notices' ) );
		add_action( 'admin_head', array( __CLASS__, 'css' ) );
		add_action( 'wp_dashboard_setup', array( __CLASS__, 'dashboard' ) );
		add_filter( 'plugin_action_links_' . plugin_basename( LA_ANNIV_FILE ), array( __CLASS__, 'plugin_links' ) );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=' . LA_Anniv_Bookings::CPT,
			'Réglages des anniversaires',
			'Réglages',
			'manage_options',
			'la-anniv-reglages',
			array( 'LA_Anniv_Settings', 'render_page' )
		);
	}

	public static function plugin_links( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'edit.php?post_type=' . LA_Anniv_Bookings::CPT . '&page=la-anniv-reglages' ) ) . '">Réglages</a>' );
		return $links;
	}

	public static function notices() {
		$screen = get_current_screen();
		if ( ! $screen || ( LA_Anniv_Bookings::CPT !== $screen->post_type && 'plugins' !== $screen->id ) ) {
			return;
		}
		if ( ! LA_Anniv_Front::club_has( 'assets/site.css' ) ) {
			echo '<div class="notice notice-warning"><p><strong>Anniversaires :</strong> le plugin « les-acacias-site » est introuvable. Les pages anniversaires utilisent ses polices, ses photos et ses styles : installez-le ou activez-le pour retrouver le design du site.</p></div>';
		}
		if ( LA_Anniv_Playtomic::enabled() && ! LA_Anniv_Playtomic::courts_known() ) {
			echo '<div class="notice notice-warning"><p><strong>Anniversaires :</strong> Playtomic est activé mais aucun terrain n’est encore connu. Ouvrez Anniversaires › Réglages et cliquez sur « Tester la connexion Playtomic ».</p></div>';
		}
		if ( isset( $_GET['la_mail'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			echo '<div class="notice notice-success is-dismissible"><p>E-mail de confirmation envoyé à la famille.</p></div>';
		}
	}

	/* ------------------------------------------------------------------
	 * Liste
	 * ---------------------------------------------------------------- */

	public static function columns( $cols ) {
		return array(
			'cb'         => $cols['cb'],
			'title'      => 'Fête',
			'la_date'    => 'Date',
			'la_formule' => 'Formule',
			'la_enfants' => 'Enfants',
			'la_total'   => 'Total',
			'la_parent'  => 'Parent',
			'la_statut'  => 'Statut',
		);
	}

	public static function column( $col, $id ) {
		$d = get_post_meta( $id, '_la_data', true );
		if ( ! is_array( $d ) ) {
			return;
		}
		$F = LA_Anniv_Settings::formules();
		$U = LA_Anniv_Settings::univers();
		switch ( $col ) {
			case 'la_date':
				echo '<strong>' . esc_html( ucfirst( LA_Anniv_Bookings::date_fr( $d['date'] ) ) ) . '</strong><br>' . esc_html( LA_Anniv_Settings::h( $d['heure'] ) . ' – ' . LA_Anniv_Settings::h( $d['fin'] ) );
				echo self::playtomic_badge( $id, $d ); // phpcs:ignore WordPress.Security.EscapeOutput
				break;
			case 'la_formule':
				echo esc_html( isset( $F[ $d['formule'] ] ) ? $F[ $d['formule'] ]['nom'] : $d['formule'] ) . '<br><span class="description">' . esc_html( isset( $U[ $d['univers'] ] ) ? $U[ $d['univers'] ]['nom'] : '' ) . '</span>';
				$o = array_filter( $d['options'] );
				if ( $o ) {
					$labels = array( 'pizza' => 'pizzas', 'ballon' => 'ballon', 'sachet' => 'sachets', 'extra' => '+30 min' );
					$txt    = array();
					foreach ( $o as $k => $v ) {
						$txt[] = ( 'pizza' === $k ? (int) $v . ' ' : '' ) . $labels[ $k ];
					}
					echo '<br><span class="description">+ ' . esc_html( implode( ', ', $txt ) ) . '</span>';
				}
				break;
			case 'la_enfants':
				echo (int) $d['enfants'] . '<br><span class="description">' . (int) $d['age'] . ' ans</span>';
				break;
			case 'la_total':
				echo '<strong>' . esc_html( LA_Anniv_Settings::euros( $d['prix']['total'] ) ) . '</strong>';
				if ( $d['prix']['acompte'] > 0 ) {
					echo '<br><span class="description">acompte ' . esc_html( LA_Anniv_Settings::euros( $d['prix']['acompte'] ) ) . '</span>';
				}
				break;
			case 'la_parent':
				$c = $d['contact'];
				echo esc_html( $c['nom'] ) . '<br><a href="' . esc_url( 'tel:' . preg_replace( '/[^\d+]/', '', $c['tel'] ) ) . '">' . esc_html( $c['tel'] ) . '</a>';
				if ( ! empty( $c['infos'] ) ) {
					echo '<br><span class="la-allergie" title="' . esc_attr( $c['infos'] ) . '">⚠ infos / allergies</span>';
				}
				break;
			case 'la_statut':
				$s = get_post_meta( $id, '_la_statut', true );
				echo self::badge( $s, $id ); // phpcs:ignore WordPress.Security.EscapeOutput
				break;
		}
	}

	/**
	 * Terrain attribué et état dans Playtomic : bloqué (une réservation couvre
	 * toute la fête), conflit (chevauchement partiel) ou à bloquer.
	 */
	public static function playtomic_state( $id, $d ) {
		$court = (string) get_post_meta( $id, '_la_terrain', true );
		$out   = array( 'court' => $court, 'name' => $court ? LA_Anniv_Playtomic::court_name( $court ) : '', 'state' => '' );
		if ( ! LA_Anniv_Playtomic::enabled() || $d['date'] < LA_Anniv_Bookings::today() ) {
			return $out;
		}
		if ( in_array( get_post_meta( $id, '_la_statut', true ), array( 'annulee', 'terminee' ), true ) ) {
			return $out;
		}
		if ( ! $court ) {
			$out['state'] = 'aucun';
			return $out;
		}
		$pt = LA_Anniv_Playtomic::for_range( $d['date'], $d['date'] );
		if ( ! is_array( $pt ) ) {
			$out['state'] = 'injoignable';
			return $out;
		}
		$s     = LA_Anniv_Bookings::to_min( $d['heure'] );
		$e     = LA_Anniv_Bookings::to_min( $d['fin'] );
		$state = 'a_bloquer';
		foreach ( isset( $pt[ $d['date'] ][ $court ] ) ? $pt[ $d['date'] ][ $court ] : array() as $r ) {
			if ( $r[0] <= $s && $r[1] >= $e ) {
				$state = 'bloque';
				break;
			}
			if ( $r[0] < $e && $s < $r[1] ) {
				$state = 'conflit';
			}
		}
		$out['state'] = $state;
		return $out;
	}

	private static function playtomic_badge( $id, $d ) {
		$p = self::playtomic_state( $id, $d );
		$h = $p['name'] ? '<br><span class="description">' . esc_html( $p['name'] ) . '</span>' : '';
		$labels = array(
			'bloque'      => array( 'ok', '✓ bloqué dans Playtomic' ),
			'a_bloquer'   => array( 'todo', '⚠ à bloquer dans Playtomic' ),
			'conflit'     => array( 'bad', '⚠ conflit Playtomic' ),
			'aucun'       => array( 'todo', '⚠ terrain à choisir' ),
			'injoignable' => array( 'todo', 'Playtomic injoignable' ),
		);
		if ( isset( $labels[ $p['state'] ] ) ) {
			$h .= '<br><span class="la-pt la-pt-' . $labels[ $p['state'] ][0] . '">' . esc_html( $labels[ $p['state'] ][1] ) . '</span>';
		}
		return $h;
	}

	private static function expired( $id ) {
		$exp = (int) LA_Anniv_Settings::get( 'expiration_h' );
		$c   = (int) get_post_meta( $id, '_la_cree', true );
		return 'attente' === get_post_meta( $id, '_la_statut', true ) && $exp > 0 && $c && time() - $c > $exp * HOUR_IN_SECONDS;
	}

	private static function badge( $s, $id ) {
		$label = isset( LA_Anniv_Bookings::$statuts[ $s ] ) ? LA_Anniv_Bookings::$statuts[ $s ] : $s;
		if ( self::expired( $id ) ) {
			return '<span class="la-st la-st-exp">Acompte non reçu · créneau libéré</span>';
		}
		return '<span class="la-st la-st-' . esc_attr( $s ) . '">' . esc_html( $label ) . '</span>';
	}

	public static function sortable( $cols ) {
		$cols['la_date'] = 'la_date';
		return $cols;
	}

	public static function order( $q ) {
		if ( ! is_admin() || ! $q->is_main_query() || LA_Anniv_Bookings::CPT !== $q->get( 'post_type' ) ) {
			return;
		}
		$orderby = $q->get( 'orderby' );
		if ( ! $orderby || 'la_date' === $orderby ) {
			$q->set( 'meta_key', '_la_date' );
			$q->set( 'orderby', array( 'meta_value' => $q->get( 'order' ) ? $q->get( 'order' ) : 'ASC' ) );
		}
		$st  = isset( $_GET['la_statut'] ) ? sanitize_key( $_GET['la_statut'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		$per = isset( $_GET['la_periode'] ) ? sanitize_key( $_GET['la_periode'] ) : 'avenir'; // phpcs:ignore WordPress.Security.NonceVerification
		$mq  = array();
		if ( $st && isset( LA_Anniv_Bookings::$statuts[ $st ] ) ) {
			$mq[] = array( 'key' => '_la_statut', 'value' => $st );
		}
		if ( 'avenir' === $per ) {
			$mq[] = array( 'key' => '_la_date', 'value' => LA_Anniv_Bookings::today(), 'compare' => '>=' );
		} elseif ( 'passees' === $per ) {
			$mq[] = array( 'key' => '_la_date', 'value' => LA_Anniv_Bookings::today(), 'compare' => '<' );
			$q->set( 'orderby', array( 'meta_value' => 'DESC' ) );
		}
		if ( $mq ) {
			$q->set( 'meta_query', $mq );
		}
	}

	public static function filters( $post_type ) {
		if ( LA_Anniv_Bookings::CPT !== $post_type ) {
			return;
		}
		$st  = isset( $_GET['la_statut'] ) ? sanitize_key( $_GET['la_statut'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		$per = isset( $_GET['la_periode'] ) ? sanitize_key( $_GET['la_periode'] ) : 'avenir'; // phpcs:ignore WordPress.Security.NonceVerification
		echo '<select name="la_periode">';
		foreach ( array( 'avenir' => 'Fêtes à venir', 'passees' => 'Fêtes passées', 'toutes' => 'Toutes les dates' ) as $k => $v ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $k ), selected( $per, $k, false ), esc_html( $v ) );
		}
		echo '</select><select name="la_statut"><option value="">Tous les statuts</option>';
		foreach ( LA_Anniv_Bookings::$statuts as $k => $v ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $k ), selected( $st, $k, false ), esc_html( $v ) );
		}
		echo '</select>';
	}

	public static function row_actions( $actions, $post ) {
		if ( LA_Anniv_Bookings::CPT !== $post->post_type ) {
			return $actions;
		}
		unset( $actions['inline hide-if-no-js'] );
		$d = get_post_meta( $post->ID, '_la_data', true );
		if ( is_array( $d ) && ! empty( $d['jeton'] ) ) {
			$actions['la_inv'] = '<a href="' . esc_url( LA_Anniv_Bookings::invitation_url( $d ) ) . '" target="_blank">Invitation</a>';
		}
		return $actions;
	}

	/* ------------------------------------------------------------------
	 * Fiche
	 * ---------------------------------------------------------------- */

	public static function boxes() {
		add_meta_box( 'la_anniv_detail', 'Détail de la réservation', array( __CLASS__, 'box_detail' ), LA_Anniv_Bookings::CPT, 'normal', 'high' );
		add_meta_box( 'la_anniv_statut', 'Statut', array( __CLASS__, 'box_statut' ), LA_Anniv_Bookings::CPT, 'side', 'high' );
		if ( LA_Anniv_Playtomic::enabled() ) {
			add_meta_box( 'la_anniv_pt', 'Terrain · Playtomic', array( __CLASS__, 'box_playtomic' ), LA_Anniv_Bookings::CPT, 'side', 'default' );
		}
	}

	public static function box_detail( $post ) {
		$d = get_post_meta( $post->ID, '_la_data', true );
		if ( ! is_array( $d ) ) {
			echo '<p>Aucune donnée.</p>';
			return;
		}
		$F = LA_Anniv_Settings::formules();
		$U = LA_Anniv_Settings::univers();
		$c = $d['contact'];
		$rows = array(
			'Référence'          => $d['ref'],
			'Date'               => ucfirst( LA_Anniv_Bookings::date_fr( $d['date'] ) ),
			'Horaire'            => LA_Anniv_Settings::h( $d['heure'] ) . ' – ' . LA_Anniv_Settings::h( $d['fin'] ),
			'Enfant fêté'        => $d['prenom_enfant'] . ', ' . $d['age'] . ' ans',
			'Nombre d’enfants'   => $d['enfants'] . ' (enfant fêté inclus)',
			'Formule'            => isset( $F[ $d['formule'] ] ) ? $F[ $d['formule'] ]['nom'] : $d['formule'],
			'Univers'            => isset( $U[ $d['univers'] ] ) ? $U[ $d['univers'] ]['nom'] : $d['univers'],
			'Parent'             => $c['nom'],
			'Téléphone'          => $c['tel'],
			'E-mail'             => $c['email'],
			'Parent présent'     => $c['parent_present'],
			'Allergies / infos'  => $c['infos'],
			'Nous a connus par'  => $c['source'],
			'Demande envoyée le' => wp_date( 'd/m/Y à H:i', (int) get_post_meta( $post->ID, '_la_cree', true ) ),
		);
		echo '<table class="widefat striped la-detail"><tbody>';
		foreach ( $rows as $k => $v ) {
			if ( '' === (string) $v ) {
				continue;
			}
			if ( 'E-mail' === $k ) {
				$v = '<a href="mailto:' . esc_attr( $v ) . '">' . esc_html( $v ) . '</a>';
			} elseif ( 'Téléphone' === $k ) {
				$v = '<a href="' . esc_url( 'tel:' . preg_replace( '/[^\d+]/', '', $v ) ) . '">' . esc_html( $v ) . '</a>';
			} else {
				$v = nl2br( esc_html( $v ) );
			}
			echo '<tr><th>' . esc_html( $k ) . '</th><td>' . $v . '</td></tr>'; // phpcs:ignore WordPress.Security.EscapeOutput
		}
		echo '</tbody></table><h3>Montant</h3><table class="widefat la-detail"><tbody>';
		foreach ( $d['prix']['lignes'] as $l ) {
			echo '<tr><td>' . esc_html( $l['label'] ) . ( $l['qte'] > 1 ? ' × ' . (int) $l['qte'] : '' ) . '</td><td style="text-align:right">' . esc_html( LA_Anniv_Settings::euros( $l['total'] ) ) . '</td></tr>';
		}
		echo '<tr><th>Total</th><th style="text-align:right">' . esc_html( LA_Anniv_Settings::euros( $d['prix']['total'] ) ) . '</th></tr>';
		if ( $d['prix']['acompte'] > 0 ) {
			echo '<tr><td>Acompte</td><td style="text-align:right">' . esc_html( LA_Anniv_Settings::euros( $d['prix']['acompte'] ) ) . '</td></tr>';
			echo '<tr><td>Solde le jour J</td><td style="text-align:right">' . esc_html( LA_Anniv_Settings::euros( $d['prix']['solde'] ) ) . '</td></tr>';
		}
		echo '</tbody></table>';
		echo '<p><a class="button" href="' . esc_url( LA_Anniv_Bookings::invitation_url( $d ) ) . '" target="_blank">Voir l’invitation de la famille</a></p>';
	}

	public static function box_playtomic( $post ) {
		$d = get_post_meta( $post->ID, '_la_data', true );
		if ( ! is_array( $d ) ) {
			return;
		}
		$p     = self::playtomic_state( $post->ID, $d );
		$known = LA_Anniv_Playtomic::courts_known();
		$texts = array(
			'bloque'      => 'Une réservation Playtomic couvre toute la fête sur ce terrain : c’est bloqué.',
			'a_bloquer'   => 'Aucune réservation sur ce terrain dans Playtomic : pensez à le bloquer dans Playtomic Manager.',
			'conflit'     => 'Une réservation Playtomic chevauche une partie de la fête sur ce terrain : vérifiez le planning.',
			'aucun'       => 'Aucun terrain attribué : choisissez-en un ci-dessous.',
			'injoignable' => 'Playtomic n’a pas répondu. Réessayez plus tard.',
		);
		if ( isset( $texts[ $p['state'] ] ) ) {
			echo '<p>' . esc_html( $texts[ $p['state'] ] ) . '</p>';
		}
		if ( isset( $d['pt_verifie'] ) && false === $d['pt_verifie'] ) {
			echo '<p style="color:#b32d2e">Playtomic n’avait pas pu être consulté au moment de la demande.</p>';
		}
		echo '<p><label for="la_terrain"><strong>Terrain</strong></label><br><select name="la_terrain" id="la_terrain" style="width:100%"><option value="">—</option>';
		foreach ( $known as $id => $name ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $id ), selected( $p['court'], $id, false ), esc_html( $name ) );
		}
		if ( $p['court'] && ! isset( $known[ $p['court'] ] ) ) {
			printf( '<option value="%s" selected>%s</option>', esc_attr( $p['court'] ), esc_html( $p['court'] ) );
		}
		echo '</select></p>';
	}

	public static function box_statut( $post ) {
		wp_nonce_field( 'la_anniv_statut', 'la_anniv_nonce' );
		$s    = get_post_meta( $post->ID, '_la_statut', true );
		$note = get_post_meta( $post->ID, '_la_note', true );
		echo '<p>' . self::badge( $s, $post->ID ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput
		echo '<p><label for="la_statut"><strong>Changer le statut</strong></label><br><select name="la_statut" id="la_statut" style="width:100%">';
		foreach ( LA_Anniv_Bookings::$statuts as $k => $v ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $k ), selected( $s, $k, false ), esc_html( $v ) );
		}
		echo '</select></p>';
		echo '<p><label><input type="checkbox" name="la_mail_confirm" value="1" checked> Envoyer l’e-mail « C’est confirmé » à la famille en passant à « Confirmée »</label></p>';
		echo '<p><label for="la_note"><strong>Note interne</strong></label><textarea name="la_note" id="la_note" rows="4" style="width:100%" placeholder="Acompte reçu par virement le…, animateur : …">' . esc_textarea( $note ) . '</textarea></p>';
	}

	public static function save( $id, $post ) {
		if ( ! isset( $_POST['la_anniv_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['la_anniv_nonce'] ) ), 'la_anniv_statut' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return;
		}
		$old = get_post_meta( $id, '_la_statut', true );
		$new = isset( $_POST['la_statut'] ) ? sanitize_key( $_POST['la_statut'] ) : $old;
		if ( isset( LA_Anniv_Bookings::$statuts[ $new ] ) && $new !== $old ) {
			update_post_meta( $id, '_la_statut', $new );
			if ( 'attente' === $new ) {
				update_post_meta( $id, '_la_cree', time() ); // Relance : le créneau est de nouveau bloqué.
			}
			if ( 'confirmee' === $new && ! empty( $_POST['la_mail_confirm'] ) ) {
				$d = get_post_meta( $id, '_la_data', true );
				if ( is_array( $d ) ) {
					$d['id'] = $id;
					LA_Anniv_Bookings::mail_parent( $d, 'confirmee' );
					add_filter(
						'redirect_post_location',
						function ( $loc ) {
							return add_query_arg( 'la_mail', 1, $loc );
						}
					);
				}
			}
		}
		if ( isset( $_POST['la_terrain'] ) ) {
			update_post_meta( $id, '_la_terrain', sanitize_text_field( wp_unslash( $_POST['la_terrain'] ) ) );
		}
		if ( isset( $_POST['la_note'] ) ) {
			update_post_meta( $id, '_la_note', sanitize_textarea_field( wp_unslash( $_POST['la_note'] ) ) );
		}
	}

	/* ------------------------------------------------------------------
	 * Tableau de bord
	 * ---------------------------------------------------------------- */

	public static function dashboard() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		wp_add_dashboard_widget( 'la_anniv_next', 'Prochains anniversaires', array( __CLASS__, 'widget' ) );
	}

	public static function widget() {
		$q = get_posts(
			array(
				'post_type'      => LA_Anniv_Bookings::CPT,
				'posts_per_page' => 6,
				'meta_key'       => '_la_date',
				'orderby'        => 'meta_value',
				'order'          => 'ASC',
				'meta_query'     => array(
					array( 'key' => '_la_date', 'value' => LA_Anniv_Bookings::today(), 'compare' => '>=' ),
					array( 'key' => '_la_statut', 'value' => array( 'attente', 'confirmee' ), 'compare' => 'IN' ),
				),
			)
		);
		if ( ! $q ) {
			echo '<p>Aucun anniversaire à venir.</p>';
		} else {
			echo '<ul>';
			foreach ( $q as $p ) {
				$d = get_post_meta( $p->ID, '_la_data', true );
				if ( ! is_array( $d ) ) {
					continue;
				}
				printf(
					'<li><a href="%s"><strong>%s</strong></a> · %s %s · %d enfants %s</li>',
					esc_url( get_edit_post_link( $p->ID ) ),
					esc_html( $d['prenom_enfant'] ),
					esc_html( ucfirst( LA_Anniv_Bookings::date_fr( $d['date'] ) ) ),
					esc_html( LA_Anniv_Settings::h( $d['heure'] ) ),
					(int) $d['enfants'],
					self::badge( get_post_meta( $p->ID, '_la_statut', true ), $p->ID ) // phpcs:ignore WordPress.Security.EscapeOutput
				);
			}
			echo '</ul>';
		}
		echo '<p><a href="' . esc_url( admin_url( 'edit.php?post_type=' . LA_Anniv_Bookings::CPT ) ) . '">Toutes les réservations</a></p>';
	}

	public static function css() {
		$screen = get_current_screen();
		if ( ! $screen || ( LA_Anniv_Bookings::CPT !== $screen->post_type && 'dashboard' !== $screen->id ) ) {
			return;
		}
		echo '<style>
.la-st{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:#E6EEFF;color:#1C3FB0}
.la-st-attente{background:#FFF4D6;color:#8A5A00}.la-st-confirmee{background:#DFF7E8;color:#11663A}
.la-st-annulee{background:#FDE2E2;color:#9B1C1C}.la-st-terminee{background:#ECEFF4;color:#4A5B7F}.la-st-exp{background:#FDE2E2;color:#9B1C1C}
.la-allergie{color:#B45309;font-weight:600;cursor:help}
.la-pt{font-size:12px;font-weight:600}.la-pt-ok{color:#11663A}.la-pt-todo{color:#8A5A00}.la-pt-bad{color:#9B1C1C}
.la-detail th{width:180px;font-weight:600}
.column-la_statut{width:180px}.column-la_total{width:110px}.column-la_enfants{width:80px}
#la_anniv_next li{margin-bottom:8px}
</style>';
	}
}
