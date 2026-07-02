"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const FREE_SHIPPING_FROM = 69;
const MONDIAL_RELAY_PRICE = 4.9;

export default function FloatingCart() {
  const pathname = usePathname();
  const [cart, setCart] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  function loadCart() {
    const saved = localStorage.getItem("cart");
    setCart(saved ? JSON.parse(saved) : []);
  }

  function saveCart(updatedCart: any[]) {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  function increaseQty(id: string, selectedColor: string) {
    const updatedCart = cart.map((item) =>
      item.id === id && item.selectedColor === selectedColor
        ? { ...item, qty: item.qty + 1 }
        : item
    );

    saveCart(updatedCart);
  }

  function decreaseQty(id: string, selectedColor: string) {
    const updatedCart = cart
      .map((item) =>
        item.id === id && item.selectedColor === selectedColor
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0);

    saveCart(updatedCart);
  }

  function removeItem(id: string, selectedColor: string) {
    const updatedCart = cart.filter(
      (item) => !(item.id === id && item.selectedColor === selectedColor)
    );

    saveCart(updatedCart);
  }

  function clearCart() {
    saveCart([]);
  }

  useEffect(() => {
    loadCart();

    const interval = setInterval(loadCart, 500);

    return () => clearInterval(interval);
  }, []);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/success") ||
    pathname.startsWith("/cancel")
  ) {
    return null;
  }

  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const deliveryPrice =
    subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : MONDIAL_RELAY_PRICE;

  const total = subtotal + deliveryPrice;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  return (
    <>
      <button onClick={() => setOpen(true)} style={styles.floatingButton}>
        🛒
        {count > 0 && <span style={styles.badge}>{count}</span>}
      </button>

      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={styles.close}>
              ×
            </button>

            <h2 style={styles.title}>Votre panier</h2>

            {cart.length === 0 ? (
              <div style={styles.emptyBox}>
                <p>Votre panier est vide.</p>

                <a href="/shop" style={styles.checkout}>
                  Découvrir la boutique
                </a>
              </div>
            ) : (
              <>
                {subtotal < FREE_SHIPPING_FROM ? (
                  <p style={styles.freeShippingInfo}>
                    Encore{" "}
                    <b>{remainingForFreeShipping.toFixed(2).replace(".", ",")}€</b>{" "}
                    pour profiter de la livraison offerte 🎁
                  </p>
                ) : (
                  <p style={styles.freeShippingSuccess}>
                    🎉 Livraison offerte !
                  </p>
                )}

                <div style={styles.itemsList}>
                  {cart.map((item, index) => {
                    const itemTotal = Number(item.price) * item.qty;

                    return (
                      <div key={index} style={styles.item}>
                        {item.images?.[0] && (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            style={styles.image}
                          />
                        )}

                        <div style={styles.itemInfo}>
                          <strong>{item.name}</strong>

                          {item.selectedColor && (
                            <p style={styles.color}>
                              Couleur : {item.selectedColor}
                            </p>
                          )}

                          <div style={styles.qtyRow}>
                            <button
                              onClick={() =>
                                decreaseQty(item.id, item.selectedColor)
                              }
                              style={styles.qtyButton}
                            >
                              −
                            </button>

                            <span style={styles.qtyNumber}>{item.qty}</span>

                            <button
                              onClick={() =>
                                increaseQty(item.id, item.selectedColor)
                              }
                              style={styles.qtyButton}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeItem(item.id, item.selectedColor)
                            }
                            style={styles.remove}
                          >
                            Supprimer
                          </button>
                        </div>

                        <strong style={styles.itemPrice}>
                          {itemTotal.toFixed(2).replace(".", ",")}€
                        </strong>
                      </div>
                    );
                  })}
                </div>

                <div style={styles.summary}>
                  <div style={styles.summaryRow}>
                    <span>Sous-total</span>
                    <strong>{subtotal.toFixed(2).replace(".", ",")}€</strong>
                  </div>

                  <div style={styles.summaryRow}>
                    <span>Livraison estimée</span>
                    <strong>
                      {deliveryPrice === 0
                        ? "Offerte"
                        : `${deliveryPrice.toFixed(2).replace(".", ",")}€`}
                    </strong>
                  </div>

                  <div style={styles.total}>
                    <span>Total estimé</span>
                    <strong>{total.toFixed(2).replace(".", ",")}€</strong>
                  </div>
                </div>

                <a href="/checkout" style={styles.checkout}>
                  Finaliser ma commande
                </a>

                <button onClick={clearCart} style={styles.clearButton}>
                  Vider le panier
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
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#ff5c5c",
    color: "#fff",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
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
    width: "430px",
    maxWidth: "100%",
    minHeight: "100vh",
    maxHeight: "100vh",
    overflowY: "auto",
    background: "#10251a",
    color: "#e8f5e9",
    padding: "28px",
    position: "relative",
    borderLeft: "1px solid #1f4d33",
    boxSizing: "border-box",
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

  emptyBox: {
    display: "grid",
    gap: "18px",
  },

  freeShippingInfo: {
    color: "#ffd166",
    background: "#1a2d19",
    padding: "12px",
    borderRadius: "10px",
    lineHeight: "1.5",
  },

  freeShippingSuccess: {
    color: "#7CFF9B",
    background: "#12301f",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "bold",
  },

  itemsList: {
    display: "grid",
    gap: "16px",
  },

  item: {
    display: "grid",
    gridTemplateColumns: "64px 1fr auto",
    gap: "12px",
    alignItems: "start",
    paddingBottom: "16px",
    borderBottom: "1px solid #1f4d33",
  },

  image: {
    width: "64px",
    height: "64px",
    objectFit: "cover",
    borderRadius: "10px",
    background: "#0b1f14",
  },

  itemInfo: {
    display: "grid",
    gap: "6px",
  },

  color: {
    color: "#7CFF9B",
    fontSize: "13px",
    margin: 0,
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
  },

  qtyButton: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "none",
    background: "#7CFF9B",
    color: "#03140a",
    cursor: "pointer",
    fontWeight: "bold",
  },

  qtyNumber: {
    minWidth: "20px",
    textAlign: "center",
    fontWeight: "bold",
  },

  remove: {
    marginTop: "4px",
    background: "transparent",
    border: "none",
    color: "#ff8a8a",
    cursor: "pointer",
    textAlign: "left",
    padding: 0,
    fontWeight: "bold",
  },

  itemPrice: {
    color: "#7CFF9B",
    whiteSpace: "nowrap",
  },

  summary: {
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #1f4d33",
    display: "grid",
    gap: "10px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "22px",
    marginTop: "8px",
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

  clearButton: {
    marginTop: "12px",
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#ff8a8a",
    border: "1px solid #ff8a8a",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};