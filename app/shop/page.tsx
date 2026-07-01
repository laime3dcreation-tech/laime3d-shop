"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

const categories = [
  { value: "all", label: "Tous" },
  { value: "cats", label: "Chats" },
  { value: "dogs", label: "Chiens" },
  { value: "dragons", label: "Dragons" },
  { value: "reptiles", label: "Reptiles" },
  { value: "keychains", label: "Porte-clés" },
];

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
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

  function addToCart(product: any) {
    setCart((prev: any[]) => {
      const found = prev.find(
        (i) =>
          i.id === product.id &&
          i.selectedColor === product.selectedColor
      );

      if (found) {
        return prev.map((i) =>
          i.id === product.id &&
          i.selectedColor === product.selectedColor
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeItem(id: string, color: string) {
    setCart((prev: any[]) =>
      prev.filter(
        (i) => !(i.id === id && i.selectedColor === color)
      )
    );
  }

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Boutique Laime3D</h1>

      <div style={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            style={styles.catBtn}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={styles.layout}>
        <div style={styles.grid}>
          {products
            .filter(
              (p: any) =>
                category === "all" || p.category === category
            )
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

          {cart.length === 0 && <p>Votre panier est vide</p>}

          {cart.map((item: any, index: number) => (
            <div
              key={index}
              style={styles.cartItem}
            >
              <div>
                <strong>{item.name}</strong>

                {item.selectedColor && (
                  <div style={styles.color}>
                    Couleur : {item.selectedColor}
                  </div>
                )}

                <div>Quantité : {item.qty}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div>{item.price * item.qty}€</div>

                <button
                  onClick={() =>
                    removeItem(
                      item.id,
                      item.selectedColor
                    )
                  }
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
            <button style={styles.checkout}>
              Procéder au paiement →
            </button>
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
    width: "340px",
    padding: "15px",
    background: "#0f2418",
    borderRadius: "12px",
    position: "sticky",
    top: "20px",
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: "15px",
    gap: "10px",
  },

  color: {
    color: "#7CFF9B",
    fontSize: "13px",
    marginTop: "4px",
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
    padding: "10px",
    background: "#7CFF9B",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
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

  function addToCart(product: any) {
    setCart((prev: any[]) => {
      const found = prev.find(
        (i) =>
          i.id === product.id &&
          i.selectedColor === product.selectedColor
      );

      if (found) {
        return prev.map((i) =>
          i.id === product.id &&
          i.selectedColor === product.selectedColor
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeItem(id: string, color: string) {
    setCart((prev: any[]) =>
      prev.filter(
        (i) => !(i.id === id && i.selectedColor === color)
      )
    );
  }

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Boutique Laime3D</h1>

      <div style={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            style={styles.catBtn}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={styles.layout}>
        <div style={styles.grid}>
          {products
            .filter(
              (p: any) =>
                category === "all" || p.category === category
            )
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

          {cart.length === 0 && <p>Votre panier est vide</p>}

          {cart.map((item: any, index: number) => (
            <div
              key={index}
              style={styles.cartItem}
            >
              <div>
                <strong>{item.name}</strong>

                {item.selectedColor && (
                  <div style={styles.color}>
                    Couleur : {item.selectedColor}
                  </div>
                )}

                <div>Quantité : {item.qty}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div>{item.price * item.qty}€</div>

                <button
                  onClick={() =>
                    removeItem(
                      item.id,
                      item.selectedColor
                    )
                  }
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
            <button style={styles.checkout}>
              Procéder au paiement →
            </button>
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
    width: "340px",
    padding: "15px",
    background: "#0f2418",
    borderRadius: "12px",
    position: "sticky",
    top: "20px",
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: "15px",
    gap: "10px",
  },

  color: {
    color: "#7CFF9B",
    fontSize: "13px",
    marginTop: "4px",
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
    padding: "10px",
    background: "#7CFF9B",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};