"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");

  function login() {
    document.cookie = `admin_password=${password}; path=/; max-age=86400`;
    window.location.href = "/admin/orders";
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1>🔐 Admin Laime3D</h1>

        <p style={styles.text}>
          Entrez le mot de passe administrateur
        </p>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.button}>
          Se connecter
        </button>
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
    fontFamily: "Arial",
  },

  card: {
    background: "#10251a",
    padding: "35px",
    borderRadius: "16px",
    width: "360px",
    color: "#e8f5e9",
    boxShadow: "0 0 25px rgba(0,0,0,0.35)",
  },

  text: {
    marginTop: "10px",
    marginBottom: "20px",
    color: "#b8d9c4",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    marginBottom: "15px",
    background: "#0b1f14",
    color: "#fff",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#7CFF9B",
    color: "#0b1f14",
    fontWeight: "bold",
    cursor: "pointer",
  },
};