"use client";

import { useEffect, useState } from "react";
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

  const pageStyle = {
    ...styles.page,
    ...(isMobile ? styles.pageMobile : {}),
  };

  const layoutStyle = {
    ...styles.layout,
    ...(isMobile ? styles.layoutMobile : {}),
  };

  const titleStyle = {
    ...styles.title,
    ...(isMobile ? styles.titleMobile : {}),
  };

  return (
    <main style={pageStyle}>
      <a href="/shop" style={styles.back}>
        ← Retour à la boutique
      </a>

      <div style={layoutStyle}>
        <section>
          <div style={styles.gallery}>
            {isOutOfStock && (
              <div style={styles.soldOutBadge}>Rupture de stock</div>
            )}

            <button
              type="button"
              onClick={previousImage}
              style={styles.arrowLeft}
              aria-label="Image précédente"
            >
              ‹
            </button>

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

            <button
              type="button"
              onClick={nextImage}
              style={styles.arrowRight}
              aria-label="Image suivante"
            >
              ›
            </button>
          </div>

          {images.length > 1 && (
            <div style={styles.imageCounter}>
              {activeImage + 1} / {images.length}
            </div>
          )}
        </section>

        <section style={styles.info}>
          <h1 style={titleStyle}>{product.name}</h1>

          <p style={styles.price}>
            {Number(product.price || 0).toFixed(2)} €
          </p>

          <div style={styles.stockBox}>
            {unlimitedStock ? (
              <span>♾️ Fabrication à la demande</span>
            ) : isOutOfStock ? (
              <span style={styles.stockDanger}>⚠️ Produit indisponible</span>
            ) : stock <= 3 ? (
              <span style={styles.stockWarning}>
                🔥 Plus que {stock} disponible(s)
              </span>
            ) : (
              <span>📦 Disponible</span>
            )}
          </div>

          {product.description && (
            <p style={styles.description}>{product.description}</p>
          )}

          {product.colors?.length > 0 && (
            <>
              <label style={styles.label}>Couleur</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={styles.select}
                disabled={isOutOfStock}
              >
                {product.colors.map((color: string) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </>
          )}

          <label style={styles.label}>Quantité</label>

          <div style={styles.qtyRow}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{
                ...styles.qtyButton,
                ...(isOutOfStock ? styles.disabledSmallButton : {}),
              }}
              disabled={isOutOfStock}
            >
              -
            </button>

            <span style={styles.qtyNumber}>{isOutOfStock ? 0 : qty}</span>

            <button
              onClick={() => setQty(Math.min(maxQty, qty + 1))}
              style={{
                ...styles.qtyButton,
                ...(isOutOfStock || (!unlimitedStock && qty >= stock)
                  ? styles.disabledSmallButton
                  : {}),
              }}
              disabled={isOutOfStock || (!unlimitedStock && qty >= stock)}
            >
              +
            </button>
          </div>

          {!unlimitedStock && !isOutOfStock && (
            <p style={styles.stockNote}>
              Quantité maximum disponible : {stock}
            </p>
          )}

          {added && <div style={styles.addedMessage}>✅ Produit ajouté au panier</div>}

          <button
            onClick={addToCart}
            disabled={isOutOfStock}
            style={{
              ...styles.button,
              ...(isOutOfStock ? styles.buttonDisabled : {}),
            }}
          >
            {isOutOfStock ? "Indisponible" : added ? "Ajouté ✓" : "Ajouter au panier"}
          </button>
        </section>
      </div>

      {lightboxOpen && (
        <div style={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              style={styles.lightboxClose}
              aria-label="Fermer"
            >
              ×
            </button>

            <button
              type="button"
              onClick={previousImage}
              style={styles.lightboxArrowLeft}
              aria-label="Image précédente"
            >
              ‹
            </button>

            <img
              src={images[activeImage] || images[0] || ""}
              alt={product.name}
              style={styles.lightboxImage}
            />

            <button
              type="button"
              onClick={nextImage}
              style={styles.lightboxArrowRight}
              aria-label="Image suivante"
            >
              ›
            </button>

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
    background: "#F6E8D3",
    color: "#3B342D",
    padding: "40px",
    fontFamily: "Arial",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  pageMobile: {
    padding: "22px 16px 34px",
  },

  back: {
    color: "#B77A2D",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
    marginBottom: "30px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "40px",
    alignItems: "start",
  },

  layoutMobile: {
    gridTemplateColumns: "1fr",
    gap: "22px",
  },

  gallery: {
    position: "relative",
    width: "100%",
  },

  soldOutBadge: {
    position: "absolute",
    top: "18px",
    left: "18px",
    zIndex: 2,
    background: "#D96A5A",
    color: "#2D2925",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: "bold",
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
    maxHeight: "640px",
    objectFit: "contain",
    borderRadius: "18px",
    border: "1px solid #D7B98F",
    background: "#FBF1E2",
    display: "block",
  },

  imageDisabled: {
    opacity: 0.55,
    filter: "grayscale(0.5)",
  },

  arrowLeft: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(45,41,37,0.62)",
    color: "#fff",
    fontSize: "34px",
    cursor: "pointer",
  },

  arrowRight: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(45,41,37,0.62)",
    color: "#fff",
    fontSize: "34px",
    cursor: "pointer",
  },

  imageCounter: {
    textAlign: "center",
    color: "#817367",
    fontSize: "14px",
    marginTop: "10px",
  },

  info: {
    background: "#FBF1E2",
    border: "1px solid #D7B98F",
    borderRadius: "18px",
    padding: "30px",
    minWidth: 0,
  },

  title: {
    color: "#B77A2D",
    fontSize: "42px",
    marginBottom: "10px",
  },

  titleMobile: {
    fontSize: "32px",
  },

  price: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "16px",
  },

  stockBox: {
    background: "#F6E8D3",
    border: "1px solid #D7B98F",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "22px",
    color: "#B77A2D",
    fontWeight: "bold",
  },

  stockWarning: {
    color: "#B8741A",
  },

  stockDanger: {
    color: "#D96A5A",
  },

  description: {
    color: "#746457",
    lineHeight: "1.7",
    fontSize: "17px",
    marginBottom: "25px",
  },

  label: {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    fontWeight: "bold",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #D7B98F",
    background: "#F6E8D3",
    color: "#fff",
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },

  qtyButton: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "none",
    background: "#B77A2D",
    cursor: "pointer",
    fontWeight: "bold",
  },

  disabledSmallButton: {
    background: "#C8B7A4",
    color: "#F1E1CB",
    cursor: "not-allowed",
  },

  qtyNumber: {
    minWidth: "30px",
    textAlign: "center",
    fontSize: "20px",
  },

  stockNote: {
    color: "#817367",
    fontSize: "14px",
    marginTop: "10px",
  },

  addedMessage: {
    marginTop: "20px",
    background: "#F6E8D3",
    border: "1px solid #B77A2D",
    color: "#B77A2D",
    borderRadius: "12px",
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
  },

  button: {
    marginTop: "18px",
    width: "100%",
    padding: "15px",
    background: "#B77A2D",
    color: "#2D2925",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "17px",
  },

  buttonDisabled: {
    background: "#C8B7A4",
    color: "#F1E1CB",
    cursor: "not-allowed",
  },

  lightbox: {
    position: "fixed",
    inset: 0,
    background: "rgba(45,41,37,0.88)",
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
    background: "#F6E8D3",
  },

  lightboxText: {
    color: "#3B342D",
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
    color: "#2D2925",
    fontSize: "26px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  lightboxArrowLeft: {
    position: "absolute",
    left: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 4,
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(224,171,92,0.95)",
    color: "#2D2925",
    fontSize: "34px",
    cursor: "pointer",
  },

  lightboxArrowRight: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 4,
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(224,171,92,0.95)",
    color: "#2D2925",
    fontSize: "34px",
    cursor: "pointer",
  },
};
