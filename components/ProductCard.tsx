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
      <img
        src={product.images?.[activeImage]}
        alt={product.name}
        style={styles.mainImage}
      />

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

      <h3 style={styles.name}>{product.name}</h3>

      {product.description && (
        <p style={styles.description}>{product.description}</p>
      )}

      {product.colors?.length > 0 && (
        <div style={styles.colorsBlock}>
          <p style={styles.label}>Couleur :</p>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={styles.select}
          >
            {product.colors.map((color: string) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      )}

      <p style={styles.price}>{product.price} €</p>

      <button onClick={handleAddToCart} style={styles.button}>
        Ajouter au panier
      </button>
    </div>
  );
}

const styles: any = {
  card: {
    background: "#102a1c",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "12px",
    color: "#e8f5e9",
  },

  mainImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  thumbs: {
    display: "flex",
    gap: 6,
    marginTop: 10,
    flexWrap: "wrap",
  },

  thumb: {
    width: 40,
    height: 40,
    objectFit: "cover",
    cursor: "pointer",
    borderRadius: 6,
  },

  name: {
    marginTop: 10,
  },

  description: {
    color: "#c8facc",
    fontSize: "14px",
    lineHeight: "1.4",
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
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    background: "#0b1f14",
    color: "#fff",
  },

  price: {
    color: "#7CFF9B",
    fontWeight: "bold",
    marginTop: "12px",
  },

  button: {
    marginTop: 10,
    width: "100%",
    padding: 8,
    background: "#7CFF9B",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};