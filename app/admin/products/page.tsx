export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

function getCategoryLabel(category: string) {
  switch (category) {
    case "flexible":
      return "Figurines flexibles";
    case "lamps":
      return "Lampes";
    case "vases":
      return "Vases";
    case "keychains":
      return "Porte-clés";
    default:
      return category || "Non renseignée";
  }
}

function getStockLabel(product: any) {
  if (product.unlimited_stock) {
    return "♾️ Illimité";
  }

  if (Number(product.stock || 0) > 0) {
    return `📦 ${product.stock}`;
  }

  return "⚠️ Rupture de stock";
}

async function toggleProduct(productId: string, active: boolean) {
  "use server";

  await supabaseAdmin.from("products").update({ active }).eq("id", productId);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

async function toggleFeatured(productId: string, featured: boolean) {
  "use server";

  await supabaseAdmin
    .from("products")
    .update({ featured })
    .eq("id", productId);

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export default async function AdminProductsPage() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
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

  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter((product: any) => product.active).length || 0;
  const outOfStockProducts =
    products?.filter(
      (product: any) =>
        !product.unlimited_stock && Number(product.stock || 0) <= 0
    ).length || 0;
  const featuredProducts =
    products?.filter((product: any) => product.featured).length || 0;

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>🛍️ Produits Laime3D</h1>

      <div style={styles.topBar}>
        <a href="/admin/dashboard" style={styles.link}>
          ← Tableau de bord
        </a>

        <a href="/admin/products/new" style={styles.addButton}>
          ➕ Ajouter un produit
        </a>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Produits</span>
          <strong style={styles.statValue}>{totalProducts}</strong>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Actifs</span>
          <strong style={styles.statValue}>{activeProducts}</strong>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Mis en avant</span>
          <strong style={styles.statValue}>{featuredProducts}</strong>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Rupture</span>
          <strong style={styles.statValue}>{outOfStockProducts}</strong>
        </div>
      </div>

      {!products || products.length === 0 ? (
        <p>Aucun produit pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {products.map((product: any) => {
            const isOutOfStock =
              !product.unlimited_stock && Number(product.stock || 0) <= 0;

            return (
              <div key={product.id} style={styles.card}>
                <div style={styles.productMain}>
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={styles.image}
                    />
                  )}

                  <div>
                    <h2 style={styles.productTitle}>{product.name}</h2>

                    <p>
                      <b>Catégorie :</b> {getCategoryLabel(product.category)}
                    </p>

                    <p>
                      <b>Prix :</b> {Number(product.price || 0).toFixed(2)}€
                    </p>

                    <p>
                      <b>Stock :</b>{" "}
                      <span
                        style={{
                          color: product.unlimited_stock
                            ? "#7CFF9B"
                            : isOutOfStock
                            ? "#ff8a8a"
                            : "#e8f5e9",
                          fontWeight: "bold",
                        }}
                      >
                        {getStockLabel(product)}
                      </span>
                    </p>

                    <p>
                      <b>Actif :</b>{" "}
                      <span
                        style={{
                          color: product.active ? "#7CFF9B" : "#ff8a8a",
                          fontWeight: "bold",
                        }}
                      >
                        {product.active ? "Oui" : "Non"}
                      </span>
                    </p>

                    <p>
                      <b>Mis en avant :</b>{" "}
                      {product.featured ? "⭐ Oui" : "Non"}
                    </p>

                    {product.colors?.length > 0 && (
                      <p>
                        <b>Couleurs :</b> {product.colors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

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

                  {product.featured ? (
                    <form action={toggleFeatured.bind(null, product.id, false)}>
                      <button style={styles.featuredOffButton}>
                        ☆ Retirer de la sélection
                      </button>
                    </form>
                  ) : (
                    <form action={toggleFeatured.bind(null, product.id, true)}>
                      <button style={styles.featuredButton}>
                        ⭐ Mettre en avant
                      </button>
                    </form>
                  )}

                  <a
                    href={`/admin/products/${product.id}/delete`}
                    style={styles.deleteLink}
                  >
                    🗑️ Supprimer
                  </a>
                </div>
              </div>
            );
          })}
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

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },

  link: {
    color: "#7CFF9B",
    textDecoration: "none",
    fontWeight: "bold",
  },

  addButton: {
    display: "inline-block",
    padding: "12px 18px",
    background: "#7CFF9B",
    color: "#03140a",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },

  statCard: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "16px",
    display: "grid",
    gap: "6px",
  },

  statLabel: {
    color: "#b8d9c4",
    fontSize: "14px",
  },

  statValue: {
    color: "#7CFF9B",
    fontSize: "28px",
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

  productMain: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  productTitle: {
    color: "#7CFF9B",
    marginTop: 0,
  },

  image: {
    width: "130px",
    height: "130px",
    objectFit: "cover",
    borderRadius: "12px",
    background: "#0b1f14",
  },

  actions: {
    marginTop: "18px",
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
    color: "#03140a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  dangerButton: {
    padding: "10px 14px",
    background: "#ff8a8a",
    color: "#03140a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  featuredButton: {
    padding: "10px 14px",
    background: "#ffd166",
    color: "#03140a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  featuredOffButton: {
    padding: "10px 14px",
    background: "#d6d6d6",
    color: "#03140a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteLink: {
    display: "inline-block",
    padding: "10px 14px",
    background: "#ff4d4d",
    color: "#ffffff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};