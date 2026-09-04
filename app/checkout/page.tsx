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
  const [isMobile, setIsMobile] = useState(false);

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
    "Entrez votre code postal à 5 chiffres pour afficher les Points Relais."
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
    function checkMobile() {
      setIsMobile(window.innerWidth <= 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        setRelayStatus(
          "Entrez votre code postal à 5 chiffres pour afficher les Points Relais."
        );
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

    const cleanPostCode = relaySearchPostalCode.replace(/\D/g, "").slice(0, 5);

    if (cleanPostCode.length !== 5) {
      setRelayStatus(
        "Entrez votre code postal à 5 chiffres pour afficher les Points Relais."
      );

      const $ = window.$;
      if ($) {
        $("#Zone_Widget").empty();
      }

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

    const timer = setTimeout(() => {
      try {
        $("#Zone_Widget").empty();

        $("#Zone_Widget").MR_ParcelShopPicker({
          Target: "#RelayId",
          TargetDisplay: "#RelayDisplay",
          TargetDisplayInfoPR: "#RelayInfo",
          Brand: brand,
          Country: "FR",
          PostCode: cleanPostCode,
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

        setRelayStatus("Choisissez votre Point Relais sur la carte.");
      } catch (error) {
        console.error("Mondial Relay init error:", error);
        setRelayStatus("Erreur lors de l'affichage des Points Relais.");
      }
    }, 500);

    return () => clearTimeout(timer);
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

  const pageStyle = {
    ...styles.page,
    ...(isMobile ? styles.pageMobile : {}),
  };

  const navStyle = {
    ...styles.nav,
    ...(isMobile ? styles.navMobile : {}),
  };

  const titleStyle = {
    ...styles.title,
    ...(isMobile ? styles.titleMobile : {}),
  };

  const layoutStyle = {
    ...styles.layout,
    ...(isMobile ? styles.layoutMobile : {}),
  };

  const twoColumnsStyle = {
    ...styles.twoColumns,
    ...(isMobile ? styles.singleColumn : {}),
  };

  const deliveryOptionsStyle = {
    ...styles.deliveryOptions,
    ...(isMobile ? styles.singleColumn : {}),
  };

  const cardStyle = {
    ...styles.card,
    ...(isMobile ? styles.cardMobile : {}),
  };

  const summaryStyle = {
    ...styles.summary,
    ...(isMobile ? styles.summaryMobile : {}),
  };

  const widgetStyle = {
    ...styles.widget,
    ...(isMobile ? styles.widgetMobile : {}),
  };

  return (
    <main style={pageStyle}>
      <nav style={navStyle}>
        <a href="/" style={styles.logo}>
          LAIME3D
        </a>

        <a href="/shop" style={styles.navLink}>
          ← Retour à la boutique
        </a>
      </nav>

      <h1 style={titleStyle}>Finaliser ma commande</h1>

      <div style={layoutStyle}>
        <section style={styles.form}>
          <div style={cardStyle}>
            <h2 style={styles.cardTitle}>👤 Vos informations</h2>

            <div style={twoColumnsStyle}>
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

          <div style={cardStyle}>
            <h2 style={styles.cardTitle}>🚚 Livraison</h2>

            {productsTotal < FREE_SHIPPING_FROM ? (
              <p style={styles.freeShippingInfo}>
                Encore{" "}
                <b>{remainingForFreeShipping.toFixed(2).replace(".", ",")}€</b>{" "}
                pour profiter de la livraison offerte 🎁
              </p>
            ) : (
              <p style={styles.freeShippingSuccess}>🎉 Livraison offerte !</p>
            )}

            <div style={deliveryOptionsStyle}>
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
                  Entrez votre code postal à 5 chiffres, puis choisissez votre
                  Point Relais sur la carte Mondial Relay.
                </p>

                <input
                  placeholder="Code postal pour trouver un Point Relais *"
                  inputMode="numeric"
                  maxLength={5}
                  value={relaySearchPostalCode}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/\D/g, "").slice(0, 5);

                    setRelaySearchPostalCode(cleanValue);
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

                {relaySearchPostalCode.length === 5 && (
                  <div
                    key={relaySearchPostalCode}
                    id="Zone_Widget"
                    style={widgetStyle}
                  />
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

                <div style={twoColumnsStyle}>
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

          {!isMobile && (
            <button onClick={order} disabled={loading} style={styles.payButton}>
              {loading ? "Redirection..." : "Payer ma commande"}
            </button>
          )}
        </section>

        <aside style={summaryStyle}>
          <h2 style={styles.cardTitle}>🛒 Votre commande</h2>

          {cart.length === 0 && <p>Votre panier est vide.</p>}

          {cart.map((item, index) => (
            <div key={index} style={styles.item}>
              <div style={styles.itemInfo}>
                <strong>{item.name}</strong>
                {item.selectedColor && (
                  <p style={styles.color}>Couleur : {item.selectedColor}</p>
                )}
                <p>Quantité : {item.qty}</p>
              </div>

              <strong>{(Number(item.price) * item.qty).toFixed(2)}€</strong>
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

          {isMobile && (
            <button onClick={order} disabled={loading} style={styles.payButton}>
              {loading ? "Redirection..." : "Payer ma commande"}
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#F6E8D3",
    color: "#3B342D",
    padding: "40px",
    fontFamily: "Arial",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  pageMobile: {
    padding: "22px 16px 36px",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "12px",
  },

  navMobile: {
    alignItems: "flex-start",
    marginBottom: "24px",
  },

  logo: {
    color: "#B77A2D",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "4px",
  },

  navLink: {
    color: "#B77A2D",
    textDecoration: "none",
    fontWeight: "bold",
  },

  title: {
    color: "#B77A2D",
    fontSize: "38px",
    marginBottom: "30px",
    lineHeight: "1.15",
  },

  titleMobile: {
    fontSize: "34px",
    marginBottom: "24px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 380px",
    gap: "24px",
    alignItems: "start",
  },

  layoutMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    width: "100%",
  },

  form: {
    display: "grid",
    gap: "20px",
    minWidth: 0,
  },

  card: {
    background: "#FBF1E2",
    border: "1px solid #D7B98F",
    borderRadius: "18px",
    padding: "24px",
    display: "grid",
    gap: "14px",
    minWidth: 0,
    boxSizing: "border-box",
  },

  cardMobile: {
    padding: "18px",
    borderRadius: "16px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "22px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  singleColumn: {
    gridTemplateColumns: "1fr",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #D7B98F",
    background: "#FFF8EE",
    color: "#3B342D",
    boxSizing: "border-box",
    fontSize: "16px",
    minWidth: 0,
  },

  freeShippingInfo: {
    color: "#B8741A",
    background: "#EFD8B7",
    padding: "14px",
    borderRadius: "12px",
    lineHeight: "1.5",
  },

  freeShippingSuccess: {
    color: "#B77A2D",
    background: "#EFD8B7",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "bold",
  },

  deliveryOptions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  deliveryButton: {
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #D7B98F",
    background: "#F6E8D3",
    color: "#3B342D",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "left",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  deliveryButtonActive: {
    border: "2px solid #B77A2D",
    background: "#EFD8B7",
  },

  deliveryBox: {
    display: "grid",
    gap: "12px",
    marginTop: "10px",
    minWidth: 0,
  },

  text: {
    color: "#746457",
    lineHeight: "1.6",
    margin: 0,
  },

  status: {
    color: "#B8741A",
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
    boxSizing: "border-box",
    maxWidth: "100%",
  },

  widgetMobile: {
    minHeight: "430px",
    padding: "6px",
    width: "100%",
    overflowX: "auto",
  },

  relayBox: {
    background: "#F6E8D3",
    border: "1px solid #D7B98F",
    borderRadius: "12px",
    padding: "14px",
    lineHeight: "1.4",
  },

  payButton: {
    width: "100%",
    padding: "16px",
    background: "#B77A2D",
    color: "#FFF8EE",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "4px",
  },

  summary: {
    background: "#FBF1E2",
    border: "1px solid #D7B98F",
    borderRadius: "18px",
    padding: "24px",
    position: "sticky",
    top: "20px",
    minWidth: 0,
    boxSizing: "border-box",
  },

  summaryMobile: {
    position: "static",
    width: "100%",
    padding: "18px",
    borderRadius: "16px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "14px",
    minWidth: 0,
  },

  itemInfo: {
    minWidth: 0,
  },

  color: {
    color: "#B77A2D",
    fontSize: "13px",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    gap: "12px",
  },

  finalTotal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
    fontSize: "22px",
    color: "#B77A2D",
    gap: "12px",
  },
};
