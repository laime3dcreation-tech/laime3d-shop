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

  if (!product) {
    return (
      <main style={styles.page}>
        <p>Chargement du produit...</p>
      </main>
    );
  }

  const unlimitedStock = Boolean(product.unlimited_stock);
  const stock = Number(product.stock || 0);
  const isOutOfStock = !unlimitedStock && stock <= 0;
  const maxQty = unlimitedStock ? 99 : Math.max(1, stock);

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
                ? item.qty + finalQty
                : Math.min(item.qty + finalQty, stock),
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
    window.location.href = "/shop";
  }

  return (
    <main style={styles.page}>
      <a href="/shop" style={styles.back}>
        ← Retour à la boutique
      </a>

      <div style={styles.layout}>
        <section>
          <div style={styles.imageWrapper}>
            {isOutOfStock && (
              <div style={styles.soldOutBadge}>Rupture de stock</div>
            )}

            <img
              src={product.images?.[activeImage] || product.images?.[0] || ""}
              alt={product.name}
              style={{
                ...styles.mainImage,
                ...(isOutOfStock ? styles.imageDisabled : {}),
              }}
            />
          </div>

          {product.images?.length > 1 && (
            <div style={styles.thumbs}>
              {product.images.map((img: string, index: number) => (
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
          )}
        </section>

        <section style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>

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

          <button
            onClick={addToCart}
            disabled={isOutOfStock}
            style={{
              ...styles.button,
              ...(isOutOfStock ? styles.buttonDisabled : {}),
            }}
          >
            {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
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

  imageWrapper: {
    position: "relative",
  },

  soldOutBadge: {
    position: "absolute",
    top: "18px",
    left: "18px",
    zIndex: 2,
    background: "#ff8a8a",
    color: "#03140a",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: "bold",
  },

  mainImage: {
    width: "100%",
    maxHeight: "560px",
    objectFit: "cover",
    borderRadius: "18px",
    border: "1px solid #1f4d33",
  },

  imageDisabled: {
    opacity: 0.55,
    filter: "grayscale(0.5)",
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
    marginBottom: "16px",
  },

  stockBox: {
    background: "#0b1f14",
    border: "1px solid #1f4d33",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "22px",
    color: "#7CFF9B",
    fontWeight: "bold",
  },

  stockWarning: {
    color: "#ffd166",
  },

  stockDanger: {
    color: "#ff8a8a",
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

  disabledSmallButton: {
    background: "#62756a",
    color: "#d4ddd7",
    cursor: "not-allowed",
  },

  qtyNumber: {
    minWidth: "30px",
    textAlign: "center",
    fontSize: "20px",
  },

  stockNote: {
    color: "#b8d9c4",
    fontSize: "14px",
    marginTop: "10px",
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

  buttonDisabled: {
    background: "#62756a",
    color: "#d4ddd7",
    cursor: "not-allowed",
  },
};