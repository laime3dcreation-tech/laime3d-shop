import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";

async function updateProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const category = String(formData.get("category"));
  const price = Number(formData.get("price"));

  await supabaseAdmin
    .from("products")
    .update({ name, category, price })
    .eq("id", id);

  redirect("/admin/products");
}

export default async function EditProductPage({ params }: any) {
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return <main style={styles.page}>Produit introuvable</main>;
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Modifier le produit</h1>

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
    marginBottom: "25px",
  },
  form: {
    maxWidth: "420px",
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