import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));

  await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  redirect("/admin/products");
}

export default async function DeleteProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return (
      <main style={styles.page}>
        <h1>Produit introuvable</h1>
        <a href="/admin/products" style={styles.link}>
          ← Retour aux produits
        </a>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Supprimer le produit ?</h1>

        <p style={styles.text}>
          Voulez-vous vraiment supprimer définitivement ce produit ?
        </p>

        <h2 style={styles.productName}>{product.name}</h2>

        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            style={styles.image}
          />
        )}

        <div style={styles.actions}>
          <a href="/admin/products" style={styles.cancelButton}>
            Annuler
          </a>

          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />

            <button style={styles.deleteButton}>
              Oui, supprimer définitivement
            </button>
          </form>
        </div>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    maxWidth: "560px",
    width: "100%",
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "30px",
    textAlign: "center",
  },

  title: {
    color: "#ff8a8a",
    fontSize: "34px",
    marginBottom: "15px",
  },

  text: {
    color: "#e8f5e9",
    fontSize: "18px",
    lineHeight: "1.5",
  },

  productName: {
    color: "#7CFF9B",
    marginTop: "20px",
  },

  image: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    marginTop: "15px",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  cancelButton: {
    display: "inline-block",
    padding: "12px 18px",
    background: "#1f4d33",
    color: "#e8f5e9",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  deleteButton: {
    padding: "12px 18px",
    background: "#ff4d4d",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  link: {
    color: "#7CFF9B",
  },
};