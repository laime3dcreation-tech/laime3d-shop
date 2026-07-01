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

  function handleAddToCart() {
    addToCart({
      ...product,
      selectedColor,
    });
  }

  return (
    <div style={styles.card}>
      <a
        href={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={product.images?.[activeImage]}
          alt={product.name}
          style={styles.mainImage}
        />
      </a>

      <div style={styles.thumbs}>
        {product.images?.map((img: string, index: number) => (
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

      <a
        href={`/product/${product.id}`}
        style={styles.titleLink}
      >
        <h3 style={styles.name}>{product.name}</h3>
      </a>

      {product.description && (
        <p style={styles.description}>
          {product.description.length > 90
            ? product.description.slice(0, 90) + "..."
            : product.description}
        </p>
      )}

      {product.colors?.length > 0 && (
        <div style={styles.colorsBlock}>
          <p style={styles.label}>Couleur</p>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={styles.select}
          >
            {product.colors.map((color: string) => (
              <option key={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      )}

      <p style={styles.price}>{product.price} €</p>

      <div style={styles.buttons}>
        <a
          href={`/product/${product.id}`}
          style={styles.detailsButton}
        >
          Voir le produit
        </a>

        <button
          onClick={handleAddToCart}
          style={styles.cartButton}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  card: {
    background: "#102a1c",
    border: "1px solid #1f4d33",
    borderRadius: "16px",
    padding: "14px",
    color: "#e8f5e9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  mainImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
    cursor: "pointer",
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
};