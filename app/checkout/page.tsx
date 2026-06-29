"use client";

import { useEffect, useState } from "react";

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  async function order() {
    if (!name || !address || !email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          customer: {
            name,
            address,
            email,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data);
        alert("Erreur lors de la création du paiement.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur.");
    }
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Finaliser la commande</h1>

      <div style={styles.container}>
        <div style={styles.form}>
          <input
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <button style={styles.button} onClick={order}>
            Payer la commande
          </button>
        </div>

        <div style={styles.cart}>
          <h2>🛒 Votre commande</h2>

          {cart.length === 0 && <p>Votre panier est vide</p>}

          {cart.map((item) => (
            <div key={item.id} style={styles.item}>
              <span>
                {item.name} × {item.qty}
              </span>

              <span>{item.price * item.qty}€</span>
            </div>
          ))}

          <hr />

          <h3>Total : {total}€</h3>
        </div>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#0b1f14",
    color: "#e8f5e9",
    fontFamily: "Arial",
  },

  title: {
    fontSize: "36px",
    color: "#7CFF9B",
    marginBottom: "20px",
  },

  container: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  form: {
    flex: 1,
    minWidth: "280px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    background: "#102a1c",
    color: "#fff",
  },

  button: {
    padding: "12px",
    background: "#7CFF9B",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cart: {
    width: "300px",
    padding: "15px",
    background: "#0f2418",
    borderRadius: "12px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
};