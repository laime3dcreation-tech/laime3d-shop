import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";

const categories = [
  { value: "flexible", label: "Figurines flexibles" },
  { value: "lamps", label: "Lampes" },
  { value: "vases", label: "Vases" },
  { value: "keychains", label: "Porte-clés" },
];

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "");
  const price = Number(formData.get("price") || 0);
  const description = String(formData.get("description") || "");
  const stock = Number(formData.get("stock") || 0);
  const unlimitedStock = formData.get("unlimited_stock") === "on";

  const colors = String(formData.get("colors") || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const files = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(fileName);

    imageUrls.push(data.publicUrl);
  }

  const { error } = await supabaseAdmin.from("products").insert({
    name,
    category,
    price,
    description,
    colors,
    images: imageUrls,
    active: true,
    featured: false,
    stock,
    unlimited_stock: unlimitedStock,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/products");
}

export default function NewProductPage() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>➕ Ajouter un produit</h1>

      <a href="/admin/products" style={styles.link}>
        ← Retour aux produits
      </a>

      <form action={createProduct} encType="multipart/form-data" style={styles.form}>
        <label>Nom</label>
        <input name="name" style={styles.input} required />

        <label>Catégorie</label>
        <select name="category" style={styles.input} required>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <label>Prix (€)</label>
        <input name="price" type="number" step="0.01" style={styles.input} required />

        <label>Description</label>
        <textarea name="description" style={styles.textarea} />

        <label>Couleurs disponibles</label>
        <input name="colors" placeholder="Noir, Blanc, Rouge" style={styles.input} />

        <label>Stock disponible</label>
        <input name="stock" type="number" min="0" defaultValue="10" style={styles.input} />

        <label style={styles.checkboxLabel}>
          <input name="unlimited_stock" type="checkbox" />
          Stock illimité / fabrication à la demande
        </label>

        <label>Images du produit</label>
        <input
          name="images"
          type="file"
          accept="image/png,image/jpeg,image/webp"
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
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "6px",
    color: "#c8facc",
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