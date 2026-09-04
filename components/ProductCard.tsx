"use client";

import { useEffect, useState } from "react";

export default function ProductCard({
  product,
  addToCart,
}: {
  product: any;
  addToCart: (product: any) => void;
}) {
  const images = product.images || [];
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || ""
  );

  const [added, setAdded] = useState(false);

  const unlimitedStock = Boolean(product.unlimited_stock);
  const stock = Number(product.stock || 0);
  const isOutOfStock = !unlimitedStock && stock <= 0;

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

  function handleAddToCart() {
    if (isOutOfStock) return;

    addToCart({
      ...product,
      selectedColor,
    });

    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") previousImage();
      if (event.key === "ArrowRight") nextImage();
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, images.length]);

  return (
    <div style={styles.card}>
      {isOutOfStock && <div style={styles.soldOutBadge}>Rupture de stock</div>}

      {added && <div style={styles.addedBadge}>Ajouté ✓</div>}

      <div style={styles.gallery}>
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

      <a href={`/product/${product.id}`} style={styles.titleLink}>
        <h3 style={styles.name}>{product.name}</h3>
      </a>

      {product.description && (
        <p style={styles.description}>
          {product.description.length > 120
            ? product.description.slice(0, 120) + "..."
            : product.description}
        </p>
      )}

      <div style={styles.stockLine}>
        {unlimitedStock ? (
          <span>♾️ Fabrication à la demande</span>
        ) : isOutOfStock ? (
          <span style={styles.stockDanger}>⚠️ Indisponible</span>
        ) : stock <= 3 ? (
          <span style={styles.stockWarning}>🔥 Plus que {stock} disponible(s)</span>
        ) : (
          <span>📦 Disponible</span>
        )}
      </div>

      {product.colors?.length > 0 && (
        <div style={styles.colorsBlock}>
          <p style={styles.label}>Couleur</p>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={styles.select}
            disabled={isOutOfStock}
          >
            {product.colors.map((color: string) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </div>
      )}

      <p style={styles.price}>{Number(product.price || 0).toFixed(2)} €</p>

      <div style={styles.buttons}>
        <a href={`/product/${product.id}`} style={styles.detailsButton}>
          Voir le produit
        </a>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{
            ...styles.cartButton,
            ...(isOutOfStock ? styles.cartButtonDisabled : {}),
          }}
        >
          {isOutOfStock ? "Indisponible" : added ? "Ajouté ✓" : "Ajouter"}
        </button>
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
    </div>
  );
}

const styles: any = {
  card: {
    position: "relative",
    background: "#FBF1E2",
    border: "1px solid #D7B98F",
    borderRadius: "16px",
    padding: "14px",
    color: "#3B342D",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  soldOutBadge: {
    position: "absolute",
    top: "16px",
    left: "16px",
    zIndex: 2,
    background: "#D96A5A",
    color: "#2D2925",
    padding: "7px 10px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "13px",
  },

  addedBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    zIndex: 2,
    background: "#B77A2D",
    color: "#FFF8EE",
    padding: "7px 10px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "13px",
  },

  gallery: {
    position: "relative",
    width: "100%",
  },

  imageButton: {
    width: "100%",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "zoom-in",
    display: "block",
  },

  mainImage: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    borderRadius: "12px",
    display: "block",
  },

  imageDisabled: {
    opacity: 0.55,
    filter: "grayscale(0.5)",
  },

  arrowLeft: {
    position: "absolute",
    left: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(45,41,37,0.60)",
    color: "#fff",
    fontSize: "28px",
    cursor: "pointer",
  },

  arrowRight: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(45,41,37,0.60)",
    color: "#fff",
    fontSize: "28px",
    cursor: "pointer",
  },

  imageCounter: {
    textAlign: "center",
    color: "#817367",
    fontSize: "13px",
    marginTop: "8px",
  },

  titleLink: {
    textDecoration: "none",
    color: "#B77A2D",
  },

  name: {
    marginTop: "14px",
    marginBottom: "8px",
  },

  description: {
    fontSize: "14px",
    color: "#746457",
    lineHeight: "1.5",
    minHeight: "45px",
  },

  stockLine: {
    marginTop: "8px",
    color: "#817367",
    fontSize: "14px",
    fontWeight: "bold",
  },

  stockWarning: {
    color: "#B8741A",
  },

  stockDanger: {
    color: "#D96A5A",
  },

  colorsBlock: {
    marginTop: "10px",
  },

  label: {
    marginBottom: "6px",
    fontWeight: "bold",
  },

  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #D7B98F",
    background: "#F4E4CE",
    color: "#3B342D",
  },

  price: {
    marginTop: "15px",
    fontSize: "22px",
    color: "#B77A2D",
    fontWeight: "bold",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },

  detailsButton: {
    flex: 1,
    textAlign: "center",
    padding: "11px",
    background: "#C18A45",
    color: "#FFF8EE",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  cartButton: {
    flex: 1,
    padding: "11px",
    background: "#B77A2D",
    color: "#FFF8EE",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cartButtonDisabled: {
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
    width: "min(980px, 100%)",
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
    color: "#FFF8EE",
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
