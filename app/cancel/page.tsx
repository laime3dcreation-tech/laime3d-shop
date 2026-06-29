"use client";

import Link from "next/link";

export default function Cancel() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>❌ Paiement annulé</h1>

        <p style={styles.text}>
          Votre paiement n'a pas été finalisé.
        </p>

        <p style={styles.text}>
          Aucune commande n'a été enregistrée. Vous pouvez revenir à la boutique
          et réessayer à tout moment.
        </p>

        <Link href="/shop">
          <button style={styles.button}>
            ← Retour à la boutique
          </button>
        </Link>
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
    color: "#ff6b6b",
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