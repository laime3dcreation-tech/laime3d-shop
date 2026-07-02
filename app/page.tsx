"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import ContactModal from "@/components/ContactModal";

const collections = [
  {
    title: "Figurines flexibles",
    text: "Créations articulées, ludiques et originales.",
    emoji: "🐉",
    href: "/shop?category=flexible",
  },
  {
    title: "Lampes",
    text: "Objets lumineux pour une ambiance unique.",
    emoji: "💡",
    href: "/shop?category=lamps",
  },
  {
    title: "Vases",
    text: "Décoration imprimée en 3D avec soin.",
    emoji: "🏺",
    href: "/shop?category=vases",
  },
  {
    title: "Porte-clés",
    text: "Petites créations à offrir ou à garder.",
    emoji: "🔑",
    href: "/shop?category=keychains",
  },
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

    const updatedCart = found
      ? cart.map((item: any) =>
          item.id === product.id && item.selectedColor === product.selectedColor
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      : [...cart, { ...product, qty: 1 }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <a href="/" style={styles.logo}>
  LAIME3D
</a>

        <div style={styles.navLinks}>
          <a href="/shop" style={styles.navLink}>
            Collections
          </a>
          <a href="#about" style={styles.navLink}>
            À propos
          </a>
          <a href="#contact" style={styles.navLink}>
            Contact
          </a>
        </div>
      </nav>

      <section style={styles.hero}>
        <p style={styles.brand}>LAIME3D</p>

        <h1 style={styles.title}>
          Créé avec le cœur.
          <br />
          Imprimé avec passion.
        </h1>

        <p style={styles.subtitle}>
          Des créations 3D pensées avec soin, pour offrir, décorer ou faire
          plaisir.
        </p>

        <a href="/shop" style={styles.mainButton}>
          Découvrir nos créations
        </a>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Nos collections</h2>

        <div style={styles.collections}>
          {collections.map((collection) => (
            <a
              key={collection.title}
              href={collection.href}
              style={styles.collectionCard}
            >
              <span style={styles.collectionEmoji}>{collection.emoji}</span>
              <h3>{collection.title}</h3>
              <p>{collection.text}</p>
            </a>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>⭐ Nos coups de cœur</h2>

          <div style={styles.grid}>
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </section>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🆕 Nouveautés</h2>

        <div style={styles.grid}>
          {latest.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
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
          <div style={styles.reason}>📦 Envoi soigné avec suivi</div>
        </div>
      </section>

      <section id="about" style={styles.infoSection}>
        <div>
          <h2 style={styles.sectionTitle}>À propos</h2>
          <p style={styles.text}>
            Laime3D est une petite boutique de créations imprimées en 3D.
            Chaque pièce est préparée avec attention, du choix du modèle à la
            finition.
          </p>
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Livraison</h2>
          <p style={styles.text}>
            Toutes nos créations sont préparées avec soin avant l'expédition.
            <br />
            <br />
            Les commandes sont généralement expédiées sous <b>24 à 72 heures</b>.
            Selon la complexité du modèle, les couleurs choisies ou le volume de
            commandes en cours, ce délai peut être légèrement prolongé.
            <br />
            <br />
            Les colis sont expédiés via <b>Mondial Relay</b> avec un numéro de
            suivi. Chaque création est soigneusement emballée afin d'arriver en
            parfait état.
          </p>
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

        <ContactModal />
      </section>

      <footer style={styles.footer}>
        <h2 style={styles.footerLogo}>LAIME3D</h2>

        <p style={styles.footerText}>
          Créé avec le cœur.
          <br />
          Imprimé avec passion.
        </p>

        <div style={styles.footerContacts}>
          <a href="mailto:laime3dcontact@yahoo.com" style={styles.footerLink}>
            ✉️ laime3dcontact@yahoo.com
          </a>

          <a
            href="https://instagram.com/laime3d"
            target="_blank"
            rel="noreferrer"
            style={styles.footerLink}
          >
            📷 @laime3d
          </a>
        </div>
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
  nav: {
    padding: "24px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1f4d33",
    flexWrap: "wrap",
    gap: "14px",
  },
  logo: {
  color: "#7CFF9B",
  letterSpacing: "3px",
  fontSize: "20px",
  textDecoration: "none",
  fontWeight: "bold",
},
  },
  navLinks: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  navLink: {
    color: "#e8f5e9",
    textDecoration: "none",
    fontWeight: "bold",
  },
  hero: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px",
  },
  brand: {
    color: "#7CFF9B",
    fontSize: "72px",
    letterSpacing: "8px",
    fontWeight: "bold",
    margin: 0,
  },
  title: {
    fontSize: "34px",
    lineHeight: "1.25",
    margin: "22px 0 10px",
  },
  subtitle: {
    maxWidth: "620px",
    color: "#b8d9c4",
    fontSize: "18px",
    lineHeight: "1.6",
  },
  mainButton: {
    display: "inline-block",
    marginTop: "22px",
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
  infoSection: {
    padding: "60px 40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  text: {
    color: "#c8facc",
    lineHeight: "1.7",
    fontSize: "17px",
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
    padding: "45px 40px",
    textAlign: "center",
    color: "#b8d9c4",
    borderTop: "1px solid #1f4d33",
  },
  footerLogo: {
    color: "#7CFF9B",
    fontSize: "32px",
    letterSpacing: "5px",
    marginBottom: "15px",
  },
  footerText: {
    color: "#b8d9c4",
    marginBottom: "25px",
    lineHeight: "1.7",
  },
  footerContacts: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
  },
  footerLink: {
    color: "#7CFF9B",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "17px",
  },
};