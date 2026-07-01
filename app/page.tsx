"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

const collections = [
  { title: "Figurines flexibles", emoji: "🐉", href: "/shop?category=flexible" },
  { title: "Lampes", emoji: "💡", href: "/shop?category=lamps" },
  { title: "Vases", emoji: "🏺", href: "/shop?category=vases" },
  { title: "Porte-clés", emoji: "🔑", href: "/shop?category=keychains" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!data) return;

      setLatest(data.slice(0, 4));
      setFeatured(data.filter((p) => p.featured).slice(0, 4));
    }

    loadProducts();
  }, []);

  function addToCart(product: any) {
    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];

    const found = cart.find(
      (item: any) =>
        item.id === product.id && item.selectedColor === product.selectedColor
    );

    let updatedCart;

    if (found) {
      updatedCart = cart.map((item: any) =>
        item.id === product.id && item.selectedColor === product.selectedColor
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.small}>LAIME3D</p>
          <h1 style={styles.heroTitle}>
            Créé avec le cœur.
            <br />
            Imprimé avec passion.
          </h1>

          <a href="/shop" style={styles.mainButton}>
            Découvrir nos créations
          </a>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Nos collections</h2>

        <div style={styles.collections}>
          {collections.map((collection) => (
            <a key={collection.title} href={collection.href} style={styles.collectionCard}>
              <span style={styles.collectionEmoji}>{collection.emoji}</span>
              <h3>{collection.title}</h3>
            </a>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>⭐ Nos coups de cœur</h2>

          <div style={styles.grid}>
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🆕 Nouveautés</h2>

        <div style={styles.grid}>
          {latest.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>

        <a href="/shop" style={styles.secondaryButton}>
          Voir toute la boutique
        </a>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Pourquoi Laime3D ?</h2>

        <div style={styles.reasons}>
          <div style={styles.reason}>❤️ Créé avec passion</div>
          <div style={styles.reason}>🎨 Plusieurs couleurs disponibles</div>
          <div style={styles.reason}>✨ Fabrication artisanale</div>
          <div style={styles.reason}>📦 Livraison dans toute l'Europe</div>
        </div>
      </section>

      <section id="contact" style={styles.idea}>
        <h2 style={styles.ideaTitle}>Une idée en tête ?</h2>

        <h3>Vous rêvez d'une création unique ?</h3>

        <p>Nous adorons relever de nouveaux défis.</p>

        <p>
          Parlez-nous de votre idée, et nous ferons tout notre possible pour lui
          donner vie.
        </p>

        <a href="/shop" style={styles.mainButton}>
          Discutons de votre projet
        </a>
      </section>

      <footer style={styles.footer}>
        <strong>LAIME3D</strong>
        <p>Créé avec le cœur. Imprimé avec passion.</p>
      </footer>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#0b1f14",
    color: "#e8f5e9",
    fontFamily: "Arial",
  },

  hero: {
    minHeight: "75vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px",
  },

  small: {
    color: "#7CFF9B",
    letterSpacing: "6px",
    fontWeight: "bold",
  },

  heroTitle: {
    fontSize: "56px",
    lineHeight: "1.15",
    margin: "20px 0",
  },

  mainButton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "14px 24px",
    background: "#7CFF9B",
    color: "#03140a",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  secondaryButton: {
    display: "inline-block",
    marginTop: "25px",
    padding: "12px 20px",
    background: "#1f4d33",
    color: "#e8f5e9",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  section: {
    padding: "60px 40px",
  },

  sectionTitle: {
    color: "#7CFF9B",
    fontSize: "34px",
    marginBottom: "24px",
  },

  collections: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  collectionCard: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "26px",
    color: "#e8f5e9",
    textDecoration: "none",
  },

  collectionEmoji: {
    fontSize: "42px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
  },

  reasons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  reason: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "20px",
    fontWeight: "bold",
  },

  idea: {
    margin: "40px",
    padding: "50px 30px",
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "24px",
    textAlign: "center",
  },

  ideaTitle: {
    color: "#7CFF9B",
    fontSize: "38px",
  },

  footer: {
    padding: "40px",
    textAlign: "center",
    color: "#b8d9c4",
  },
};