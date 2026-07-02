import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function updateOrderStatus(orderId: string, status: string) {
  "use server";

  await supabaseAdmin.from("orders").update({ status }).eq("id", orderId);

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

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
      return "🟢 Nouveau";
  }
}

function getDeliveryLabel(order: any) {
  if (order.delivery_method === "home") return "Livraison à domicile";
  if (order.delivery_method === "mondial_relay") return "Mondial Relay";
  return "Non renseigné";
}

function getItemColor(item: any) {
  if (item.color) return item.color;
  if (item.selectedColor) return item.selectedColor;

  const name = item.name || "";
  if (name.includes("Couleur :")) {
    return name.split("Couleur :")[1]?.trim();
  }

  return "";
}

function getItemName(item: any) {
  const name = item.name || "";
  if (name.includes(" - Couleur :")) {
    return name.split(" - Couleur :")[0];
  }

  return name;
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

  const totalOrders = orders?.length || 0;
  const newOrders = orders?.filter((o: any) => o.status === "new").length || 0;
  const processingOrders =
    orders?.filter((o: any) => o.status === "processing").length || 0;
  const shippedOrders =
    orders?.filter((o: any) => o.status === "shipped").length || 0;

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>📦 Commandes Laime3D</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span>Total</span>
          <strong>{totalOrders}</strong>
        </div>

        <div style={styles.statCard}>
          <span>Nouvelles</span>
          <strong>{newOrders}</strong>
        </div>

        <div style={styles.statCard}>
          <span>En préparation</span>
          <strong>{processingOrders}</strong>
        </div>

        <div style={styles.statCard}>
          <span>Expédiées</span>
          <strong>{shippedOrders}</strong>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <p>Aucune commande.</p>
      ) : (
        <div style={styles.list}>
          {orders.map((order: any) => (
            <div key={order.id} style={styles.card}>
              <div style={styles.header}>
                <h2>Commande #{order.id}</h2>
                <span style={styles.badge}>{getStatus(order.status)}</span>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <h3>👤 Client</h3>
                  <p>
                    <b>Nom :</b>{" "}
                    {order.customer_name ||
                      `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
                      "Non renseigné"}
                  </p>
                  <p>
                    <b>Email :</b> {order.email || "Non renseigné"}
                  </p>
                  <p>
                    <b>Téléphone :</b> {order.phone || "Non renseigné"}
                  </p>
                </div>

                <div style={styles.infoBox}>
                  <h3>🚚 Livraison</h3>
                  <p>
                    <b>Méthode :</b> {getDeliveryLabel(order)}
                  </p>

                  {order.delivery_method === "mondial_relay" ? (
                    <>
                      <p>
                        <b>Point Relais :</b>{" "}
                        {order.relay_name || "Non renseigné"}
                      </p>
                      <p>
                        <b>Adresse :</b>{" "}
                        {[order.relay_address, order.relay_postal_code, order.relay_city]
                          .filter(Boolean)
                          .join(", ") || "Non renseignée"}
                      </p>
                      <p>
                        <b>ID Point Relais :</b>{" "}
                        {order.relay_id || "Non renseigné"}
                      </p>
                    </>
                  ) : (
                    <p>
                      <b>Adresse :</b>{" "}
                      {[
                        order.shipping_address || order.address,
                        order.address_extra,
                        order.postal_code,
                        order.city,
                        order.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Non renseignée"}
                    </p>
                  )}
                </div>

                <div style={styles.infoBox}>
                  <h3>💶 Paiement</h3>
                  <p>
                    <b>Sous-total :</b>{" "}
                    {Number(order.products_total || 0).toFixed(2)}€
                  </p>
                  <p>
                    <b>Livraison :</b>{" "}
                    {Number(order.delivery_price || 0) === 0
                      ? "Offerte"
                      : `${Number(order.delivery_price || 0).toFixed(2)}€`}
                  </p>
                  <p>
                    <b>Total :</b>{" "}
                    {Number(order.final_total || order.total || 0).toFixed(2)}€
                  </p>
                </div>

                <div style={styles.infoBox}>
                  <h3>🕒 Infos</h3>
                  <p>
                    <b>Date :</b>{" "}
                    {new Date(order.created_at).toLocaleString("fr-FR")}
                  </p>
                  <p>
                    <b>Tracking :</b>{" "}
                    {order.tracking_number || "Pas encore ajouté"}
                  </p>
                </div>
              </div>

              <h3>🛒 Articles</h3>

              <ul style={styles.itemsList}>
                {order.items?.map((item: any, index: number) => {
                  const color = getItemColor(item);

                  return (
                    <li key={index} style={styles.item}>
                      <b>{getItemName(item)}</b> × {item.quantity} —{" "}
                      {Number(item.amount_total || 0).toFixed(2)}€

                      {color && <div style={styles.color}>Couleur : {color}</div>}
                    </li>
                  );
                })}
              </ul>

              <div style={styles.actions}>
                <form action={updateOrderStatus.bind(null, order.id, "new")}>
                  <button type="submit" style={styles.button}>
                    🟢 Nouveau
                  </button>
                </form>

                <form action={updateOrderStatus.bind(null, order.id, "processing")}>
                  <button type="submit" style={styles.button}>
                    🟡 En préparation
                  </button>
                </form>

                <form action={updateOrderStatus.bind(null, order.id, "shipped")}>
                  <button type="submit" style={styles.button}>
                    📦 Expédié
                  </button>
                </form>

                <form action={updateOrderStatus.bind(null, order.id, "completed")}>
                  <button type="submit" style={styles.button}>
                    ✅ Terminé
                  </button>
                </form>
              </div>
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

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },

  statCard: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "16px",
    display: "grid",
    gap: "8px",
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
    gap: "12px",
    flexWrap: "wrap",
  },

  badge: {
    background: "#1f4d33",
    color: "#7CFF9B",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "bold",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
    marginBottom: "22px",
  },

  infoBox: {
    background: "#0b1f14",
    border: "1px solid #1f4d33",
    borderRadius: "12px",
    padding: "14px",
  },

  itemsList: {
    paddingLeft: "20px",
  },

  item: {
    marginBottom: "10px",
  },

  color: {
    color: "#7CFF9B",
    fontSize: "14px",
    marginTop: "4px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  button: {
    padding: "10px 12px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};