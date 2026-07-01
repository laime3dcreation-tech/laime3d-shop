"use client";

import { useEffect, useState } from "react";

const FREE_SHIPPING_FROM = 69;
const MONDIAL_RELAY_PRICE = 4.9;
const HOME_DELIVERY_PRICE = 7.9;

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState("mondial_relay");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
  const [addressExtra, setAddressExtra] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");

  const [relaySearchPostalCode, setRelaySearchPostalCode] = useState("");
  const [relayStatus, setRelayStatus] = useState(
    "Entrez votre code postal pour afficher les Points Relais."
  );

  const [relay, setRelay] = useState({
    id: "",
    name: "",
    address: "",
    postalCode: "",
    city: "",
    country: "FR",
  });

  const [widgetReady, setWidgetReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (deliveryMethod !== "mondial_relay") return;

    async function loadWidget() {
      function loadScript(src: string) {
        return new Promise<void>((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }

          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(src));
          document.body.appendChild(script);
        });
      }

      function loadCss(href: string) {
        if (document.querySelector(`link[href="${href}"]`)) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }

      try {
        setRelayStatus("Chargement de Mondial Relay...");

        loadCss("https://unpkg.com/leaflet/dist/leaflet.css");

        await loadScript(
          "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"
        );

        window.jQuery = window.$;

        await loadScript("https://unpkg.com/leaflet/dist/leaflet.js");

        await loadScript(
          "https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js"
        );

        setWidgetReady(true);
        setRelayStatus("Entrez votre code postal pour afficher les Points Relais.");
      } catch (error) {
        console.error("Mondial Relay loading error:", error);
        setRelayStatus("Impossible de charger Mondial Relay.");
      }
    }

    loadWidget();
  }, [deliveryMethod]);

  useEffect(() => {
    if (!widgetReady) return;
    if (deliveryMethod !== "mondial_relay") return;

    if (relaySearchPostalCode.length < 4) {
      setRelayStatus("Entrez votre code postal pour afficher les Points Relais.");
      return;
    }

    const brand = process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND;

    if (!brand) {
      setRelayStatus("Configuration Mondial Relay manquante.");
      return;
    }

    const $ = window.$;

    if (!$ || !$.fn || !$.fn.MR_ParcelShopPicker) {
      setRelayStatus("Le module Mondial Relay n'est pas prêt.");
      return;
    }

    setRelayStatus("Recherche des Points Relais...");

    setTimeout(() => {
      try {
        $("#Zone_Widget").empty();

        $("#Zone_Widget").MR_ParcelShopPicker({
          Target: "#RelayId",
          TargetDisplay: "#RelayDisplay",
          TargetDisplayInfoPR: "#RelayInfo",
          Brand: brand,
          Country: "FR",
          PostCode: relaySearchPostalCode,
          ColLivMod: "24R",
          NbResults: 7,
          Responsive: true,
          ShowResultsOnMap: true,
          MapScrollWheel: false,
          Theme: "mondialrelay",
          OnParcelShopSelected: function (data: any) {
            setRelay({
              id: data.ID || "",
              name: data.Nom || "",
              address: data.Adresse1 || "",
              postalCode: data.CP || "",
              city: data.Ville || "",
              country: data.Pays || "FR",
            });

            setRelayStatus("Point Relais sélectionné.");
          },
        });
      } catch (error) {
        console.error("Mondial Relay init error:", error);
        setRelayStatus("Erreur lors de l'affichage des Points Relais.");
      }
    }, 300);
  }, [widgetReady, deliveryMethod, relaySearchPostalCode]);

  const productsTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const baseDeliveryPrice =
    deliveryMethod === "mondial_relay"
      ? MONDIAL_RELAY_PRICE
      : HOME_DELIVERY_PRICE;

  const deliveryPrice =
    productsTotal >= FREE_SHIPPING_FROM ? 0 : baseDeliveryPrice;

  const finalTotal = productsTotal + deliveryPrice;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_FROM - productsTotal
  );

  async function order() {
    if (!cart.length) {
      alert("Votre panier est vide.");
      return;
    }

    if (!firstName || !lastName || !email || !phone) {
      alert("Merci de remplir vos informations personnelles.");
      return;
    }

    if (deliveryMethod === "home") {
      if (!address || !postalCode || !city || !country) {
        alert("Merci de remplir votre adresse de livraison.");
        return;
      }
    }

    if (deliveryMethod === "mondial_relay" && !relay.id) {
      alert("Merci de choisir un Point Relais Mondial Relay.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          customer: {
            firstName,
            lastName,
            email,
            phone,
          },
          delivery: {
            method: deliveryMethod,
            price: deliveryPrice,
            productsTotal,
            finalTotal,
            address,
            addressExtra,
            postalCode,
            city,
            country,
            relay,
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <a href="/" style={styles.logo}>
          LAIME3D
        </a>

        <a href="/shop" style={styles.navLink}>
          ← Retour à la boutique
        </a>
      </nav>

      <h1 style={styles.title}>Finaliser ma commande</h1>

      <div style={styles.layout}>
        <section style={styles.form}>
          <div style={styles.card}>
            <h2>👤 Vos informations</h2>

            <div style={styles.twoColumns}>
              <input
                placeholder="Prénom *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Nom *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={styles.input}
              />
            </div>

            <input
              type="email"
              placeholder="Adresse e-mail *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Téléphone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.card}>
            <h2>🚚 Livraison</h2>

            {productsTotal < FREE_SHIPPING_FROM ? (
              <p style={styles.freeShippingInfo}>
                Encore{" "}
                <b>{remainingForFreeShipping.toFixed(2).replace(".", ",")}€</b>{" "}
                pour profiter de la livraison offerte 🎁
              </p>
            ) : (
              <p style={styles.freeShippingSuccess}>🎉 Livraison offerte !</p>
            )}

            <div style={styles.deliveryOptions}>
              <button
                type="button"
                onClick={() => setDeliveryMethod("mondial_relay")}
                style={{
                  ...styles.deliveryButton,
                  ...(deliveryMethod === "mondial_relay"
                    ? styles.deliveryButtonActive
                    : {}),
                }}
              >
                <strong>Mondial Relay</strong>
                <span>
                  {productsTotal >= FREE_SHIPPING_FROM ? "Offert" : "4,90 €"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod("home")}
                style={{
                  ...styles.deliveryButton,
                  ...(deliveryMethod === "home"
                    ? styles.deliveryButtonActive
                    : {}),
                }}
              >
                <strong>Livraison à domicile</strong>
                <span>
                  {productsTotal >= FREE_SHIPPING_FROM ? "Offert" : "7,90 €"}
                </span>
              </button>
            </div>

            {deliveryMethod === "mondial_relay" && (
              <div style={styles.deliveryBox}>
                <p style={styles.text}>
                  Entrez votre code postal, puis choisissez votre Point Relais
                  sur la carte Mondial Relay.
                </p>

                <input
                  placeholder="Code postal pour trouver un Point Relais *"
                  value={relaySearchPostalCode}
                  onChange={(e) => {
                    setRelaySearchPostalCode(e.target.value);
                    setRelay({
                      id: "",
                      name: "",
                      address: "",
                      postalCode: "",
                      city: "",
                      country: "FR",
                    });
                  }}
                  style={styles.input}
                />

                <p style={styles.status}>{relayStatus}</p>

                <input id="RelayId" type="hidden" />
                <input id="RelayDisplay" type="hidden" />
                <div id="RelayInfo" style={{ display: "none" }} />

                {relaySearchPostalCode.length >= 4 && (
                  <div id="Zone_Widget" style={styles.widget} />
                )}

                {relay.id && (
                  <div style={styles.relayBox}>
                    <strong>📍 {relay.name}</strong>
                    <p>{relay.address}</p>
                    <p>
                      {relay.postalCode} {relay.city}
                    </p>
                    <p>Point Relais : {relay.id}</p>
                  </div>
                )}
              </div>
            )}

            {deliveryMethod === "home" && (
              <div style={styles.deliveryBox}>
                <input
                  placeholder="Adresse *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.input}
                />

                <input
                  placeholder="Complément d'adresse"
                  value={addressExtra}
                  onChange={(e) => setAddressExtra(e.target.value)}
                  style={styles.input}
                />

                <div style={styles.twoColumns}>
                  <input
                    placeholder="Code postal *"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    placeholder="Ville *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <input
                  placeholder="Pays *"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={styles.input}
                />
              </div>
            )}
          </div>

          <button onClick={order} disabled={loading} style={styles.payButton}>
            {loading ? "Redirection..." : "Payer ma commande"}
          </button>
        </section>

        <aside style={styles.summary}>
          <h2>🛒 Votre commande</h2>

          {cart.length === 0 && <p>Votre panier est vide.</p>}

          {cart.map((item, index) => (
            <div key={index} style={styles.item}>
              <div>
                <strong>{item.name}</strong>
                {item.selectedColor && (
                  <p style={styles.color}>Couleur : {item.selectedColor}</p>
                )}
                <p>Quantité : {item.qty}</p>
              </div>

              <strong>{Number(item.price) * item.qty}€</strong>
            </div>
          ))}

          <hr />

          <div style={styles.totalRow}>
            <span>Sous-total</span>
            <strong>{productsTotal.toFixed(2).replace(".", ",")}€</strong>
          </div>

          <div style={styles.totalRow}>
            <span>Livraison</span>
            <strong>
              {deliveryPrice === 0
                ? "Offerte"
                : `${deliveryPrice.toFixed(2).replace(".", ",")}€`}
            </strong>
          </div>

          <hr />

          <div style={styles.finalTotal}>
            <span>Total</span>
            <strong>{finalTotal.toFixed(2).replace(".", ",")}€</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#0b1f14",
    color: "#e8f5e9",
    padding: "40px",
    fontFamily: "Arial",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "12px",
  },
  logo: {
    color: "#7CFF9B",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "4px",
  },
  navLink: {
    color: "#7CFF9B",
    textDecoration: "none",
    fontWeight: "bold",
  },
  title: {
    color: "#7CFF9B",
    fontSize: "38px",
    marginBottom: "30px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "24px",
    alignItems: "start",
  },
  form: {
    display: "grid",
    gap: "20px",
  },
  card: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "24px",
    display: "grid",
    gap: "14px",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #1f4d33",
    background: "#0b1f14",
    color: "#fff",
    boxSizing: "border-box",
  },
  freeShippingInfo: {
    color: "#ffd166",
    background: "#1a2d19",
    padding: "12px",
    borderRadius: "10px",
  },
  freeShippingSuccess: {
    color: "#7CFF9B",
    background: "#12301f",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  deliveryOptions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  deliveryButton: {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #1f4d33",
    background: "#0b1f14",
    color: "#e8f5e9",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "left",
  },
  deliveryButtonActive: {
    border: "2px solid #7CFF9B",
    background: "#12301f",
  },
  deliveryBox: {
    display: "grid",
    gap: "12px",
    marginTop: "10px",
  },
  text: {
    color: "#c8facc",
    lineHeight: "1.6",
  },
  status: {
    color: "#ffd166",
    fontSize: "14px",
    margin: 0,
  },
  widget: {
    background: "#ffffff",
    color: "#000000",
    borderRadius: "12px",
    overflow: "hidden",
    minHeight: "560px",
    padding: "10px",
  },
  relayBox: {
    background: "#0b1f14",
    border: "1px solid #1f4d33",
    borderRadius: "12px",
    padding: "14px",
  },
  payButton: {
    padding: "16px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  summary: {
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "24px",
    position: "sticky",
    top: "20px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "14px",
  },
  color: {
    color: "#7CFF9B",
    fontSize: "13px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
  },
  finalTotal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
    fontSize: "22px",
    color: "#7CFF9B",
  },
};