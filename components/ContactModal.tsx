"use client";

import { useState } from "react";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  function sendMessage(e: any) {
    e.preventDefault();

    setSent(true);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={styles.mainButton}>
        Parlons de votre projet
      </button>

      {open && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={() => setOpen(false)} style={styles.close}>
              ×
            </button>

            <h2 style={styles.title}>Une idée en tête ?</h2>

            {!sent ? (
              <form onSubmit={sendMessage} style={styles.form}>
                <input placeholder="Prénom" required style={styles.input} />
                <input placeholder="Nom" required style={styles.input} />
                <input type="email" placeholder="Email" required style={styles.input} />
                <input placeholder="Téléphone" style={styles.input} />
                <textarea placeholder="Votre idée..." required style={styles.textarea} />

                <button style={styles.submit}>Envoyer</button>
              </form>
            ) : (
              <p style={styles.success}>
                Merci pour votre message ! Nous vous répondrons dès que possible.
              </p>
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
    marginBottom: "20px",
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
  success: {
    fontSize: "18px",
    lineHeight: "1.6",
  },
};