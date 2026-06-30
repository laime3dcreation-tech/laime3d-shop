export default function AdminDashboard() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Administration Laime3D</h1>

      <div style={styles.grid}>
        <a href="/admin/orders" style={styles.card}>
          <h2>📦 Commandes</h2>
          <p>Voir et gérer les commandes clients</p>
        </a>

        <a href="/admin/products" style={styles.card}>
          <h2>🛍️ Produits</h2>
          <p>Modifier les produits, les prix et les descriptions</p>
        </a>

        <a href="/admin/products/new" style={styles.card}>
          <h2>➕ Ajouter un produit</h2>
          <p>Créer un nouveau produit dans la boutique</p>
        </a>

        <a href="/shop" style={styles.card}>
          <h2>🌿 Voir la boutique</h2>
          <p>Ouvrir la boutique côté client</p>
        </a>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#0b1f14",
    color: "#e8f5e9",
    fontFamily: "Arial",
  },

  title: {
    color: "#7CFF9B",
    fontSize: "38px",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "16px",
    padding: "24px",
    color: "#e8f5e9",
    textDecoration: "none",
  },
};