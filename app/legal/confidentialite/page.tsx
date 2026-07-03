export const dynamic = "force-dynamic";

export default function ConfidentialitePage() {
  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← Retour à l’accueil</a>

      <section style={styles.card}>
        <h1 style={styles.title}>Politique de confidentialité</h1>

        <p style={styles.text}>
          LAIME3D accorde une grande importance à la protection des données personnelles
          de ses clients et visiteurs.
        </p>

        <h2 style={styles.heading}>Données collectées</h2>
        <p style={styles.text}>
          Lors d’une commande ou d’un contact, LAIME3D peut collecter : nom, prénom,
          adresse email, téléphone, adresse de livraison, contenu de la commande et
          informations nécessaires à la livraison.
        </p>

        <h2 style={styles.heading}>Utilisation des données</h2>
        <p style={styles.text}>
          Les données sont utilisées pour traiter les commandes, organiser la livraison,
          envoyer les confirmations, reçus, informations de suivi et répondre aux demandes
          des clients.
        </p>

        <h2 style={styles.heading}>Paiement</h2>
        <p style={styles.text}>
          Les paiements sont traités par Stripe. LAIME3D ne stocke pas les informations
          bancaires des clients.
        </p>

        <h2 style={styles.heading}>Conservation</h2>
        <p style={styles.text}>
          Les données liées aux commandes sont conservées pendant la durée nécessaire à la
          gestion commerciale, comptable et légale.
        </p>

        <h2 style={styles.heading}>Partage des données</h2>
        <p style={styles.text}>
          Les données peuvent être transmises uniquement aux prestataires nécessaires :
          paiement, hébergement, email et livraison.
        </p>

        <h2 style={styles.heading}>Droits des utilisateurs</h2>
        <p style={styles.text}>
          Conformément au RGPD, vous pouvez demander l’accès, la rectification ou la suppression
          de vos données en écrivant à :
          <a href="mailto:laime3dcontact@yahoo.com" style={styles.link}> laime3dcontact@yahoo.com</a>.
        </p>

        <h2 style={styles.heading}>Cookies</h2>
        <p style={styles.text}>
          Le site peut utiliser des cookies nécessaires à son fonctionnement. Si des outils
          de mesure d’audience ou de publicité sont ajoutés ultérieurement, une information
          claire et un choix seront proposés aux visiteurs.
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
