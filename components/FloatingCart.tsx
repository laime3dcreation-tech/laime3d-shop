"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const FREE_SHIPPING_FROM = 69;
const DEFAULT_DELIVERY_PRICE = 4.9;

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

  const productsTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const deliveryPrice =
    productsTotal >= FREE_SHIPPING_FROM || productsTotal === 0
      ? 0
      : DEFAULT_DELIVERY_PRICE;

  const finalTotal = productsTotal + deliveryPrice;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_FROM - productsTotal
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
                {productsTotal < FREE_SHIPPING_FROM ? (
                  <div style={styles.freeShippingInfo}>
                    Encore{" "}
                    <b>{remainingForFreeShipping.toFixed(2).replace(".", ",")}€</b>{" "}
                    pour profiter de la livraison offerte 🎁
                  </div>
                ) : (
                  <div style={styles.freeShippingSuccess}>
                    🎉 Livraison offerte !
                  </div>
                )}

                <div style={styles.items}>
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.selectedColor}-${index}`}
                      style={styles.item}
                    >
                      {item.images?.[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          style={styles.itemImage}
                        />
                      )}

                      <div style={styles.itemContent}>
                        <div style={styles.itemTop}>
                          <div>
                            <strong>{item.name}</strong>

                            {item.selectedColor && (
                              <p style={styles.color}>
                                Couleur : {item.selectedColor}
                              </p>
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
                            <button
                              onClick={() => decreaseQty(index)}
                              style={styles.qtyButton}
                            >
                              −
                            </button>

                            <span style={styles.qtyNumber}>{item.qty}</span>

                            <button
                              onClick={() => increaseQty(index)}
                              style={styles.qtyButton}
                            >
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

                <div style={styles.totalRow}>
                  <span>Sous-total</span>
                  <strong>{productsTotal.toFixed(2).replace(".", ",")}€</strong>
                </div>

                <div style={styles.totalRow}>
                  <span>Livraison estimée</span>
                  <strong>
                    {deliveryPrice === 0
                      ? "Offerte"
                      : `${deliveryPrice.toFixed(2).replace(".", ",")}€`}
                  </strong>
                </div>

                <p style={styles.deliveryNote}>
                  Le mode de livraison exact sera confirmé à l’étape suivante.
                </p>

                <hr style={styles.separator} />

                <div style={styles.total}>
                  <span>Total estimé</span>
                  <strong>{finalTotal.toFixed(2).replace(".", ",")}€</strong>
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
    background: "#B77A2D",
    color: "#2D2925",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
    fontWeight: "bold",
    zIndex: 9998,
    boxShadow: "0 10px 30px rgba(91,61,31,0.16)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  floatingButtonActive: {
    transform: "scale(1.05)",
    boxShadow: "0 14px 35px rgba(201,138,46,0.22)",
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#C95A4A",
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
    background: "rgba(45,41,37,0.60)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "flex-end",
  },

  drawer: {
    width: "420px",
    maxWidth: "100vw",
    minHeight: "100vh",
    maxHeight: "100vh",
    overflowY: "auto",
    background: "#FBF1E2",
    color: "#3B342D",
    padding: "28px",
    position: "relative",
    borderLeft: "1px solid #D7B98F",
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
    color: "#B77A2D",
    marginBottom: "24px",
  },

  freeShippingInfo: {
    background: "#EFD8B7",
    color: "#B8741A",
    padding: "14px",
    borderRadius: "12px",
    lineHeight: "1.5",
    marginBottom: "16px",
  },

  freeShippingSuccess: {
    background: "#EFD8B7",
    color: "#B77A2D",
    padding: "14px",
    borderRadius: "12px",
    lineHeight: "1.5",
    marginBottom: "16px",
    fontWeight: "bold",
  },

  items: {
    display: "grid",
    gap: "14px",
  },

  item: {
    display: "flex",
    gap: "12px",
    background: "#F6E8D3",
    border: "1px solid #D7B98F",
    borderRadius: "14px",
    padding: "12px",
    boxSizing: "border-box",
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
    minWidth: 0,
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
    background: "#D96A5A",
    color: "#2D2925",
    cursor: "pointer",
    fontWeight: "bold",
    flexShrink: 0,
  },

  color: {
    color: "#B77A2D",
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
    background: "#B77A2D",
    color: "#2D2925",
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
    borderTop: "1px solid #D7B98F",
    margin: "18px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "10px",
  },

  deliveryNote: {
    color: "#817367",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "8px 0 0",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "22px",
    marginTop: "18px",
    color: "#B77A2D",
  },

  checkout: {
    display: "block",
    marginTop: "24px",
    padding: "14px",
    background: "#B77A2D",
    color: "#2D2925",
    borderRadius: "12px",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: "bold",
  },

  continueButton: {
    width: "100%",
    marginTop: "12px",
    padding: "13px",
    background: "#D7B98F",
    color: "#3B342D",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
