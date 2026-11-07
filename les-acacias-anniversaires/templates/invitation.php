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

    <section class="ip inv-noprint" id="invPrint" aria-labelledby="ipTitle">
      <div class="ip-prev"><canvas id="ipCanvas" width="620" height="874" aria-label="Aperçu de l’invitation à imprimer"></canvas></div>
      <div class="ip-form">
        <p class="eyebrow">À imprimer</p>
        <h2 id="ipTitle" class="ip-h">Les cartons d’invitation de <?php echo esc_html( $prenom ); ?></h2>
        <p class="ip-lead">Un PDF prêt à imprimer, au nom de <?php echo esc_html( $prenom ); ?>, avec le jour et l’heure de la fête. Ajoutez les prénoms des copains pour que chaque carton soit nominatif.</p>
        <label class="tn-f"><span>Prénoms des invités <em>(un par ligne, facultatif)</em></span><textarea id="ipNames" rows="4" placeholder="Lucas&#10;Emma&#10;Noah"></textarea></label>
        <div class="ip-row">
          <label class="tn-f"><span>Réponse au <em>(facultatif)</em></span><input type="tel" id="ipTel" placeholder="06 00 00 00 00" autocomplete="tel"></label>
          <label class="tn-f"><span>Avant le <em>(facultatif)</em></span><input type="text" id="ipAvant" placeholder="Ex. 20 novembre"></label>
        </div>
        <div class="ip-row">
          <label class="tn-f"><span>Format</span><select id="ipFormat">
            <option value="4">4 cartons par page A4 (à découper)</option>
            <option value="2">2 cartons par page A4 (format A5)</option>
            <option value="1">1 carton par page A4</option>
          </select></label>
          <label class="tn-f"><span>Nombre de cartons</span><input type="number" id="ipCount" min="1" max="40" value="<?php echo (int) max( 1, $resa['enfants'] - 1 ); ?>"></label>
        </div>
        <div class="ip-btns">
          <button type="button" class="btn btn-pri" id="ipPdf"><?php echo $ic( 'print' ); // phpcs:ignore ?>Télécharger le PDF</button>
          <button type="button" class="btn btn-line" id="ipImg">Télécharger l’image</button>
        </div>
        <p class="ip-note" id="ipMsg" role="status">Ces informations servent uniquement à fabriquer le PDF : elles ne sont pas enregistrées.</p>
      </div>
    </section>
  </div>
</div>
<?php
$inv_data = array(
	'prenom'  => $prenom,
	'age'     => (int) $resa['age'],
	'date'    => $date,
	'heure'   => $heure,
	'univers' => $uni['nom'],
	'uniId'   => $uni['id'],
	'accroche'=> $uni['accroche'],
	'adresse' => $s['adresse'],
	'photo'   => LA_Anniv_Front::images()['hero'] ? LA_Anniv_Front::images()['hero'] : $uni['img'],
	'logo'    => LA_Anniv_Front::images()['logo'],
	'fichier' => sanitize_file_name( 'invitation-' . remove_accents( $prenom ) ),
);
?>
<script>window.LA_INV=<?php echo wp_json_encode( $inv_data ); ?>;</script>
