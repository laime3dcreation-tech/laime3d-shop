"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProduct(data);
      setSelectedColor(data.colors?.[0] || "");
    }

    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <main style={styles.page}>
        <p>Chargement du produit...</p>
      </main>
    );
  }

  const images = product.images || [];
  const unlimitedStock = Boolean(product.unlimited_stock);
  const stock = Number(product.stock || 0);
  const isOutOfStock = !unlimitedStock && stock <= 0;
  const maxQty = unlimitedStock ? 99 : Math.max(1, stock);

  function previousImage() {
    if (!images.length) return;
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  function nextImage() {
    if (!images.length) return;
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }

  function addToCart() {
    if (!product || isOutOfStock) return;

    const finalQty = unlimitedStock ? qty : Math.min(qty, stock);
    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];

    const found = cart.find(
      (item: any) =>
        item.id === product.id && item.selectedColor === selectedColor
    );

    let updatedCart;

    if (found) {
      updatedCart = cart.map((item: any) =>
        item.id === product.id && item.selectedColor === selectedColor
          ? {
              ...item,
              qty: unlimitedStock
                ? Number(item.qty || 0) + finalQty
                : Math.min(Number(item.qty || 0) + finalQty, stock),
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          selectedColor,
          qty: finalQty,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const descriptionBlocks = useMemo(() => {
    const text = String(product.description || "").trim();
    if (!text) return [];

    const knownHeadings = [
      "✨ POURQUOI VOUS ALLEZ L’ADORER",
      "✨ POURQUOI VOUS ALLEZ L'ADORER",
      "💡 CONTENU",
      "🏡 IDÉALE POUR",
      "🏡 IDEALE POUR",
      "🎨 UNE PIÈCE DÉCORATIVE UNIQUE",
      "🎨 UNE PIECE DECORATIVE UNIQUE",
      "🇫🇷 FABRIQUÉE EN FRANCE",
      "🇫🇷 FABRIQUEE EN FRANCE",
    ];

    const escaped = knownHeadings
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const parts = text
      .split(new RegExp(`(?=${escaped})`, "g"))
      .map((part) => part.trim())
      .filter(Boolean);

    return parts.length ? parts : [text];
  }, [product.description]);

  const pageStyle = {
    ...styles.page,
    ...(isMobile ? styles.pageMobile : {}),
  };

  const layoutStyle = {
    ...styles.layout,
    ...(isMobile ? styles.layoutMobile : {}),
  };

  const purchaseStyle = {
    ...styles.purchaseCard,
    ...(isMobile ? styles.purchaseCardMobile : {}),
  };

  const titleStyle = {
    ...styles.title,
    ...(isMobile ? styles.titleMobile : {}),
  };

  const descriptionGridStyle = {
    ...styles.descriptionGrid,
    ...(isMobile ? styles.descriptionGridMobile : {}),
  };

  return (
    <main style={pageStyle}>
      <div style={styles.shell}>
        <a href="/shop" style={styles.back}>
          ← Retour à la boutique
        </a>

        <div style={layoutStyle}>
          <section style={styles.galleryColumn}>
            <div style={styles.gallery}>
              {isOutOfStock && (
                <div style={styles.soldOutBadge}>Rupture de stock</div>
              )}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={previousImage}
                  style={styles.arrowLeft}
                  aria-label="Image précédente"
                >
                  ‹
                </button>
              )}

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                style={styles.imageButton}
                aria-label="Agrandir l'image"
              >
                <img
                  src={images[activeImage] || images[0] || ""}
                  alt={product.name}
                  style={{
                    ...styles.mainImage,
                    ...(isOutOfStock ? styles.imageDisabled : {}),
                  }}
                />
              </button>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  style={styles.arrowRight}
                  aria-label="Image suivante"
                >
                  ›
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div style={styles.imageCounter}>
                {activeImage + 1} / {images.length}
              </div>
            )}
          </section>

          <section style={purchaseStyle}>
            <div>
              <h1 style={titleStyle}>{product.name}</h1>

              <p style={styles.price}>
                {Number(product.price || 0).toFixed(2)} €
              </p>

              <div style={styles.stockBox}>
                {unlimitedStock ? (
                  <span>♾️ Fabrication à la demande</span>
                ) : isOutOfStock ? (
                  <span style={styles.stockDanger}>
                    ⚠️ Produit indisponible
                  </span>
                ) : stock <= 3 ? (
                  <span style={styles.stockWarning}>
                    🔥 Plus que {stock} disponible(s)
                  </span>
                ) : (
                  <span>📦 Disponible</span>
                )}
              </div>

              {product.colors?.length > 0 && (
                <div style={styles.fieldBlock}>
                  <label style={styles.label}>Couleur</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    style={styles.select}
                    disabled={isOutOfStock}
                  >
                    {product.colors.map((color: string) => (
                      <option
                        key={color}
                        value={color}
                        style={{
                          color: "#3B342D",
                          backgroundColor: "#FFF8EE",
                        }}
                      >
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={styles.fieldBlock}>
                <label style={styles.label}>Quantité</label>

                <div style={styles.qtyRow}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{
                      ...styles.qtyButton,
                      ...(isOutOfStock ? styles.disabledSmallButton : {}),
                    }}
                    disabled={isOutOfStock}
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>

                  <span style={styles.qtyNumber}>
                    {isOutOfStock ? 0 : qty}
                  </span>

                  <button
                    onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    style={{
                      ...styles.qtyButton,
                      ...(isOutOfStock || (!unlimitedStock && qty >= stock)
                        ? styles.disabledSmallButton
                        : {}),
                    }}
                    disabled={
                      isOutOfStock || (!unlimitedStock && qty >= stock)
                    }
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>

                {!unlimitedStock && !isOutOfStock && (
                  <p style={styles.stockNote}>
                    Quantité maximum disponible : {stock}
                  </p>
                )}
              </div>

              {added && (
                <div style={styles.addedMessage}>
                  ✅ Produit ajouté au panier
                </div>
              )}

              <button
                onClick={addToCart}
                disabled={isOutOfStock}
                style={{
                  ...styles.button,
                  ...(isOutOfStock ? styles.buttonDisabled : {}),
                }}
              >
                {isOutOfStock
                  ? "Indisponible"
                  : added
                  ? "Ajouté ✓"
                  : "Ajouter au panier"}
              </button>

              <div style={styles.shippingBox}>
                <div style={styles.shippingLine}>
                  <span style={styles.shippingIcon}>🚚</span>
                  <div>
                    <strong>Livraison suivie</strong>
                    <span>Mondial Relay ou livraison à domicile</span>
                  </div>
                </div>

                <div style={styles.shippingDivider} />

                <div style={styles.shippingLine}>
                  <span style={styles.shippingIcon}>♡</span>
                  <div>
                    <strong>Livraison offerte dès 69 €</strong>
                    <span>Préparation soignée de votre commande</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {product.description && (
          <section style={styles.descriptionSection}>
            <div style={styles.descriptionHeader}>
              <span style={styles.eyebrow}>DÉTAILS</span>
              <h2 style={styles.descriptionTitle}>À propos de cette création</h2>
            </div>

            <div style={descriptionGridStyle}>
              {descriptionBlocks.map((block: string, index: number) => {
                const lines = block.split(/\n+/).map((l) => l.trim()).filter(Boolean);
                const firstLine = lines[0] || "";
                const looksLikeHeading =
                  /^[✨💡🏡🎨🇫🇷]/.test(firstLine) ||
                  /POURQUOI VOUS ALLEZ|CONTENU|IDÉALE POUR|IDEALE POUR|PIÈCE DÉCORATIVE|PIECE DECORATIVE|FABRIQUÉE EN FRANCE|FABRIQUEE EN FRANCE/.test(
                    firstLine
                  );

                const heading = looksLikeHeading ? firstLine : index === 0 ? "Description" : "";
                const body = looksLikeHeading
                  ? block.slice(firstLine.length).trim()
                  : block;

                return (
                  <article key={index} style={styles.descriptionCard}>
                    {heading && (
                      <h3 style={styles.descriptionCardTitle}>{heading}</h3>
                    )}
                    <p style={styles.descriptionText}>{body}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {lightboxOpen && (
        <div style={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <div
            style={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              style={styles.lightboxClose}
              aria-label="Fermer"
            >
              ×
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                style={styles.lightboxArrowLeft}
                aria-label="Image précédente"
              >
                ‹
              </button>
            )}

            <img
              src={images[activeImage] || images[0] || ""}
              alt={product.name}
              style={styles.lightboxImage}
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                style={styles.lightboxArrowRight}
                aria-label="Image suivante"
              >
                ›
              </button>
            )}

            <div style={styles.lightboxText}>
              <strong>{product.name}</strong>
              {images.length > 1 && (
                <span>
                  {activeImage + 1} / {images.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#F4E4CE",
    color: "#3B342D",
    padding: "34px 28px 70px",
    fontFamily: "Arial, Helvetica, sans-serif",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  pageMobile: {
    padding: "20px 12px 46px",
  },

  shell: {
    width: "100%",
    maxWidth: "1380px",
    margin: "0 auto",
  },

  back: {
    color: "#A66B24",
    textDecoration: "none",
    fontWeight: 700,
    display: "inline-block",
    marginBottom: "26px",
    fontSize: "15px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.08fr) minmax(420px, 0.92fr)",
    gap: "34px",
    alignItems: "start",
  },

  layoutMobile: {
    gridTemplateColumns: "1fr",
    gap: "20px",
  },

  galleryColumn: {
    minWidth: 0,
  },

  gallery: {
    position: "relative",
    width: "100%",
    background: "#EFD8B7",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 14px 38px rgba(91, 65, 34, 0.10)",
  },

  soldOutBadge: {
    position: "absolute",
    top: "16px",
    left: "16px",
    zIndex: 4,
    background: "#C95A4A",
    color: "#FFF8EE",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",
  },

  imageButton: {
    width: "100%",
    padding: 0,
    background: "transparent",
    border: "none",
    cursor: "zoom-in",
    display: "block",
  },

  mainImage: {
    width: "100%",
    height: "auto",
    maxHeight: "760px",
    objectFit: "contain",
    display: "block",
    background: "#FBF1E2",
  },

  imageDisabled: {
    opacity: 0.55,
    filter: "grayscale(0.5)",
  },

  arrowLeft: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(59,52,45,0.64)",
    color: "#FFF8EE",
    fontSize: "34px",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
  },

  arrowRight: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(59,52,45,0.64)",
    color: "#FFF8EE",
    fontSize: "34px",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
  },

  imageCounter: {
    textAlign: "center",
    color: "#7A6A5C",
    fontSize: "14px",
    marginTop: "12px",
  },

  purchaseCard: {
    background: "#FBF1E2",
    border: "1px solid #D7B98F",
    borderRadius: "24px",
    padding: "32px",
    minWidth: 0,
    boxShadow: "0 14px 38px rgba(91, 65, 34, 0.08)",
    position: "sticky",
    top: "24px",
  },

  purchaseCardMobile: {
    padding: "24px 20px",
    position: "static",
    borderRadius: "20px",
  },

  title: {
    color: "#A96E27",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "46px",
    lineHeight: 1.08,
    margin: "0 0 12px",
    fontWeight: 600,
  },

  titleMobile: {
    fontSize: "34px",
  },

  price: {
    color: "#3B342D",
    fontSize: "31px",
    lineHeight: 1,
    fontWeight: 800,
    margin: "0 0 20px",
  },

  stockBox: {
    background: "#F4E4CE",
    border: "1px solid #D7B98F",
    borderRadius: "13px",
    padding: "13px 14px",
    marginBottom: "24px",
    color: "#A96E27",
    fontWeight: 700,
  },

  stockWarning: {
    color: "#A76618",
  },

  stockDanger: {
    color: "#C95A4A",
  },

  fieldBlock: {
    marginTop: "20px",
  },

  label: {
    display: "block",
    marginBottom: "9px",
    fontWeight: 800,
    fontSize: "16px",
    color: "#3B342D",
  },

  select: {
    width: "100%",
    padding: "14px 14px",
    borderRadius: "12px",
    border: "1px solid #CFAE7F",
    background: "#FFF8EE",
    color: "#3B342D",
    colorScheme: "light",
    WebkitTextFillColor: "#3B342D",
    fontSize: "16px",
    fontWeight: 600,
    outline: "none",
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "2px",
  },

  qtyButton: {
    width: "44px",
    height: "44px",
    borderRadius: "11px",
    border: "none",
    background: "#B77A2D",
    color: "#FFF8EE",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "20px",
  },

  disabledSmallButton: {
    background: "#CCB89A",
    color: "#F4E4CE",
    cursor: "not-allowed",
  },

  qtyNumber: {
    minWidth: "38px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 700,
  },

  stockNote: {
    color: "#7E6F62",
    fontSize: "13px",
    marginTop: "10px",
    marginBottom: 0,
  },

  addedMessage: {
    marginTop: "20px",
    background: "#F4E4CE",
    border: "1px solid #B77A2D",
    color: "#9A631F",
    borderRadius: "12px",
    padding: "12px",
    textAlign: "center",
    fontWeight: 700,
  },

  button: {
    marginTop: "22px",
    width: "100%",
    padding: "16px 18px",
    background: "#B77A2D",
    color: "#FFF8EE",
    border: "none",
    borderRadius: "13px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "17px",
    boxShadow: "0 10px 24px rgba(183,122,45,0.22)",
  },

  buttonDisabled: {
    background: "#C8B7A4",
    color: "#F1E1CB",
    cursor: "not-allowed",
    boxShadow: "none",
  },

  shippingBox: {
    marginTop: "22px",
    borderTop: "1px solid #DEC7A5",
    paddingTop: "18px",
  },

  shippingLine: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },

  shippingIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#EFD8B7",
    flexShrink: 0,
  },

  shippingDivider: {
    height: "1px",
    background: "#E3CDAE",
    margin: "14px 0",
  },

  descriptionSection: {
    marginTop: "64px",
    paddingTop: "8px",
  },

  descriptionHeader: {
    textAlign: "center",
    marginBottom: "26px",
  },

  eyebrow: {
    display: "inline-block",
    color: "#A96E27",
    fontWeight: 800,
    fontSize: "12px",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  descriptionTitle: {
    margin: 0,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "38px",
    fontWeight: 600,
    color: "#4B3E31",
  },

  descriptionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  descriptionGridMobile: {
    gridTemplateColumns: "1fr",
  },

  descriptionCard: {
    background: "#FBF1E2",
    border: "1px solid #D7B98F",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 28px rgba(91,65,34,0.06)",
  },

  descriptionCardTitle: {
    margin: "0 0 12px",
    color: "#A96E27",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "21px",
    lineHeight: 1.3,
  },

  descriptionText: {
    margin: 0,
    color: "#6F6256",
    lineHeight: 1.75,
    fontSize: "16px",
    whiteSpace: "pre-wrap",
  },

  lightbox: {
    position: "fixed",
    inset: 0,
    background: "rgba(45,41,37,0.92)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
  },

  lightboxContent: {
    position: "relative",
    width: "min(1080px, 100%)",
    maxHeight: "92vh",
    display: "grid",
    gap: "12px",
  },

  lightboxImage: {
    width: "100%",
    maxHeight: "78vh",
    objectFit: "contain",
    borderRadius: "14px",
    background: "#F4E4CE",
  },

  lightboxText: {
    color: "#FFF8EE",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "16px",
  },

  lightboxClose: {
    position: "absolute",
    top: "-14px",
    right: "-8px",
    zIndex: 4,
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "none",
    background: "#B77A2D",
    color: "#FFF8EE",
    fontSize: "26px",
    cursor: "pointer",
    fontWeight: 700,
  },

  lightboxArrowLeft: {
    position: "absolute",
    left: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 4,
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(183,122,45,0.96)",
    color: "#FFF8EE",
    fontSize: "34px",
    cursor: "pointer",
  },

  lightboxArrowRight: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 4,
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(183,122,45,0.96)",
    color: "#FFF8EE",
    fontSize: "34px",
    cursor: "pointer",
  },
};
