import { supabaseAdmin } from "@/lib/supabaseAdmin";

function getStatus(status: string) {
  switch (status) {
    case "new":
      return "🟢 Nouveau";
    case "processing":
      return "🟡 En préparation";
    case "shipped":
      return "📦 Expédié";
    case "completed":
      return "✅ Terminé";
    default:
      return status;
  }
}

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
      <h1 style={styles.title}>📦 Commandes Laime3D</h1>

      {!orders || orders.length === 0 ? (
        <p>Aucune commande.</p>
      ) : (
        <div style={styles.list}>
          {orders.map((order: any) => (
            <div key={order.id} style={styles.card}>
              <div style={styles.header}>
                <h2>Commande #{order.id}</h2>
                <span style={styles.badge}>
                  {getStatus(order.status)}
                </span>
              </div>

              <p><b>👤 Client:</b> {order.customer_name}</p>
              <p><b>📧 Email:</b> {order.email}</p>
              <p><b>📍 Adresse:</b> {order.address}</p>
              <p><b>💶 Total:</b> {order.total}€</p>
              <p>
                <b>🕒 Date:</b>{" "}
                {new Date(order.created_at).toLocaleString("fr-FR")}
              </p>

              <h3>🛒 Articles</h3>

              <ul>
                {order.items?.map((item: any, index: number) => (
                  <li key={index}>
                    {item.name} × {item.quantity} — {item.amount_total}€
                  </li>
                ))}
              </ul>
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
    marginBottom: "30px",
  },

  list: {
    display: "grid",
    gap: "20px",
  },

  card: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  badge: {
    background: "#1f4d33",
    color: "#7CFF9B",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "bold",
  },
};