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

  const files = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const filePath = `${fileName}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(filePath);

    imageUrls.push(data.publicUrl);
  }

  await supabaseAdmin.from("products").insert({
    name,
    category,
    price,
    description,
    colors,
    images: imageUrls,
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
        <textarea name="description" style={styles.textarea} />

        <label>Couleurs disponibles</label>
        <input
          name="colors"
          placeholder="Noir, Blanc, Rouge"
          style={styles.input}
        />

        <label>Images du produit</label>
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          style={styles.input}
        />

        <button style={styles.button}>Ajouter le produit</button>
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