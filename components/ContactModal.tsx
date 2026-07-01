"use client";

import { useState } from "react";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(e: any) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = e.currentTarget;

    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur d'envoi");
      }

      setSent(true);
      form.reset();
    } catch (err) {
      setError("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setOpen(false);
    setSent(false);
    setError("");
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={styles.mainButton}>
        Parlons de votre projet
      </button>

      {open && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={closeModal} style={styles.close}>
              ×
            </button>

            <h2 style={styles.title}>Une idée en tête ?</h2>

            {!sent ? (
              <>
                <p style={styles.intro}>
                  Vous rêvez d'une création unique ? Parlez-nous de votre idée,
                  nous serons ravis de vous répondre.
                </p>

                <form onSubmit={sendMessage} style={styles.form}>
                  <input
                    name="firstName"
                    placeholder="Prénom"
                    required
                    style={styles.input}
                  />

                  <input
                    name="lastName"
                    placeholder="Nom"
                    required
                    style={styles.input}
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    style={styles.input}
                  />

                  <input
                    name="phone"
                    placeholder="Téléphone"
                    style={styles.input}
                  />

                  <textarea
                    name="message"
                    placeholder="Votre idée..."
                    required
                    style={styles.textarea}
                  />

                  {error && <p style={styles.error}>{error}</p>}

                  <button disabled={loading} style={styles.submit}>
                    {loading ? "Envoi..." : "Envoyer"}
                  </button>
                </form>
              </>
            ) : (
              <div style={styles.successBox}>
                <h3 style={styles.successTitle}>Merci pour votre message !</h3>
                <p style={styles.success}>
                  Nous vous répondrons dès que possible.
                </p>

                <button onClick={closeModal} style={styles.submit}>
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles: any = {
  mainButton: {
    marginTop: "22px",
    padding: "14px 24px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modal: {
    position: "relative",
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "20px",
    padding: "30px",
    maxWidth: "520px",
    width: "100%",
    color: "#e8f5e9",
  },
  close: {
    position: "absolute",
    top: "12px",
    right: "16px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "28px",
    cursor: "pointer",
  },
  title: {
    color: "#7CFF9B",
    marginBottom: "12px",
  },
  intro: {
    color: "#c8facc",
    lineHeight: "1.6",
    marginBottom: "18px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    background: "#0b1f14",
    color: "#fff",
  },
  textarea: {
    padding: "12px",
    minHeight: "130px",
    borderRadius: "8px",
    border: "1px solid #1f4d33",
    background: "#0b1f14",
    color: "#fff",
    resize: "vertical",
  },
  submit: {
    padding: "13px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  successBox: {
    display: "grid",
    gap: "12px",
  },
  successTitle: {
    color: "#7CFF9B",
  },
  success: {
    fontSize: "18px",
    lineHeight: "1.6",
  },
  error: {
    color: "#ff8a8a",
    margin: 0,
  },
};