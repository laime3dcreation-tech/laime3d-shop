"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

const categories = [
  { value: "all", label: "Tous" },
  { value: "flexible", label: "Figurines flexibles" },
  { value: "lamps", label: "Lampes" },
  { value: "vases", label: "Vases" },
  { value: "keychains", label: "Porte-clés" },
];

export default function ShopPage() {
  return (
    <Suspense fallback={<main style={styles.page}>Chargement...</main>}>
      <Shop />
    </Suspense>
  );
}

function Shop() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (
      categoryFromUrl &&
      categories.some((cat) => cat.value === categoryFromUrl)
    ) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur produits:", error);
        return;
      }

      if (data) setProducts(data);
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, category, search, sort]);

  function addToCart(product: any) {
    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];

    const found = cart.find(
      (item: any) =>
        item.id === product.id && item.selectedColor === product.selectedColor
    );

    const updatedCart = found
      ? cart.map((item: any) =>
          item.id === product.id && item.selectedColor === product.selectedColor
            ? { ...item, qty: Number(item.qty || 0) + 1 }
            : item
        )
      : [...cart, { ...product, qty: 1 }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  }

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <a href="/" style={styles.logo}>
          LAIME3D
        </a>

        <div style={styles.navLinks}>
          <a href="/" style={styles.navLink}>
            Accueil
          </a>
          <a href="/shop" style={styles.navLink}>
            Boutique
          </a>
        </div>
      </nav>

      <section style={styles.hero}>
        <h1 style={styles.title}>Boutique Laime3D</h1>
        <p style={styles.subtitle}>
          Créé avec le cœur. Imprimé avec passion.
        </p>
      </section>

      <div style={styles.filters}>
        <input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={styles.select}
        >
          <option value="newest">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      <div style={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            style={{
              ...styles.catBtn,
              ...(category === cat.value ? styles.catBtnActive : {}),
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <section style={styles.grid}>
        {filteredProducts.length === 0 ? (
          <p>Aucun produit trouvé.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        )}
      </section>
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
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    gap: "16px",
    flexWrap: "wrap",
  },

  logo: {
    color: "#7CFF9B",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "4px",
  },

  navLinks: {
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",
  },

  navLink: {
    color: "#e8f5e9",
    textDecoration: "none",
    fontWeight: "bold",
  },

  hero: {
    marginBottom: "25px",
  },

  title: {
    fontSize: "42px",
    color: "#7CFF9B",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#b8d9c4",
    fontSize: "18px",
  },

  filters: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  search: {
    flex: 1,
    minWidth: "240px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  select: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
    fontSize: "16px",
  },

  categories: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  catBtn: {
    padding: "12px 16px",
    background: "#102a1c",
    color: "#e8f5e9",
    border: "1px solid #1f4d33",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },

  catBtnActive: {
    background: "#7CFF9B",
    color: "#03140a",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
    paddingBottom: "90px",
  },
};
