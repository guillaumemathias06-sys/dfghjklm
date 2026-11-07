<?php
/**
 * Gabarit complet des pages Anniversaires (en-tête et pied de page du site Les Acacias).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#2A5BE6">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip" href="#top">Aller au contenu</a>
<?php echo LA_Anniv_Front::header_html(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
<main id="top" class="pg la-anniv">
<?php
while ( have_posts() ) {
	the_post();
	the_content();
}
?>
</main>
<?php echo LA_Anniv_Front::footer_html(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
<?php if ( 'landing' === LA_Anniv_Front::current() ) : ?>
<div class="sticky-cta" id="scta">
  <a class="btn btn-pri" href="<?php echo esc_url( LA_Anniv_Front::tunnel_url() ); ?>">Réserver la fête</a>
</div>
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>
