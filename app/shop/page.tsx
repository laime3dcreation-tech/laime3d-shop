"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setProducts(data);
      }
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

  function addToCart(product: any) {
    setCart((prev: any[]) => {
      const found = prev.find((i) => i.id === product.id);

      if (found) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeItem(id: string) {
    setCart((prev: any[]) => prev.filter((i) => i.id !== id));
  }

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Laime3D Shop</h1>

      <div style={styles.categories}>
        {["all", "cats", "dogs", "dragons", "reptiles", "keychains"].map((cat) => (
          <button key={cat} style={styles.catBtn} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.layout}>
        <div style={styles.grid}>
          {products
            .filter((p: any) => category === "all" || p.category === category)
            .map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
        </div>

        <div style={styles.cart}>
          <h2>🛒 Panier</h2>

          {cart.length === 0 && <p>Vide</p>}

          {cart.map((item: any) => (
            <div key={item.id} style={styles.cartItem}>
              <span>
                {item.name} x{item.qty}
              </span>

              <span>{item.price * item.qty}€</span>

              <button onClick={() => removeItem(item.id)}>X</button>
            </div>
          ))}

          <hr />
          <h3>Total: {total}€</h3>

          <a href="/checkout">
            <button style={styles.checkout}>Commander →</button>
          </a>
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
  },
  title: {
    fontSize: "36px",
    color: "#7CFF9B",
    marginBottom: "15px",
  },
  categories: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
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
  layout: {
    display: "flex",
    gap: "20px",
  },
  grid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },
  cart: {
    width: "320px",
    padding: "15px",
    background: "#0f2418",
    borderRadius: "12px",
    position: "sticky",
    top: "20px",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  checkout: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    background: "#7CFF9B",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};