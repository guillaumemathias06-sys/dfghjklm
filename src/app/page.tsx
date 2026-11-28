import Script from "next/script";

export const dynamic = "force-dynamic";

/** Coquille de l'application : le routage par fragment (#synthese, #fiche-…) est géré par /app.js. */
export default function Home() {
  return (
    <>
      <a className="skip" href="#contenu" id="skip">Aller au contenu</a>
      <header className="top">
        <div className="top-inner">
          <a className="brand" href="#synthese">LES ACACIAS <small>Tableau de bord</small></a>
          <div id="save-status" role="status" aria-live="polite" data-state="wait">
            <span className="dot" aria-hidden="true"></span>
            <span id="save-text">Chargement…</span>
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="linkish">Se déconnecter</button>
          </form>
        </div>
        <nav className="main" aria-label="Navigation principale">
          <a href="#synthese" data-r="synthese">Synthèse</a>
          <a href="#btoc" data-r="btoc">BtoC</a>
          <a href="#btob" data-r="btob">BtoB</a>
          <a href="#produits" data-r="produits">Produits</a>
          <a href="#exploitation" data-r="exploitation">Exploitation</a>
          <a href="#indicateurs" data-r="indicateurs">Indicateurs</a>
          <a href="#decisions" data-r="decisions">Décisions</a>
          <a href="#reglages" data-r="reglages">Réglages</a>
        </nav>
      </header>
      <main id="contenu" tabIndex={-1}></main>
      <footer>
        <p>
          Les mesures Terrains viennent de Playtomic (réservations synchronisées chaque nuit et à la demande). Les autres fiches restent « À relier » tant que leur
          source n’est pas branchée : aucune valeur n’est inventée ni remplacée par zéro.
        </p>
      </footer>
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
