import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function OrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={styles.page}>
        <h1 style={styles.title}>Erreur</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>📦 Commandes</h1>

      {!orders || orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {orders.map((order: any) => (
            <div key={order.id} style={styles.card}>
              <h2>Commande</h2>
              <p><b>Nom:</b> {order.customer_name}</p>
              <p><b>Email:</b> {order.email}</p>
              <p><b>Adresse:</b> {order.address}</p>
              <p><b>Total:</b> {order.total}€</p>
              <p><b>Date:</b> {new Date(order.created_at).toLocaleString("fr-FR")}</p>

              <h3>Articles</h3>
              <pre style={styles.items}>
                {JSON.stringify(order.items, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
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
    fontSize: "36px",
    marginBottom: "20px",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  card: {
    background: "#0f2418",
    border: "1px solid #1f4d33",
    borderRadius: "12px",
    padding: "18px",
  },
  items: {
    background: "#07140d",
    padding: "12px",
    borderRadius: "8px",
    overflowX: "auto",
    color: "#c8facc",
  },
};