import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const categories = [
  { value: "flexible", label: "Figurines flexibles" },
  { value: "lamps", label: "Lampes" },
  { value: "vases", label: "Vases" },
  { value: "keychains", label: "Porte-clés" },
];

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

  const existingImages = String(formData.get("existingImages") || "[]");
  let images: string[] = JSON.parse(existingImages);

  const removeImages = formData.getAll("removeImages").map(String);
  images = images.filter((img) => !removeImages.includes(img));

  const files = formData.getAll("newImages") as File[];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(fileName);

    images.push(data.publicUrl);
  }

  await supabaseAdmin
    .from("products")
    .update({
      name,
      category,
      price,
      description,
      colors,
      images,
    })
    .eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

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

        <input
          type="hidden"
          name="existingImages"
          value={JSON.stringify(product.images || [])}
        />

        <label>Nom</label>
        <input name="name" defaultValue={product.name} style={styles.input} />

        <label>Catégorie</label>
        <select
          name="category"
          defaultValue={product.category}
          style={styles.input}
          required
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

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

        <h3>Images actuelles</h3>

        <div style={styles.imagesGrid}>
          {(product.images || []).map((img: string) => (
            <label key={img} style={styles.imageBox}>
              <img src={img} alt={product.name} style={styles.image} />
              <span>
                <input type="checkbox" name="removeImages" value={img} />{" "}
                Supprimer
              </span>
            </label>
          ))}
        </div>

        <label>Ajouter de nouvelles images</label>
        <input
          name="newImages"
          type="file"
          accept="image/*"
          multiple
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
    maxWidth: "700px",
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
  imagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
  },
  imageBox: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "10px",
    padding: "10px",
    display: "grid",
    gap: "8px",
  },
  image: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
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