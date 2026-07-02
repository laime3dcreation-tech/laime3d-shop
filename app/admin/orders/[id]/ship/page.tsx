import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

function getTrackingUrl(trackingNumber: string) {
  if (!trackingNumber) return "https://www.mondialrelay.fr/suivi-de-colis/";

  return `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${encodeURIComponent(
    trackingNumber
  )}`;
}

async function shipOrder(formData: FormData) {
  "use server";

  const orderId = String(formData.get("orderId"));
  const trackingNumber = String(formData.get("trackingNumber") || "").trim();
  const trackingUrl = getTrackingUrl(trackingNumber);

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) {
    redirect("/admin/orders");
  }

  await supabaseAdmin
    .from("orders")
    .update({
      status: "shipped",
      tracking_number: trackingNumber,
    })
    .eq("id", orderId);

  if (order.email) {
    await resend.emails.send({
      from: "LAIME3D <contact@laime3d.com>",
      to: [order.email],
      bcc: ["laime3dcontact@yahoo.com"],
      subject: "Votre commande LAIME3D est expédiée 📦",
      html: `
        <div style="font-family: Arial, sans-serif; background:#0b1f14; color:#e8f5e9; padding:30px;">
          <div style="max-width:660px; margin:auto; background:#10251a; border:1px solid #1f4d33; border-radius:20px; padding:30px;">
            
            <div style="text-align:center; margin-bottom:28px;">
              <div style="color:#7CFF9B; font-size:30px; font-weight:bold; letter-spacing:4px;">
                LAIME3D
              </div>
              <p style="color:#b8d9c4; margin:8px 0 0;">
                Créé avec le cœur. Imprimé avec passion.
              </p>
            </div>

            <h1 style="color:#7CFF9B; text-align:center;">
              Votre commande est en route 📦
            </h1>

            <p>Bonjour ${order.first_name || order.customer_name || ""},</p>

            <p>
              Bonne nouvelle ! Votre commande <b>#${order.id}</b> vient d’être expédiée.
            </p>

            <div style="background:#0b1f14; border:1px solid #1f4d33; border-radius:14px; padding:18px; margin:22px 0;">
              <p style="margin:0 0 8px; color:#b8d9c4;">Numéro de suivi</p>
              <p style="margin:0; color:#7CFF9B; font-size:22px; font-weight:bold;">
                ${trackingNumber || "Disponible prochainement"}
              </p>
            </div>

            ${
              trackingNumber
                ? `
                  <div style="text-align:center; margin:28px 0;">
                    <a
                      href="${trackingUrl}"
                      style="display:inline-block; background:#7CFF9B; color:#03140a; padding:14px 24px; border-radius:12px; text-decoration:none; font-weight:bold;"
                    >
                      Suivre mon colis
                    </a>
                  </div>
                `
                : ""
            }

            <p>
              Vous pouvez suivre votre colis sur le site du transporteur.
            </p>

            <p>
              Merci encore pour votre commande et pour votre soutien ❤️
            </p>

            <p style="color:#7CFF9B;"><b>Créé avec le cœur. Imprimé avec passion.</b></p>
          </div>
        </div>
      `,
    });
  }

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export default async function ShipOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    return (
      <main style={styles.page}>
        <h1>Commande introuvable</h1>
        <a href="/admin/orders" style={styles.link}>
          ← Retour aux commandes
        </a>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <a href="/admin/orders" style={styles.link}>
        ← Retour aux commandes
      </a>

      <div style={styles.card}>
        <h1 style={styles.title}>📦 Expédier la commande</h1>

        <div style={styles.infoBox}>
          <p>
            <b>Commande :</b> #{order.id}
          </p>

          <p>
            <b>Client :</b> {order.customer_name || "Non renseigné"}
          </p>

          <p>
            <b>Email :</b> {order.email || "Non renseigné"}
          </p>

          <p>
            <b>Tracking actuel :</b>{" "}
            {order.tracking_number || "Pas encore ajouté"}
          </p>
        </div>

        <form action={shipOrder} style={styles.form}>
          <input type="hidden" name="orderId" value={order.id} />

          <label>Numéro de suivi Mondial Relay</label>
          <input
            name="trackingNumber"
            defaultValue={order.tracking_number || ""}
            placeholder="Ex: 123456789"
            style={styles.input}
          />

          <button style={styles.button}>
            Enregistrer et envoyer l’email
          </button>
        </form>
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

  link: {
    color: "#7CFF9B",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
    marginBottom: "25px",
  },

  card: {
    maxWidth: "680px",
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "28px",
  },

  title: {
    color: "#7CFF9B",
    marginBottom: "20px",
  },

  infoBox: {
    background: "#0b1f14",
    border: "1px solid #1f4d33",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "22px",
  },

  form: {
    marginTop: "25px",
    display: "grid",
    gap: "12px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #1f4d33",
    background: "#0b1f14",
    color: "#fff",
  },

  button: {
    marginTop: "12px",
    padding: "14px",
    background: "#7CFF9B",
    color: "#03140a",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};