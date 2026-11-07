<?php
/**
 * Plugin Name:       Les Acacias – Anniversaires enfants
 * Description:       Pages « Anniversaires » et tunnel de réservation (formule, univers, date, invités, options, coordonnées) aux couleurs du site Les Acacias. Gestion des demandes dans l'administration.
 * Version:           1.3.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Tennis Club Les Acacias
 * Text Domain:       la-anniv
 * License:           GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LA_ANNIV_VERSION', '1.3.0' );
define( 'LA_ANNIV_FILE', __FILE__ );
define( 'LA_ANNIV_DIR', plugin_dir_path( __FILE__ ) );
define( 'LA_ANNIV_URL', plugin_dir_url( __FILE__ ) );

require_once LA_ANNIV_DIR . 'includes/class-settings.php';
require_once LA_ANNIV_DIR . 'includes/class-playtomic.php';
require_once LA_ANNIV_DIR . 'includes/class-bookings.php';
require_once LA_ANNIV_DIR . 'includes/class-rest.php';
require_once LA_ANNIV_DIR . 'includes/class-front.php';
require_once LA_ANNIV_DIR . 'includes/class-admin.php';

LA_Anniv_Settings::init();
LA_Anniv_Bookings::init();
LA_Anniv_Rest::init();
LA_Anniv_Front::init();
LA_Anniv_Admin::init();

register_activation_hook( __FILE__, array( 'LA_Anniv_Front', 'activate' ) );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
