import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name"));
  const category = String(formData.get("category"));
  const price = Number(formData.get("price"));
  const description = String(formData.get("description"));

  const colors = String(formData.get("colors"))
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const images = String(formData.get("images"))
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  await supabaseAdmin.from("products").insert({
    name,
    category,
    price,
    description,
    colors,
    images,
    active: true,
  });

  redirect("/admin/products");
}

export default function NewProductPage() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>➕ Ajouter un produit</h1>

      <a href="/admin/products" style={styles.link}>
        ← Retour aux produits
      </a>

      <form action={createProduct} style={styles.form}>
        <label>Nom</label>
        <input name="name" style={styles.input} required />

        <label>Catégorie</label>
        <input
          name="category"
          placeholder="cats, dogs, reptiles..."
          style={styles.input}
          required
        />

        <label>Prix (€)</label>
        <input
          name="price"
          type="number"
          step="0.01"
          style={styles.input}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          style={styles.textarea}
        />

        <label>Couleurs disponibles</label>
        <input
          name="colors"
          placeholder="Noir, Blanc, Rouge"
          style={styles.input}
        />

        <label>Images</label>
        <textarea
          name="images"
          placeholder="/images/chat1.jpg, /images/chat2.jpg"
          style={styles.textarea}
        />

        <button style={styles.button}>
          Ajouter le produit
        </button>
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
    maxWidth: "600px",
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
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
    minHeight: "110px",
    resize: "vertical",
  },

  button: {
    marginTop: "20px",
    padding: "14px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};