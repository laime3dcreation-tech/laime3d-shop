export const dynamic = "force-dynamic";

export default function MentionsLegalesPage() {
  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← Retour à l’accueil</a>

      <section style={styles.card}>
        <h1 style={styles.title}>Mentions légales</h1>

        <h2 style={styles.heading}>Éditeur du site</h2>
        <p style={styles.text}>
          Le site <b>LAIME3D</b>, accessible à l’adresse <b>https://www.laime3d.com</b>,
          est édité par <b>Droga Kristina</b>.
        </p>
        <p style={styles.text}>Adresse : 9 route de Samatan, 32200 Gimont, France.</p>
        <p style={styles.text}>
          Email : <a href="mailto:laime3dcontact@yahoo.com" style={styles.link}>laime3dcontact@yahoo.com</a>
        </p>

        <h2 style={styles.heading}>Activité</h2>
        <p style={styles.text}>
          LAIME3D propose la vente en ligne de créations imprimées en 3D :
          objets décoratifs, lampes, vases, porte-clés, figurines flexibles et créations personnalisées.
        </p>

        <h2 style={styles.heading}>Hébergement</h2>
        <p style={styles.text}>
          Le site est hébergé par <b>Vercel Inc.</b>, 440 N Barranca Ave #4133,
          Covina, CA 91723, États-Unis.
        </p>

        <h2 style={styles.heading}>Paiement</h2>
        <p style={styles.text}>
          Les paiements sont sécurisés et traités par <b>Stripe</b>. LAIME3D ne conserve
          aucune donnée bancaire des clients.
        </p>

        <h2 style={styles.heading}>Propriété intellectuelle</h2>
        <p style={styles.text}>
          Les textes, images, visuels, créations, logos et éléments graphiques présents
          sur le site sont protégés. Toute reproduction ou utilisation sans autorisation
          préalable est interdite.
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
