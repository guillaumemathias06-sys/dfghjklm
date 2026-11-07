<?php
/**
 * Tunnel de réservation (rendu par assets/js/tunnel.js).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$s = LA_Anniv_Settings::get();
?>
<div class="tn-top">
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d'Ariane"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Accueil</a> › <a href="<?php echo esc_url( LA_Anniv_Front::landing_url() ); ?>">Anniversaires</a> › Réservation</nav>
    <p class="eyebrow">Réserver un anniversaire</p>
    <h1 class="tn-h1">Organisons sa fête</h1>
    <ol class="tn-steps" id="tnSteps" aria-label="Étapes de la réservation"></ol>
  </div>
</div>

<div class="wrap tn-wrap" id="tnApp" aria-live="polite">
  <div class="tn-main">
    <div class="tn-panel" id="tnPanel">
      <p class="tn-loading">Chargement…</p>
    </div>
    <p class="tn-err" id="tnErr" role="alert" hidden></p>
    <div class="tn-nav" id="tnNav">
      <button type="button" class="tn-back" id="tnBack">‹ Retour</button>
      <button type="button" class="btn btn-pri tn-next" id="tnNext">Continuer</button>
    </div>
  </div>

  <aside class="tn-recap" id="tnRecap" aria-label="Récapitulatif">
    <div class="tn-recap-in" id="tnRecapIn"></div>
  </aside>
</div>

<div class="tn-bar" id="tnBar">
  <button type="button" class="tn-bar-sum" id="tnBarSum" aria-controls="tnRecap" aria-expanded="false"><small>Total</small><b id="tnBarTotal">–</b><span>Voir le détail</span></button>
  <button type="button" class="btn btn-pri" id="tnBarNext">Continuer</button>
</div>

<noscript>
  <div class="wrap"><p class="tn-noscript">Le module de réservation nécessite JavaScript. Vous pouvez aussi réserver par téléphone au <a href="<?php echo esc_url( LA_Anniv_Settings::tel_href() ); ?>"><?php echo esc_html( $s['tel'] ); ?></a>.</p></div>
</noscript>
