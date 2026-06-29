"use client";

import { useEffect } from "react";

export default function Success() {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎉 Paiement réussi !</h1>

        <p style={styles.text}>
          Merci pour votre commande.
        </p>

        <p style={styles.text}>
          Nous avons bien reçu votre paiement et votre commande est maintenant en cours de traitement.
        </p>

        <a href="/shop">
          <button style={styles.button}>
            ← Retour à la boutique
          </button>
        </a>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#0b1f14",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial",
  },

  card: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "40px",
    maxWidth: "600px",
    textAlign: "center",
    color: "#e8f5e9",
  },

  title: {
    color: "#7CFF9B",
    fontSize: "36px",
    marginBottom: "20px",
  },

  text: {
    fontSize: "18px",
    lineHeight: "1.7",
    marginBottom: "15px",
  },

  button: {
    marginTop: "25px",
    padding: "14px 24px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
};