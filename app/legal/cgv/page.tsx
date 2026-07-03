export const dynamic = "force-dynamic";

export default function CGVPage() {
  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← Retour à l’accueil</a>

      <section style={styles.card}>
        <h1 style={styles.title}>Conditions générales de vente</h1>

        <p style={styles.text}>
          Les présentes conditions générales de vente s’appliquent aux commandes passées
          sur le site <b>https://www.laime3d.com</b>.
        </p>

        <h2 style={styles.heading}>1. Produits</h2>
        <p style={styles.text}>
          LAIME3D propose des créations imprimées en 3D. Les produits sont présentés avec
          leurs descriptions, couleurs disponibles et prix. Les créations étant fabriquées
          avec soin, de légères variations peuvent exister selon l’impression, la couleur
          ou la finition.
        </p>

        <h2 style={styles.heading}>2. Prix</h2>
        <p style={styles.text}>
          Les prix sont indiqués en euros. Les frais de livraison sont indiqués avant la
          validation définitive de la commande.
        </p>

        <h2 style={styles.heading}>3. Commande</h2>
        <p style={styles.text}>
          Le client vérifie le contenu de son panier, renseigne ses informations de livraison,
          puis valide sa commande via le paiement sécurisé Stripe.
        </p>

        <h2 style={styles.heading}>4. Paiement</h2>
        <p style={styles.text}>
          Le paiement est exigible immédiatement à la commande. Les paiements sont traités
          par Stripe. LAIME3D ne conserve aucune donnée bancaire.
        </p>

        <h2 style={styles.heading}>5. Fabrication et expédition</h2>
        <p style={styles.text}>
          Les commandes sont généralement préparées sous <b>24 à 72 heures</b>. Ce délai peut
          être prolongé selon la complexité du modèle, les couleurs choisies ou le volume
          de commandes en cours.
        </p>

        <h2 style={styles.heading}>6. Livraison</h2>
        <p style={styles.text}>
          Les livraisons sont proposées via Mondial Relay et/ou livraison à domicile selon
          les options disponibles au moment de la commande. Un numéro de suivi est envoyé
          au client lorsque la commande est expédiée.
        </p>

        <h2 style={styles.heading}>7. Droit de rétractation</h2>
        <p style={styles.text}>
          Conformément à la réglementation applicable aux ventes à distance, le consommateur
          dispose en principe d’un délai de <b>14 jours</b> pour exercer son droit de rétractation.
        </p>
        <p style={styles.text}>
          Attention : les produits personnalisés ou réalisés selon les spécifications du client
          peuvent ne pas bénéficier du droit de rétractation.
        </p>

        <h2 style={styles.heading}>8. Retours et remboursements</h2>
        <p style={styles.text}>
          Pour toute demande de retour, le client doit contacter LAIME3D à l’adresse :
          <a href="mailto:laime3dcontact@yahoo.com" style={styles.link}> laime3dcontact@yahoo.com</a>.
          Les produits doivent être retournés en bon état, complets et correctement protégés.
        </p>

        <h2 style={styles.heading}>9. Service client</h2>
        <p style={styles.text}>
          Pour toute question, le client peut contacter LAIME3D par email :
          <a href="mailto:laime3dcontact@yahoo.com" style={styles.link}> laime3dcontact@yahoo.com</a>.
        </p>
      </section>
    </main>
  );
}

const styles: any = {
  page: { minHeight: "100vh", background: "#0b1f14", color: "#e8f5e9", padding: "40px", fontFamily: "Arial" },
  back: { color: "#7CFF9B", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "25px" },
  card: { maxWidth: "900px", margin: "0 auto", background: "#10251a", border: "1px solid #1f4d33", borderRadius: "20px", padding: "32px" },
  title: { color: "#7CFF9B", fontSize: "38px", marginBottom: "24px" },
  heading: { color: "#7CFF9B", marginTop: "28px" },
  text: { color: "#c8facc", lineHeight: "1.8", fontSize: "16px" },
  link: { color: "#7CFF9B", fontWeight: "bold" },
};
