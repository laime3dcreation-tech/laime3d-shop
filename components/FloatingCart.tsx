"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FloatingCart() {
  const pathname = usePathname();
  const [cart, setCart] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  function loadCart() {
    const saved = localStorage.getItem("cart");
    setCart(saved ? JSON.parse(saved) : []);
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
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  return (
    <>
      <button onClick={() => setOpen(true)} style={styles.floatingButton}>
        🛒
        {count > 0 && <span style={styles.badge}>{count}</span>}
      </button>

      {open && (
        <div style={styles.overlay}>
          <div style={styles.drawer}>
            <button onClick={() => setOpen(false)} style={styles.close}>
              ×
            </button>

            <h2 style={styles.title}>Votre panier</h2>

            {cart.length === 0 ? (
              <p>Votre panier est vide.</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} style={styles.item}>
                    <div>
                      <strong>{item.name}</strong>
                      {item.selectedColor && (
                        <p style={styles.color}>
                          Couleur : {item.selectedColor}
                        </p>
                      )}
                      <p>Quantité : {item.qty}</p>
                    </div>

                    <strong>{Number(item.price) * item.qty}€</strong>
                  </div>
                ))}

                <hr />

                <div style={styles.total}>
                  <span>Total</span>
                  <strong>{total.toFixed(2).replace(".", ",")}€</strong>
                </div>

                <a href="/checkout" style={styles.checkout}>
                  Finaliser ma commande
                </a>
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
    width: "380px",
    maxWidth: "100%",
    minHeight: "100vh",
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

  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "16px",
  },

  color: {
    color: "#7CFF9B",
    fontSize: "13px",
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
};
