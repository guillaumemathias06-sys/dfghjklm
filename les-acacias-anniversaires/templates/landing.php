<?php
/**
 * Page de présentation des anniversaires.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$s   = LA_Anniv_Settings::get();
$F   = LA_Anniv_Settings::formules();
$U   = LA_Anniv_Settings::univers();
$O   = LA_Anniv_Settings::options();
$img = LA_Anniv_Front::images();
$ic  = array( 'LA_Anniv_Front', 'icon' );
$max = (int) $s['enfants_max'];
$dur = LA_Anniv_Settings::duree_txt();
$e   = function ( $n ) {
	return esc_html( LA_Anniv_Settings::euros( $n ) );
};
$per = function ( $prix ) use ( $max ) {
	return LA_Anniv_Settings::euros( round( $prix / max( 1, $max ), 2 ) );
};
$photo = function ( $url, $alt, $class = '', $pos = '50% 50%' ) {
	if ( ! $url ) {
		return '<div class="ph ' . esc_attr( $class ) . '">' . esc_html( $alt ) . '</div>';
	}
	return '<figure class="photo ' . esc_attr( $class ) . '"><img src="' . esc_url( $url ) . '" alt="' . esc_attr( $alt ) . '" loading="lazy" style="object-position:' . esc_attr( $pos ) . '"></figure>';
};
$tel_href = LA_Anniv_Settings::tel_href();
?>
<div class="pg-hero an-hero">
  <div class="pg-hero-in">
    <nav class="crumbs" aria-label="Fil d'Ariane"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Accueil</a> › Anniversaires</nav>
    <p class="eyebrow" data-r>Anniversaires enfants · <?php echo (int) $s['age_min']; ?>–<?php echo (int) $s['age_max']; ?> ans · La Gaude</p>
    <h1 data-r style="--d:.06s">Un anniversaire <em>foot ou défis</em> aux Acacias</h1>
    <p class="lead" data-r style="--d:.12s"><?php echo esc_html( $dur ); ?> de fête sur nos terrains, un animateur rien que pour le groupe et un vrai moment de star pour votre enfant. Vous arrivez, on s’occupe du reste.</p>
    <div class="an-chips" data-r style="--d:.16s">
      <span><?php echo $ic( 'clock' ); // phpcs:ignore ?><?php echo esc_html( $dur ); ?> de fête</span>
      <span><?php echo $ic( 'kids' ); // phpcs:ignore ?>Jusqu’à <?php echo (int) $max; ?> enfants</span>
      <span><?php echo $ic( 'whistle' ); // phpcs:ignore ?>Animateur dédié</span>
    </div>
    <div class="hero-cta" data-r style="--d:.2s">
      <a class="btn btn-on" href="<?php echo esc_url( LA_Anniv_Front::tunnel_url() ); ?>">Réserver la fête <?php echo $ic( 'arrow' ); // phpcs:ignore ?></a>
      <a class="btn btn-ghost-on" href="#formules">Voir les formules</a>
    </div>
  </div>
  <?php echo $photo( $img['hero'], 'Enfants en plein jeu sur le terrain de foot à 5 des Acacias', 'pg-photo', '50% 62%' ); // phpcs:ignore ?>
</div>

<div class="pg-facts">
  <div class="pg-fact" data-r><b class="fn"><?php echo esc_html( $dur ); ?></b><span>de fête, goûter compris</span></div>
  <div class="pg-fact" data-r style="--d:.07s"><b class="fn"><?php echo (int) $max; ?></b><span>enfants maximum, enfant fêté inclus</span></div>
  <div class="pg-fact" data-r style="--d:.14s"><b class="fn">2</b><span>univers : Foot party ou Jeux &amp; défis</span></div>
</div>

<!-- Univers -->
<section class="pg-sec" id="univers">
  <div class="wrap">
    <p class="eyebrow" data-r>Deux univers au choix</p>
    <h2 class="h2" data-r style="--d:.06s;margin-top:14px">Foot ou défis&nbsp;: à lui de choisir</h2>
    <p class="lead" data-r style="--d:.1s;margin-top:16px">Notre terrain de foot à 5 devient une arène de jeux. Des activités où tout le monde participe, sans élimination ni longue attente.</p>
    <div class="an-unis">
      <?php $i = 0; foreach ( $U as $u ) : ?>
      <article class="an-uni" data-r style="--d:<?php echo esc_attr( $i * 0.08 ); ?>s">
        <?php echo $photo( $u['img'], $u['nom'], 'an-uni-ph' ); // phpcs:ignore ?>
        <div class="an-uni-b">
          <p class="an-tag"><?php echo $ic( 'foot' === $u['id'] ? 'ball' : 'trophy' ); // phpcs:ignore ?><?php echo 'foot' === $u['id'] ? 'Univers foot' : 'Univers multi-jeux'; ?></p>
          <h3><?php echo esc_html( $u['nom'] ); ?></h3>
          <p class="an-uni-l"><?php echo esc_html( $u['accroche'] ); ?></p>
          <ul class="an-list">
            <?php foreach ( $u['points'] as $pt ) : ?>
              <li><?php echo $ic( 'check' ); // phpcs:ignore ?><?php echo esc_html( $pt ); ?></li>
            <?php endforeach; ?>
          </ul>
          <p class="an-for"><?php echo esc_html( $u['pour'] ); ?></p>
          <a class="btn btn-line" href="<?php echo esc_url( LA_Anniv_Front::tunnel_url( array( 'univers' => $u['id'] ) ) ); ?>">Choisir <?php echo esc_html( $u['nom'] ); ?></a>
        </div>
      </article>
      <?php $i++; endforeach; ?>
    </div>
  </div>
</section>

<!-- Formules -->
<section class="pg-sec pg-alt" id="formules">
  <div class="wrap">
    <p class="eyebrow" data-r>Formules</p>
    <h2 class="h2" data-r style="--d:.06s;margin-top:14px">Un prix pour tout le groupe</h2>
    <p class="lead" data-r style="--d:.1s;margin-top:16px">Pas de calcul par enfant&nbsp;: le forfait couvre jusqu’à <?php echo (int) $max; ?> enfants, enfant fêté inclus.</p>
    <div class="an-plans">
      <?php foreach ( $F as $f ) : $hi = 'complet' === $f['id']; ?>
      <article class="an-plan<?php echo $hi ? ' hi' : ''; ?>" data-r style="--d:<?php echo $hi ? '0' : '.08'; ?>s">
        <?php if ( $f['badge'] ) : ?><span class="an-badge"><?php echo $ic( 'star' ); // phpcs:ignore ?><?php echo esc_html( $f['badge'] ); ?></span><?php endif; ?>
        <small><?php echo esc_html( $f['nom'] ); ?></small>
        <b class="an-price"><?php echo esc_html( number_format( $f['prix'], 0, ',', ' ' ) ); ?><i>€</i></b>
        <span class="an-per">le groupe · soit <?php echo esc_html( $per( $f['prix'] ) ); ?> par enfant pour <?php echo (int) $max; ?></span>
        <p class="an-plan-l"><?php echo esc_html( $f['accroche'] ); ?></p>
        <ul class="an-list">
          <?php foreach ( $f['inclus'] as $pt ) : ?>
            <li><?php echo $ic( 'check' ); // phpcs:ignore ?><?php echo esc_html( $pt ); ?></li>
          <?php endforeach; ?>
          <?php if ( ! empty( $f['apporte'] ) ) : ?>
            <li class="no"><span aria-hidden="true">–</span><?php echo esc_html( $f['apporte'] ); ?></li>
          <?php endif; ?>
        </ul>
        <a class="btn <?php echo $hi ? 'btn-on' : 'btn-pri'; ?>" href="<?php echo esc_url( LA_Anniv_Front::tunnel_url( array( 'formule' => $f['id'] ) ) ); ?>">Réserver · <?php echo esc_html( $f['nom'] ); ?></a>
      </article>
      <?php endforeach; ?>
    </div>

    <div class="an-compare" data-r>
      <table>
        <caption>Ce qui est inclus</caption>
        <thead><tr><th scope="col"></th><th scope="col">Essentiel<br><span><?php echo $e( $F['essentiel']['prix'] ); // phpcs:ignore ?></span></th><th scope="col" class="hi">Tout compris<br><span><?php echo $e( $F['complet']['prix'] ); // phpcs:ignore ?></span></th></tr></thead>
        <tbody>
          <?php
          $rows = array(
            array( 'Terrain réservé et matériel', 1, 1 ),
            array( 'Animateur dédié au groupe', 1, 1 ),
            array( 'Programme Foot party ou Jeux & défis', 1, 1 ),
            array( 'Eau pendant les activités', 1, 1 ),
            array( 'Espace goûter et vaisselle', 1, 1 ),
            array( 'Invitation numérique à partager', 1, 1 ),
            array( 'Souvenir pour l’enfant fêté', 1, 1 ),
            array( 'Mise en place et rangement', 1, 1 ),
            array( 'Gâteau, bougies, boissons et bonbons', 'Apportés par vous', 1 ),
          );
          foreach ( $rows as $r ) :
            ?>
            <tr><th scope="row"><?php echo esc_html( $r[0] ); ?></th>
              <?php foreach ( array( 1, 2 ) as $k ) : ?>
                <td<?php echo 2 === $k ? ' class="hi"' : ''; ?>><?php echo 1 === $r[ $k ] ? '<span class="ok" aria-label="Inclus">' . $ic( 'check' ) . '</span>' : '<span class="txt">' . esc_html( $r[ $k ] ) . '</span>'; // phpcs:ignore ?></td>
              <?php endforeach; ?>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- Déroulé -->
<section class="pg-sec" id="deroule">
  <div class="wrap pg-split an-split">
    <div>
      <p class="eyebrow" data-r>Le déroulé</p>
      <h2 class="h2" data-r style="--d:.06s;margin:14px 0 26px"><?php echo 120 === (int) $s['duree'] ? 'Deux heures' : esc_html( $dur ); ?> bien rythmées</h2>
      <ol class="an-time">
        <li data-r><span class="t">0 – 10 min</span><div><b>Accueil et équipes</b><span>Les prénoms, les règles du jeu et la composition des équipes.</span></div></li>
        <li data-r style="--d:.06s"><span class="t">10 – <?php echo (int) $s['duree'] - 45; ?> min</span><div><b>Jeux et défis</b><span>Ateliers et matchs avec l’animateur, pauses hydratation comprises.</span></div></li>
        <li data-r style="--d:.12s"><span class="t"><?php echo (int) $s['duree'] - 45; ?> – <?php echo (int) $s['duree'] - 30; ?> min</span><div><b>Grande finale</b><span>Le grand moment, lancé par l’enfant fêté, puis la célébration.</span></div></li>
        <li data-r style="--d:.18s"><span class="t"><?php echo (int) $s['duree'] - 30; ?> – <?php echo (int) $s['duree']; ?> min</span><div><b>Goûter et bougies</b><span>À l’espace goûter, puis départ des invités avec leurs parents.</span></div></li>
      </ol>
    </div>
    <div class="an-star" data-r style="--d:.1s">
      <?php echo $photo( $img['souvenir'], 'Médailles et souvenirs remis aux enfants', 'an-star-ph', '50% 50%' ); // phpcs:ignore ?>
      <div class="an-star-b">
        <p class="eyebrow">Son moment de star</p>
        <h3>L’enfant fêté est le capitaine du jour</h3>
        <ul class="an-list">
          <li><?php echo $ic( 'star' ); // phpcs:ignore ?>Il choisit le nom des équipes</li>
          <li><?php echo $ic( 'star' ); // phpcs:ignore ?>Il porte le brassard de capitaine</li>
          <li><?php echo $ic( 'star' ); // phpcs:ignore ?>Il donne le coup d’envoi de la finale</li>
          <li><?php echo $ic( 'star' ); // phpcs:ignore ?>Il repart avec un souvenir de sa fête</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Options -->
<section class="pg-sec pg-alt" id="options">
  <div class="wrap">
    <p class="eyebrow" data-r>Pour aller plus loin</p>
    <h2 class="h2" data-r style="--d:.06s;margin-top:14px">Les petits plus</h2>
    <p class="lead" data-r style="--d:.1s;margin-top:16px">À ajouter au moment de la réservation, sur n’importe quelle formule.</p>
    <div class="an-opts">
      <?php
      $oic = array( 'pizza' => 'pizza', 'ballon' => 'ball', 'sachet' => 'gift', 'extra' => 'plus30' );
      $i   = 0;
      foreach ( $O as $o ) :
        ?>
        <div class="an-opt" data-r style="--d:<?php echo esc_attr( $i * 0.06 ); ?>s">
          <span class="an-opt-i"><?php echo $ic( $oic[ $o['id'] ] ); // phpcs:ignore ?></span>
          <b><?php echo esc_html( $o['nom'] ); ?></b>
          <span class="an-opt-d"><?php echo esc_html( $o['desc'] ); ?></span>
          <span class="an-opt-p">+<?php echo $e( $o['prix'] ); // phpcs:ignore ?><?php echo $o['unite'] ? ' <i>/ ' . esc_html( $o['unite'] ) . '</i>' : ''; ?></span>
        </div>
      <?php $i++; endforeach; ?>
    </div>
  </div>
</section>

<!-- Infos pratiques -->
<section class="pg-sec" id="infos">
  <div class="wrap pg-split an-split">
    <div>
      <p class="eyebrow" data-r>Infos pratiques</p>
      <h2 class="h2" data-r style="--d:.06s;margin:14px 0 18px">Une organisation qui rassure</h2>
      <div class="pg-feats an-feats">
        <div class="pg-feat" data-r><span class="ck"><?php echo $ic( 'sun' ); // phpcs:ignore ?></span><div><b>Et s’il pleut&nbsp;?</b><span><?php echo esc_html( $s['texte_meteo'] ); ?></span></div></div>
        <div class="pg-feat" data-r style="--d:.06s"><span class="ck"><?php echo $ic( 'shield' ); // phpcs:ignore ?></span><div><b>Allergies</b><span>Signalez-les à la réservation&nbsp;: nous adaptons le goûter Tout compris ou vous prévenons des produits servis.</span></div></div>
        <div class="pg-feat" data-r style="--d:.12s"><span class="ck"><?php echo $ic( 'kids' ); // phpcs:ignore ?></span><div><b>Un parent sur place</b><span>Le parent organisateur reste au club pendant la fête. Les invités sont confiés et récupérés à l’accueil, à l’heure.</span></div></div>
        <div class="pg-feat" data-r style="--d:.18s"><span class="ck"><?php echo $ic( 'calendar' ); // phpcs:ignore ?></span><div><b>Quand&nbsp;?</b><span><?php echo esc_html( ucfirst( LA_Anniv_Settings::jours_txt() ) ); ?>, sur des créneaux fixes. Réservez au moins <?php echo (int) $s['delai_min']; ?> jours à l’avance.</span></div></div>
      </div>
    </div>
    <div class="duo" data-r style="--d:.1s">
      <?php echo $photo( $img['gouter'], 'Terrasse du clubhouse pour le goûter', '', '40% 50%' ); // phpcs:ignore ?>
      <?php echo $photo( $img['buffet'], 'Buffet et animation au clubhouse', '', '50% 70%' ); // phpcs:ignore ?>
    </div>
  </div>
</section>

<!-- Réserver -->
<section class="pg-sec an-how-sec">
  <div class="wrap">
    <div class="an-how bluebg on-blue" data-r>
      <div>
        <p class="eyebrow">Réserver en 3 minutes</p>
        <h2 class="h2" style="margin-top:14px">Choisissez, réservez, c’est la fête</h2>
        <ol class="an-steps">
          <li><b>1</b>Formule et univers</li>
          <li><b>2</b>Date et créneau disponibles</li>
          <li><b>3</b>Invités et options</li>
          <li><b>4</b>Acompte de <?php echo $e( $s['acompte'] ); // phpcs:ignore ?> et c’est confirmé</li>
        </ol>
      </div>
      <div class="an-how-cta">
        <a class="btn btn-on" href="<?php echo esc_url( LA_Anniv_Front::tunnel_url() ); ?>">Voir les disponibilités <?php echo $ic( 'arrow' ); // phpcs:ignore ?></a>
        <a class="btn btn-ghost-on" href="<?php echo esc_url( $tel_href ); ?>"><?php echo $ic( 'phone' ); // phpcs:ignore ?>Une question&nbsp;? <?php echo esc_html( $s['tel'] ); ?></a>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="pg-sec pg-faq" id="faq">
  <div class="wrap pg-faq-grid">
    <div data-r><p class="eyebrow">Questions fréquentes</p><h2 class="h2" style="margin-top:14px;font-size:clamp(32px,5vw,56px)">Vos questions, nos réponses</h2></div>
    <div data-r style="--d:.08s">
      <details open><summary>À partir de quel âge&nbsp;?</summary><p>Nos anniversaires sont pensés pour les <?php echo (int) $s['age_min']; ?>–<?php echo (int) $s['age_max']; ?> ans, avec des jeux adaptés aux plus jeunes (6–8 ans) et aux plus grands (9–12 ans).</p></details>
      <details><summary>Combien d’enfants peuvent venir&nbsp;?</summary><p>Le forfait comprend jusqu’à <?php echo (int) $max; ?> enfants, enfant fêté inclus. Pour un groupe plus grand, appelez-nous&nbsp;: nous étudions une organisation avec un deuxième animateur.</p></details>
      <details><summary>Faut-il savoir jouer au foot&nbsp;?</summary><p>Non. La Foot party s’adapte à tous les niveaux, et l’univers Jeux &amp; défis ne demande aucune pratique du foot&nbsp;: relais, parcours, adresse et coopération.</p></details>
      <details><summary>Que se passe-t-il en cas de pluie&nbsp;?</summary><p><?php echo esc_html( $s['texte_meteo'] ); ?></p></details>
      <details><summary>Comment se passe le paiement&nbsp;?</summary><p>Un acompte de <?php echo $e( $s['acompte'] ); // phpcs:ignore ?> confirme la réservation. Le solde se règle sur place, le jour de la fête.</p></details>
      <details><summary>Puis-je apporter mon propre gâteau&nbsp;?</summary><p>Oui, c’est le principe de la formule Essentiel à <?php echo $e( $F['essentiel']['prix'] ); // phpcs:ignore ?>&nbsp;: nous fournissons l’espace goûter et la vaisselle, vous apportez gâteau, bougies, boissons et bonbons.</p></details>
    </div>
  </div>
</section>
