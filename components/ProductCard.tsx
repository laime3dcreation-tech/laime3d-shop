"use client";

import { useState } from "react";

export default function ProductCard({
  product,
  addToCart,
}: {
  product: any;
  addToCart: (product: any) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);

  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || ""
  );

  const unlimitedStock = Boolean(product.unlimited_stock);
  const stock = Number(product.stock || 0);
  const isOutOfStock = !unlimitedStock && stock <= 0;

  function handleAddToCart() {
    if (isOutOfStock) return;

    addToCart({
      ...product,
      selectedColor,
    });
  }

  return (
    <div style={styles.card}>
      {isOutOfStock && <div style={styles.soldOutBadge}>Rupture de stock</div>}

      <a
        href={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={product.images?.[activeImage] || product.images?.[0] || ""}
          alt={product.name}
          style={{
            ...styles.mainImage,
            ...(isOutOfStock ? styles.imageDisabled : {}),
          }}
        />
      </a>

      {product.images?.length > 1 && (
        <div style={styles.thumbs}>
          {product.images.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              alt={product.name}
              onClick={() => setActiveImage(index)}
              style={{
                ...styles.thumb,
                border:
                  index === activeImage
                    ? "2px solid #7CFF9B"
                    : "1px solid transparent",
              }}
            />
          ))}
        </div>
      )}

      <a href={`/product/${product.id}`} style={styles.titleLink}>
        <h3 style={styles.name}>{product.name}</h3>
      </a>

      {product.description && (
        <p style={styles.description}>
          {product.description.length > 90
            ? product.description.slice(0, 90) + "..."
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
          {isOutOfStock ? "Indisponible" : "Ajouter"}
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  card: {
    position: "relative",
    background: "#102a1c",
    border: "1px solid #1f4d33",
    borderRadius: "16px",
    padding: "14px",
    color: "#e8f5e9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  soldOutBadge: {
    position: "absolute",
    top: "16px",
    left: "16px",
    zIndex: 2,
    background: "#ff8a8a",
    color: "#03140a",
    padding: "7px 10px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "13px",
  },

  mainImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
    cursor: "pointer",
  },

  imageDisabled: {
    opacity: 0.55,
    filter: "grayscale(0.5)",
  },

  thumbs: {
    display: "flex",
    gap: "6px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  thumb: {
    width: "48px",
    height: "48px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
  },

  titleLink: {
    textDecoration: "none",
    color: "#7CFF9B",
  },

  name: {
    marginTop: "12px",
    marginBottom: "8px",
  },

  description: {
    fontSize: "14px",
    color: "#c8facc",
    lineHeight: "1.5",
    minHeight: "45px",
  },

  stockLine: {
    marginTop: "8px",
    color: "#b8d9c4",
    fontSize: "14px",
    fontWeight: "bold",
  },

  stockWarning: {
    color: "#ffd166",
  },

  stockDanger: {
    color: "#ff8a8a",
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
    border: "1px solid #1f4d33",
    background: "#0b1f14",
    color: "#fff",
  },

  price: {
    marginTop: "15px",
    fontSize: "22px",
    color: "#7CFF9B",
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
    background: "#1f4d33",
    color: "#ffffff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  cartButton: {
    flex: 1,
    padding: "11px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cartButtonDisabled: {
    background: "#62756a",
    color: "#d4ddd7",
    cursor: "not-allowed",
  },
};