"use client";

import { useEffect } from "react";

export default function Cancel() {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>❌ Оплата отменена</h1>
      <p>Вы можете попробовать снова.</p>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#0b1f14",
    color: "#e8f5e9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },
  title: {
    color: "#ff6b6b",
    fontSize: "32px",
  },
};