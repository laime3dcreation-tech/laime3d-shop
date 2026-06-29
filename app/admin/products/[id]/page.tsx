import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const category = String(formData.get("category"));
  const price = Number(formData.get("price"));
  const description = String(formData.get("description"));

  const colors = String(formData.get("colors"))
    .split(",")
    .map((color) => color.trim())
    .filter(Boolean);

  await supabaseAdmin
    .from("products")
    .update({
      name,
      category,
      price,
      description,
      colors,
    })
    .eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  redirect("/admin/products");
}

export default async function EditProductPage({
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
      <h1 style={styles.title}>Modifier le produit</h1>

      <a href="/admin/products" style={styles.link}>
        ← Retour aux produits
      </a>

      <form action={updateProduct} style={styles.form}>
        <input type="hidden" name="id" value={product.id} />

        <label>Nom</label>
        <input name="name" defaultValue={product.name} style={styles.input} />

        <label>Catégorie</label>
        <input
          name="category"
          defaultValue={product.category}
          style={styles.input}
        />

        <label>Prix (€)</label>
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          style={styles.input}
        />

        <label>Description</label>
        <textarea
          name="description"
          defaultValue={product.description || ""}
          style={styles.textarea}
        />

        <label>Couleurs disponibles</label>
        <input
          name="colors"
          defaultValue={(product.colors || []).join(", ")}
          placeholder="Noir, Blanc, Rouge, Bleu..."
          style={styles.input}
        />

        <button style={styles.button}>Enregistrer</button>
      </form>
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
  form: {
    maxWidth: "520px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
  },
  textarea: {
    padding: "12px",
    minHeight: "120px",
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
    resize: "vertical",
  },
  button: {
    marginTop: "15px",
    padding: "12px",
    background: "#7CFF9B",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};