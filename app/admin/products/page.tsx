import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

async function toggleProduct(productId: string, active: boolean) {
  "use server";

  await supabaseAdmin
    .from("products")
    .update({ active })
    .eq("id", productId);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export default async function AdminProductsPage() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main style={styles.page}>
        <h1>Erreur</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>🛍️ Produits Laime3D</h1>

      <a href="/admin/orders" style={styles.link}>
        ← Retour aux commandes
      </a>

      <div style={styles.list}>
        {products?.map((product: any) => (
          <div key={product.id} style={styles.card}>
            <h2>{product.name}</h2>
            <p><b>Catégorie :</b> {product.category}</p>
            <p><b>Prix :</b> {product.price}€</p>
            <p><b>Actif :</b> {product.active ? "Oui" : "Non"}</p>

            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                style={styles.image}
              />
            )}

            <div style={styles.actions}>
              <a href={`/admin/products/${product.id}`} style={styles.editButton}>
                Modifier
              </a>

              {product.active ? (
                <form action={toggleProduct.bind(null, product.id, false)}>
                  <button style={styles.dangerButton}>Masquer</button>
                </form>
              ) : (
                <form action={toggleProduct.bind(null, product.id, true)}>
                  <button style={styles.button}>Afficher</button>
                </form>
              )}
            </div>
          </div>
        ))}
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
    fontSize: "36px",
    marginBottom: "20px",
  },
  link: {
    color: "#7CFF9B",
    display: "inline-block",
    marginBottom: "25px",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  card: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "18px",
  },
  image: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px",
    marginTop: "10px",
  },
  actions: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  editButton: {
    display: "inline-block",
    padding: "10px 14px",
    background: "#7CFF9B",
    color: "#03140a",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  button: {
    padding: "10px 14px",
    background: "#7CFF9B",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  dangerButton: {
    padding: "10px 14px",
    background: "#ff8a8a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};