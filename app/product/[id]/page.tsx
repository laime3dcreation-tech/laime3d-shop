"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);

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

  function addToCart() {
    if (!product) return;

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
          ? { ...item, qty: item.qty + qty }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          selectedColor,
          qty,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.href = "/shop";
  }

  if (!product) {
    return (
      <main style={styles.page}>
        <p>Chargement du produit...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <a href="/shop" style={styles.back}>
        ← Retour à la boutique
      </a>

      <div style={styles.layout}>
        <section>
          <img
            src={product.images?.[activeImage]}
            alt={product.name}
            style={styles.mainImage}
          />

          <div style={styles.thumbs}>
            {product.images?.map((img: string, index: number) => (
              <img
                key={img}
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
        </section>

        <section style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>

          <p style={styles.price}>{product.price} €</p>

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
              style={styles.qtyButton}
            >
              -
            </button>

            <span style={styles.qtyNumber}>{qty}</span>

            <button onClick={() => setQty(qty + 1)} style={styles.qtyButton}>
              +
            </button>
          </div>

          <button onClick={addToCart} style={styles.button}>
            Ajouter au panier
          </button>
        </section>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#0b1f14",
    color: "#e8f5e9",
    padding: "40px",
    fontFamily: "Arial",
  },

  back: {
    color: "#7CFF9B",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
    marginBottom: "30px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    alignItems: "start",
  },

  mainImage: {
    width: "100%",
    maxHeight: "560px",
    objectFit: "cover",
    borderRadius: "18px",
    border: "1px solid #1f4d33",
  },

  thumbs: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
    flexWrap: "wrap",
  },

  thumb: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer",
  },

  info: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "30px",
  },

  title: {
    color: "#7CFF9B",
    fontSize: "42px",
    marginBottom: "10px",
  },

  price: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  description: {
    color: "#c8facc",
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
    border: "1px solid #1f4d33",
    background: "#0b1f14",
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
    background: "#7CFF9B",
    cursor: "pointer",
    fontWeight: "bold",
  },

  qtyNumber: {
    minWidth: "30px",
    textAlign: "center",
    fontSize: "20px",
  },

  button: {
    marginTop: "28px",
    width: "100%",
    padding: "15px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "17px",
  },
};