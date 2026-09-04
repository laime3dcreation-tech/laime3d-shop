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
    text: "Des pièces lumineuses pour une ambiance douce et unique.",
    emoji: "💡",
    href: "/shop?category=lamps",
  },
  {
    title: "Vases",
    text: "Décoration contemporaine imprimée avec soin.",
    emoji: "🏺",
    href: "/shop?category=vases",
  },
  {
    title: "Porte-clés",
    text: "De petites créations originales à offrir ou à garder.",
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
    window.dispatchEvent(new Event("cart-updated"));
  }

  return (
    <main className="page">
      <div className="shippingBar">
        Livraison offerte dès 69€ d’achat · Expédition suivie
      </div>

      <nav className="nav">
        <a href="/" className="brand">
          LAIME3D
        </a>

        <div className="navLinks">
          <a href="/shop">Boutique</a>
          <a href="#collections">Collections</a>
          <a href="#about">À propos</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <picture className="heroPicture">
          <source
            media="(max-width: 768px)"
            srcSet="/publicbanner-mobile.png"
          />
          <img
            src="/publicbanner.png"
            alt="LAIME3D - Créations artisanales imprimées en 3D"
            className="heroImage"
          />
        </picture>

        <div className="heroButtonWrap">
          <a href="/shop" className="primaryButton">
            Découvrir la boutique
          </a>
        </div>
      </section>

      <section className="intro">
        <span className="eyebrow">CRÉATIONS ARTISANALES</span>
        <h1>Des objets uniques, créés avec soin</h1>
        <p>
          Lampes, décoration et petites créations imprimées en 3D dans un
          univers doux, chaleureux et original.
        </p>
      </section>

      <section id="collections" className="section">
        <div className="sectionHeading">
          <div>
            <span className="eyebrow">DÉCOUVRIR</span>
            <h2>Nos collections</h2>
          </div>
          <a href="/shop" className="textLink">
            Voir toute la boutique →
          </a>
        </div>

        <div className="collections">
          {collections.map((collection) => (
            <a
              key={collection.title}
              href={collection.href}
              className="collectionCard"
            >
              <div className="collectionIcon">{collection.emoji}</div>
              <h3>{collection.title}</h3>
              <p>{collection.text}</p>
              <span>Découvrir →</span>
            </a>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section altSection">
          <div className="sectionHeading">
            <div>
              <span className="eyebrow">SÉLECTION</span>
              <h2>Nos coups de cœur</h2>
            </div>
          </div>

          <div className="productGrid">
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

      <section className="section">
        <div className="sectionHeading">
          <div>
            <span className="eyebrow">NOUVEAUTÉS</span>
            <h2>Les dernières créations</h2>
          </div>
        </div>

        <div className="productGrid">
          {latest.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>

        <div className="center">
          <a href="/shop" className="secondaryButton">
            Voir toute la boutique
          </a>
        </div>
      </section>

      <section className="valuesSection">
        <div className="value">
          <span>♡</span>
          <strong>Créé avec passion</strong>
          <p>Chaque création est préparée avec attention.</p>
        </div>

        <div className="value">
          <span>✦</span>
          <strong>Fabrication artisanale</strong>
          <p>Des objets originaux, réalisés en petite série.</p>
        </div>

        <div className="value">
          <span>🎨</span>
          <strong>Plusieurs couleurs</strong>
          <p>Choisissez la finition qui correspond à votre intérieur.</p>
        </div>

        <div className="value">
          <span>📦</span>
          <strong>Envoi soigné</strong>
          <p>Emballage attentif et suivi de votre colis.</p>
        </div>
      </section>

      <section id="about" className="storySection">
        <div className="storyCard">
          <span className="eyebrow">NOTRE UNIVERS</span>
          <h2>À propos de LAIME3D</h2>
          <p>
            Bienvenue chez <b>LAIME3D</b> ❤️
          </p>
          <p>
            Nous créons des objets imprimés en 3D avec passion, en accordant
            une attention particulière à chaque détail. Chaque pièce est
            fabriquée avec soin, du choix des matériaux jusqu’aux finitions.
          </p>
          <p>
            Notre objectif est simple : vous proposer des créations originales,
            chaleureuses et agréables à offrir… ou à s’offrir.
          </p>
        </div>

        <div className="storyCard">
          <span className="eyebrow">EXPÉDITION</span>
          <h2>Livraison</h2>
          <p>
            Toutes nos créations sont préparées avec soin avant l’expédition.
            Les commandes sont généralement expédiées sous{" "}
            <b>24 à 72 heures</b>.
          </p>
          <div className="shippingHighlight">
            Livraison offerte dès <b>69€ d’achat</b>
          </div>
          <p>
            Les colis sont expédiés via <b>Mondial Relay</b> ou en{" "}
            <b>livraison à domicile</b> avec un numéro de suivi.
          </p>
        </div>
      </section>

      <section id="contact" className="contactSection">
        <span className="eyebrow">SUR MESURE</span>
        <h2>Une idée en tête ?</h2>
        <p>
          Vous rêvez d’une création particulière ? Parlez-nous de votre idée,
          nous ferons tout notre possible pour lui donner vie.
        </p>
        <ContactModal />
      </section>

      <footer className="footer">
        <div className="footerBrand">LAIME3D</div>
        <p>Créé avec le cœur. Imprimé avec passion.</p>

        <div className="footerContacts">
          <a href="mailto:laime3dcontact@yahoo.com">
            ✉️ laime3dcontact@yahoo.com
          </a>
          <a
            href="https://instagram.com/laime3d"
            target="_blank"
            rel="noreferrer"
          >
            📷 @laime3d
          </a>
        </div>

        <div className="footerLegal">
          <a href="/legal/mentions-legales">Mentions légales</a>
          <a href="/legal/cgv">CGV</a>
          <a href="/legal/confidentialite">Confidentialité</a>
          <a href="/legal/livraison-retours">Livraison & retours</a>
        </div>
      </footer>

      <style jsx>{`
        :global(body) {
          margin: 0;
          background: #F4E4CE;
          color: #352f2a;
        }

        :global(*) {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #F4E4CE;
          color: #352f2a;
          font-family: Arial, Helvetica, sans-serif;
        }

        .shippingBar {
          background: #b98235;
          color: #fffaf2;
          text-align: center;
          padding: 9px 18px;
          font-size: 13px;
          letter-spacing: 0.3px;
        }

        .nav {
          max-width: 1380px;
          margin: 0 auto;
          padding: 22px 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .brand {
          color: #8d5f24;
          text-decoration: none;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }

        .navLinks a {
          color: #51483f;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .hero {
          max-width: 1480px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .heroPicture {
          display: block;
          width: 100%;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 18px 55px rgba(92, 67, 38, 0.14);
          background: #efe2cf;
        }

        .heroImage {
          width: 100%;
          height: auto;
          display: block;
        }

        .heroButtonWrap {
          display: flex;
          justify-content: center;
          padding: 26px 0 12px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border-radius: 999px;
          font-weight: 700;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .primaryButton {
          background: #b98235;
          color: #FFF8EE;
          padding: 15px 30px;
          box-shadow: 0 10px 24px rgba(185, 130, 53, 0.23);
        }

        .secondaryButton {
          background: #FAEEDC;
          border: 1px solid #d8c09e;
          color: #795426;
          padding: 13px 24px;
        }

        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .intro {
          max-width: 780px;
          margin: 74px auto 34px;
          padding: 0 24px;
          text-align: center;
        }

        .eyebrow {
          display: inline-block;
          color: #b0782f;
          font-size: 12px;
          letter-spacing: 2.2px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .intro h1,
        .sectionHeading h2,
        .storyCard h2,
        .contactSection h2 {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 600;
          color: #4a3c2d;
        }

        .intro h1 {
          font-size: clamp(34px, 5vw, 58px);
          line-height: 1.08;
          margin: 0 0 18px;
        }

        .intro p {
          color: #75685c;
          font-size: 18px;
          line-height: 1.7;
          margin: 0;
        }

        .section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 72px 34px;
        }

        .altSection {
          background: #EEDCC2;
          max-width: none;
          padding-left: max(34px, calc((100vw - 1252px) / 2));
          padding-right: max(34px, calc((100vw - 1252px) / 2));
        }

        .sectionHeading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 30px;
        }

        .sectionHeading h2 {
          font-size: clamp(30px, 4vw, 46px);
          margin: 0;
        }

        .textLink {
          color: #8b632e;
          text-decoration: none;
          font-weight: 700;
          white-space: nowrap;
        }

        .collections {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .collectionCard {
          background: rgba(255, 252, 247, 0.88);
          border: 1px solid #dfccb1;
          border-radius: 22px;
          padding: 27px;
          color: #443c34;
          text-decoration: none;
          box-shadow: 0 10px 32px rgba(87, 61, 32, 0.07);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .collectionCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(87, 61, 32, 0.11);
        }

        .collectionIcon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EFD6B1;
          font-size: 28px;
          margin-bottom: 18px;
        }

        .collectionCard h3 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          margin: 0 0 10px;
        }

        .collectionCard p {
          color: #786b60;
          line-height: 1.55;
          min-height: 48px;
          margin-bottom: 18px;
        }

        .collectionCard span {
          color: #9c6d2e;
          font-weight: 700;
          font-size: 14px;
        }

        .productGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .center {
          text-align: center;
          margin-top: 30px;
        }

        .valuesSection {
          max-width: 1260px;
          margin: 28px auto 78px;
          padding: 28px 34px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .value {
          text-align: center;
          padding: 26px 20px;
          border-top: 1px solid #ddc8a8;
          border-bottom: 1px solid #ddc8a8;
        }

        .value > span {
          font-size: 28px;
          color: #b98235;
          display: block;
          margin-bottom: 10px;
        }

        .value strong {
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .value p {
          color: #796e65;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .storySection {
          max-width: 1260px;
          margin: 0 auto;
          padding: 28px 34px 80px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .storyCard {
          background: #FAEEDC;
          border: 1px solid #dfccb1;
          border-radius: 26px;
          padding: 38px;
          box-shadow: 0 12px 35px rgba(93, 65, 34, 0.07);
        }

        .storyCard h2 {
          font-size: 34px;
          margin: 2px 0 20px;
        }

        .storyCard p {
          color: #6e6258;
          line-height: 1.75;
          font-size: 16px;
        }

        .shippingHighlight {
          background: #EBCFA4;
          color: #744c1c;
          border-radius: 14px;
          padding: 14px 16px;
          margin: 18px 0;
          font-size: 16px;
        }

        .contactSection {
          max-width: 920px;
          margin: 0 auto 80px;
          padding: 58px 36px;
          text-align: center;
          background: #E7CDA8;
          border-radius: 30px;
        }

        .contactSection h2 {
          font-size: 42px;
          margin: 4px 0 14px;
        }

        .contactSection p {
          max-width: 650px;
          margin: 0 auto 26px;
          color: #675b50;
          line-height: 1.7;
        }

        .footer {
          background: #EAD5B8;
          border-top: 1px solid #dcc6a6;
          padding: 52px 30px 34px;
          text-align: center;
          color: #75695e;
        }

        .footerBrand {
          color: #8d5f24;
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: 5px;
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .footerContacts,
        .footerLegal {
          display: flex;
          justify-content: center;
          gap: 18px 28px;
          flex-wrap: wrap;
        }

        .footerContacts {
          margin-top: 22px;
        }

        .footerContacts a {
          color: #8a602a;
          text-decoration: none;
          font-weight: 700;
        }

        .footerLegal {
          margin-top: 30px;
          padding-top: 22px;
          border-top: 1px solid #d8c3a4;
        }

        .footerLegal a {
          color: #776b61;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 980px) {
          .collections,
          .productGrid,
          .valuesSection {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .storySection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .shippingBar {
            font-size: 12px;
            padding: 8px 12px;
          }

          .nav {
            padding: 18px 16px;
            align-items: flex-start;
          }

          .brand {
            font-size: 21px;
          }

          .navLinks {
            gap: 12px 17px;
            justify-content: flex-end;
          }

          .navLinks a {
            font-size: 13px;
          }

          .hero {
            padding: 0 10px;
          }

          .heroPicture {
            border-radius: 18px;
          }

          .heroButtonWrap {
            padding-top: 18px;
          }

          .intro {
            margin-top: 50px;
          }

          .section,
          .altSection {
            padding: 54px 16px;
          }

          .sectionHeading {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 24px;
          }

          .collections,
          .productGrid,
          .valuesSection {
            grid-template-columns: 1fr;
          }

          .collectionCard {
            padding: 22px;
          }

          .valuesSection {
            padding: 20px 16px 58px;
            margin-bottom: 10px;
          }

          .value {
            padding: 20px 16px;
          }

          .storySection {
            padding: 10px 16px 58px;
          }

          .storyCard {
            padding: 27px 22px;
            border-radius: 20px;
          }

          .contactSection {
            margin: 0 16px 58px;
            padding: 42px 22px;
            border-radius: 22px;
          }

          .contactSection h2 {
            font-size: 34px;
          }

          .footer {
            padding: 42px 18px 28px;
          }
        }
      `}</style>
    </main>
  );
}
