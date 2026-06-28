"use client";

import { useState } from "react";

export default function ProductCard({ product, addToCart }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div
      style={{
        background: "#102a1c",
        border: "1px solid #1f4d33",
        borderRadius: "14px",
        padding: "12px",
        color: "#e8f5e9",
      }}
    >
      {/* IMAGE */}
      <img
        src={product.images[activeImage]}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

      {/* THUMBS */}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => setActiveImage(index)}
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              cursor: "pointer",
              border:
                index === activeImage
                  ? "2px solid #7CFF9B"
                  : "1px solid transparent",
              borderRadius: 6,
            }}
          />
        ))}
      </div>

      {/* INFO */}
      <h3 style={{ marginTop: 10 }}>{product.name}</h3>
      <p style={{ color: "#7CFF9B", fontWeight: "bold" }}>
        {product.price} €
      </p>

      <button
        onClick={() => addToCart(product)}
        style={{
          marginTop: 10,
          width: "100%",
          padding: 8,
          background: "#7CFF9B",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}