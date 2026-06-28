"use client";

import { useEffect } from "react";

export default function Success() {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>🎉 Оплата прошла успешно!</h1>
      <p>Спасибо за заказ. Мы уже начали его обработку.</p>
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
    color: "#7CFF9B",
    fontSize: "32px",
  },
};