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
  const [cart, setCart] = useState<any[]>([]);
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

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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
    setCart((prev) => {
      const found = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === product.selectedColor
      );

      if (found) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedColor === product.selectedColor
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function increaseQty(id: string, color: string) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedColor === color
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  }

  function decreaseQty(id: string, color: string) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.selectedColor === color
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(id: string, color: string) {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.selectedColor === color)
      )
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

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

      <div style={styles.layout}>
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

        <aside style={styles.cart}>
          <h2>🛒 Panier</h2>

          {cart.length === 0 && <p>Votre panier est vide</p>}

          {cart.map((item, index) => (
            <div key={index} style={styles.cartItem}>
              <div>
                <strong>{item.name}</strong>

                {item.selectedColor && (
                  <div style={styles.color}>Couleur : {item.selectedColor}</div>
                )}

                <div style={styles.qty}>
                  <button
                    onClick={() => decreaseQty(item.id, item.selectedColor)}
                    style={styles.qtyButton}
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id, item.selectedColor)}
                    style={styles.qtyButton}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={styles.cartRight}>
                <div>{Number(item.price) * item.qty}€</div>

                <button
                  onClick={() => removeItem(item.id, item.selectedColor)}
                  style={styles.remove}
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}

          <hr />

          <h3>Total : {total}€</h3>

          <a href="/checkout">
            <button style={styles.checkout}>Procéder au paiement →</button>
          </a>
        </aside>
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
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
  },

  categories: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  catBtn: {
    padding: "10px 14px",
    background: "#102a1c",
    color: "#e8f5e9",
    border: "1px solid #1f4d33",
    borderRadius: "8px",
    cursor: "pointer",
  },

  catBtnActive: {
    background: "#7CFF9B",
    color: "#03140a",
    fontWeight: "bold",
  },

  layout: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },

  grid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
  },

  cart: {
    width: "350px",
    padding: "18px",
    background: "#0f2418",
    borderRadius: "14px",
    position: "sticky",
    top: "20px",
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "15px",
  },

  color: {
    color: "#7CFF9B",
    fontSize: "13px",
    marginTop: "4px",
  },

  qty: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginTop: "8px",
  },

  qtyButton: {
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#7CFF9B",
    fontWeight: "bold",
  },

  cartRight: {
    textAlign: "right",
  },

  remove: {
    marginTop: "8px",
    background: "#ff8a8a",
    border: "none",
    borderRadius: "6px",
    padding: "5px 10px",
    cursor: "pointer",
  },

  checkout: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#7CFF9B",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};