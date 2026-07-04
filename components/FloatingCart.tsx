"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FloatingCart() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  function loadCartCount() {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];

    const totalCount = cart.reduce(
      (sum: number, item: any) => sum + Number(item.qty || 0),
      0
    );

    setCount(totalCount);
  }

  useEffect(() => {
    loadCartCount();

    window.addEventListener("storage", loadCartCount);
    window.addEventListener("cart-updated", loadCartCount);

    const interval = setInterval(loadCartCount, 700);

    return () => {
      window.removeEventListener("storage", loadCartCount);
      window.removeEventListener("cart-updated", loadCartCount);
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

  return (
    <a href="/checkout" style={styles.cartButton} aria-label="Voir le panier">
      🛒
      {count > 0 && <span style={styles.badge}>{count}</span>}
    </a>
  );
}

const styles: any = {
  cartButton: {
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
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
};
