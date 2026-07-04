"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FloatingCart() {
  const pathname = usePathname();
  const [cart, setCart] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  function loadCart() {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("cart");
    const parsedCart = saved ? JSON.parse(saved) : [];

    setCart(parsedCart);

    if (parsedCart.length === 0) {
      setOpen(false);
    }
  }

  function saveCart(updatedCart: any[]) {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    window.dispatchEvent(new Event("cart-updated"));

    if (updatedCart.length === 0) {
      setOpen(false);
    }
  }

  function increaseQty(index: number) {
    const updatedCart = cart.map((item, itemIndex) =>
      itemIndex === index ? { ...item, qty: Number(item.qty || 1) + 1 } : item
    );

    saveCart(updatedCart);
  }

  function decreaseQty(index: number) {
    const updatedCart = cart
      .map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, qty: Math.max(0, Number(item.qty || 1) - 1) }
          : item
      )
      .filter((item) => Number(item.qty || 0) > 0);

    saveCart(updatedCart);
  }

  function removeItem(index: number) {
    const updatedCart = cart.filter((_, itemIndex) => itemIndex !== index);
    saveCart(updatedCart);
  }

  function continueShopping() {
    setOpen(false);

    if (
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/success") ||
      pathname.startsWith("/cancel")
    ) {
      window.location.href = "/shop";
    }
  }

  useEffect(() => {
    loadCart();

    window.addEventListener("storage", loadCart);
    window.addEventListener("cart-updated", loadCart);

    const interval = setInterval(loadCart, 700);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cart-updated", loadCart);
      clearInterval(interval);
    };
  }, []);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/success") ||
    pathname.startsWith("/cancel")
  ) {
    return null;
  }

  const count = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          ...styles.floatingButton,
          ...(count > 0 ? styles.floatingButtonActive : {}),
        }}
        aria-label="Ouvrir le panier"
      >
        🛒
        {count > 0 && <span style={styles.badge}>{count}</span>}
      </button>

      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.drawer} onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={styles.close}>
              ×
            </button>

            <h2 style={styles.title}>Votre panier</h2>

            {cart.length === 0 ? (
              <div>
                <p>Votre panier est vide.</p>

                <button onClick={continueShopping} style={styles.continueButton}>
                  ← Continuer mes achats
                </button>
              </div>
            ) : (
              <>
                <div style={styles.items}>
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item.selectedColor}-${index}`} style={styles.item}>
                      {item.images?.[0] && (
                        <img src={item.images[0]} alt={item.name} style={styles.itemImage} />
                      )}

                      <div style={styles.itemContent}>
                        <div style={styles.itemTop}>
                          <div>
                            <strong>{item.name}</strong>

                            {item.selectedColor && (
                              <p style={styles.color}>Couleur : {item.selectedColor}</p>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(index)}
                            style={styles.removeButton}
                            aria-label="Supprimer"
                          >
                            ×
                          </button>
                        </div>

                        <div style={styles.itemBottom}>
                          <div style={styles.qtyControls}>
                            <button onClick={() => decreaseQty(index)} style={styles.qtyButton}>
                              −
                            </button>

                            <span style={styles.qtyNumber}>{item.qty}</span>

                            <button onClick={() => increaseQty(index)} style={styles.qtyButton}>
                              +
                            </button>
                          </div>

                          <strong>
                            {(Number(item.price || 0) * Number(item.qty || 0))
                              .toFixed(2)
                              .replace(".", ",")}
                            €
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr style={styles.separator} />

                <div style={styles.total}>
                  <span>Total</span>
                  <strong>{total.toFixed(2).replace(".", ",")}€</strong>
                </div>

                <a href="/checkout" style={styles.checkout}>
                  Finaliser ma commande
                </a>

                <button onClick={continueShopping} style={styles.continueButton}>
                  ← Continuer mes achats
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles: any = {
  floatingButton: {
    position: "fixed",
    right: "22px",
    bottom: "22px",
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
    fontWeight: "bold",
    zIndex: 9998,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  floatingButtonActive: {
    transform: "scale(1.05)",
    boxShadow: "0 14px 35px rgba(124,255,155,0.28)",
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#ff5c5c",
    color: "#fff",
    minWidth: "24px",
    height: "24px",
    padding: "0 6px",
    borderRadius: "999px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "flex-end",
  },

  drawer: {
    width: "420px",
    maxWidth: "100%",
    minHeight: "100vh",
    maxHeight: "100vh",
    overflowY: "auto",
    background: "#10251a",
    color: "#e8f5e9",
    padding: "28px",
    position: "relative",
    borderLeft: "1px solid #1f4d33",
  },

  close: {
    position: "absolute",
    top: "14px",
    right: "18px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "30px",
    cursor: "pointer",
  },

  title: {
    color: "#7CFF9B",
    marginBottom: "24px",
  },

  items: {
    display: "grid",
    gap: "14px",
  },

  item: {
    display: "flex",
    gap: "12px",
    background: "#0b1f14",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "12px",
  },

  itemImage: {
    width: "76px",
    height: "76px",
    objectFit: "cover",
    borderRadius: "10px",
    flexShrink: 0,
  },

  itemContent: {
    flex: 1,
    display: "grid",
    gap: "12px",
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },

  removeButton: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "none",
    background: "#ff8a8a",
    color: "#03140a",
    cursor: "pointer",
    fontWeight: "bold",
    flexShrink: 0,
  },

  color: {
    color: "#7CFF9B",
    fontSize: "13px",
    margin: "5px 0 0",
  },

  itemBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },

  qtyControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  qtyButton: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    background: "#7CFF9B",
    color: "#03140a",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
  },

  qtyNumber: {
    minWidth: "24px",
    textAlign: "center",
    fontWeight: "bold",
  },

  separator: {
    border: "none",
    borderTop: "1px solid #1f4d33",
    margin: "20px 0",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "22px",
    marginTop: "18px",
    color: "#7CFF9B",
  },

  checkout: {
    display: "block",
    marginTop: "24px",
    padding: "14px",
    background: "#7CFF9B",
    color: "#03140a",
    borderRadius: "12px",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: "bold",
  },

  continueButton: {
    width: "100%",
    marginTop: "12px",
    padding: "13px",
    background: "#1f4d33",
    color: "#e8f5e9",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
