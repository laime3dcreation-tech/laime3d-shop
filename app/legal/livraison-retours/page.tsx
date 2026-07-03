export const dynamic = "force-dynamic";

export default function LivraisonRetoursPage() {
  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← Retour à l’accueil</a>

      <section style={styles.card}>
        <h1 style={styles.title}>Livraison & retours</h1>

        <h2 style={styles.heading}>Préparation des commandes</h2>
        <p style={styles.text}>
          Les commandes LAIME3D sont préparées avec soin. Le délai de préparation est
          généralement de <b>24 à 72 heures</b>, selon le modèle, les couleurs choisies et
          le volume de commandes en cours.
        </p>

        <h2 style={styles.heading}>Modes de livraison</h2>
        <p style={styles.text}>
          Les commandes peuvent être expédiées via Mondial Relay ou livraison à domicile
          selon les options proposées lors de la commande.
        </p>

        <h2 style={styles.heading}>Suivi</h2>
        <p style={styles.text}>
          Dès l’expédition, le client reçoit un email avec le numéro de suivi de sa commande.
        </p>

        <h2 style={styles.heading}>Retours</h2>
        <p style={styles.text}>
          Pour toute demande de retour, contactez LAIME3D à :
          <a href="mailto:laime3dcontact@yahoo.com" style={styles.link}> laime3dcontact@yahoo.com</a>.
        </p>

        <h2 style={styles.heading}>Produits personnalisés</h2>
        <p style={styles.text}>
          Les produits personnalisés ou fabriqués selon une demande spécifique du client
          peuvent ne pas être repris, sauf défaut ou erreur de préparation.
        </p>

        <h2 style={styles.heading}>Produit abîmé ou erreur</h2>
        <p style={styles.text}>
          En cas de produit reçu abîmé ou d’erreur dans la commande, contactez LAIME3D
          avec des photos du colis et du produit afin de trouver une solution adaptée.
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
