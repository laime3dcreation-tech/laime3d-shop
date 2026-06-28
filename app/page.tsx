export default function Home() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Laime3D</h1>

        <p style={styles.subtitle}>
          Créations 3D éco-responsables en France 🌿
        </p>

        <a href="/shop" style={styles.button}>
          Voir la boutique
        </a>
      </header>

      <section style={styles.section}>
        <div style={styles.card}>🏺 Vases</div>
        <div style={styles.card}>🌿 Figurines</div>
        <div style={styles.card}>🌱 Lampes</div>
        <div style={styles.card}>🍃 Porte-clés</div>
      </section>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020b07, #041a10)",
    color: "#eafff0",
    fontFamily: "Arial",
  },

  header: {
    textAlign: "center",
    padding: "70px 20px 40px",
  },

  title: {
    fontSize: "64px",
    margin: 0,
    color: "#39ff88",
    textShadow: "0 0 20px rgba(57,255,136,0.4)",
  },

  subtitle: {
    marginTop: "10px",
    color: "#a7f3c0",
  },

  button: {
    display: "inline-block",
    marginTop: "25px",
    padding: "14px 26px",
    borderRadius: "12px",
    background: "#39ff88",
    color: "#02130a",
    fontWeight: "bold",
    textDecoration: "none",
    boxShadow: "0 0 20px rgba(57,255,136,0.3)",
  },

  section: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(10, 40, 25, 0.9)",
    border: "1px solid #1aff77",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 0 15px rgba(0,255,120,0.15)",
  },
};