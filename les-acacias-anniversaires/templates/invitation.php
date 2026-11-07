<?php
/**
 * Invitation numérique à partager (lien reçu par la famille après sa demande).
 *
 * @var array|null $resa
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$s  = LA_Anniv_Settings::get();
$ic = array( 'LA_Anniv_Front', 'icon' );

if ( ! $resa || 'annulee' === $resa['statut'] ) : ?>
<div class="tn-top"><div class="wrap">
  <p class="eyebrow">Invitation</p>
  <h1 class="tn-h1">Invitation introuvable</h1>
  <p class="lead" style="margin-top:14px">Ce lien n’est plus valable. Vérifiez le lien reçu par e-mail ou appelez le club au <a href="<?php echo esc_url( LA_Anniv_Settings::tel_href() ); ?>"><?php echo esc_html( $s['tel'] ); ?></a>.</p>
</div></div>
	<?php
	return;
endif;

$U      = LA_Anniv_Settings::univers();
$uni    = isset( $U[ $resa['univers'] ] ) ? $U[ $resa['univers'] ] : reset( $U );
$prenom = $resa['prenom_enfant'];
$date   = ucfirst( LA_Anniv_Bookings::date_fr( $resa['date'] ) );
$heure  = LA_Anniv_Settings::h( $resa['heure'] ) . ' – ' . LA_Anniv_Settings::h( $resa['fin'] );
$maps   = 'https://www.google.com/maps/dir/?api=1&destination=' . rawurlencode( 'Tennis Club Les Acacias, ' . $s['adresse'] );
$url    = LA_Anniv_Bookings::invitation_url( $resa );
$texte  = sprintf( '🎉 %s fête ses %d ans aux Acacias ! %s, %s. Toutes les infos :', $prenom, $resa['age'], $date, $heure );
?>
<div class="inv-page">
  <div class="wrap">
    <p class="crumbs inv-noprint"><a href="<?php echo esc_url( LA_Anniv_Front::landing_url() ); ?>">Anniversaires</a> › Invitation</p>

    <article class="inv-card" id="invCard">
      <div class="inv-deco" aria-hidden="true"><?php echo $ic( 'ball' ) . $ic( 'star' ) . $ic( 'trophy' ) . $ic( 'star' ); // phpcs:ignore ?></div>
      <p class="inv-pre">Tu es invité·e à l’anniversaire de</p>
      <h1 class="inv-name"><?php echo esc_html( $prenom ); ?></h1>
      <p class="inv-age"><span><?php echo (int) $resa['age']; ?></span> ans</p>
      <p class="inv-uni"><?php echo $ic( 'foot' === $uni['id'] ? 'ball' : 'trophy' ); // phpcs:ignore ?><?php echo esc_html( $uni['nom'] ); ?></p>
      <p class="inv-lead"><?php echo esc_html( $uni['accroche'] ); ?> Puis goûter et bougies&nbsp;!</p>

      <dl class="inv-info">
        <div><dt><?php echo $ic( 'calendar' ); // phpcs:ignore ?>Quand</dt><dd><?php echo esc_html( $date ); ?><br><b><?php echo esc_html( $heure ); ?></b></dd></div>
        <div><dt><?php echo $ic( 'pin' ); // phpcs:ignore ?>Où</dt><dd>Les Acacias<br><?php echo esc_html( $s['adresse'] ); ?></dd></div>
        <div><dt><?php echo $ic( 'shirt' ); // phpcs:ignore ?>À prévoir</dt><dd>Tenue de sport, baskets et une gourde</dd></div>
      </dl>
      <p class="inv-rsvp">Merci de confirmer ta présence aux parents de <?php echo esc_html( $prenom ); ?>.</p>
      <p class="inv-club"><?php $logo = LA_Anniv_Front::images()['logo']; if ( $logo ) : ?><img src="<?php echo esc_url( $logo ); ?>" alt="" width="28" height="28"><?php endif; ?>Tennis · Padel · Foot à 5 — Les Acacias</p>
    </article>

    <div class="inv-actions inv-noprint" data-share-url="<?php echo esc_attr( $url ); ?>" data-share-text="<?php echo esc_attr( $texte ); ?>">
      <button type="button" class="btn btn-pri" data-inv="share"><?php echo $ic( 'share' ); // phpcs:ignore ?>Partager l’invitation</button>
      <a class="btn btn-line" href="https://wa.me/?text=<?php echo rawurlencode( $texte . ' ' . $url ); ?>" target="_blank" rel="noopener">WhatsApp</a>
      <button type="button" class="btn btn-line" data-inv="copy">Copier le lien</button>
      <button type="button" class="btn btn-line" data-inv="print"><?php echo $ic( 'print' ); // phpcs:ignore ?>Imprimer</button>
      <a class="btn btn-line" href="<?php echo esc_url( $maps ); ?>" target="_blank" rel="noopener">Itinéraire</a>
    </div>
    <p class="inv-note inv-noprint" role="status" id="invMsg"></p>
  </div>
</div>
