import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

async function shipOrder(formData: FormData) {
  "use server";

  const orderId = String(formData.get("orderId"));
  const trackingNumber = String(formData.get("trackingNumber") || "").trim();

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
          <div style="max-width:640px; margin:auto; background:#10251a; border:1px solid #1f4d33; border-radius:18px; padding:26px;">
            <h1 style="color:#7CFF9B;">Votre commande est en route 📦</h1>

            <p>Bonjour ${order.first_name || order.customer_name || ""},</p>

            <p>
              Bonne nouvelle ! Votre commande LAIME3D vient d’être expédiée.
            </p>

            ${
              trackingNumber
                ? `<p><b>Numéro de suivi :</b> ${trackingNumber}</p>`
                : `<p>Le numéro de suivi sera disponible prochainement.</p>`
            }

            <p>
              Vous pouvez suivre votre colis sur le site du transporteur.
            </p>

            <p>
              Merci encore pour votre commande ❤️
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

        <p>
          <b>Commande :</b> #{order.id}
        </p>

        <p>
          <b>Client :</b> {order.customer_name || "Non renseigné"}
        </p>

        <p>
          <b>Email :</b> {order.email || "Non renseigné"}
        </p>

        <form action={shipOrder} style={styles.form}>
          <input type="hidden" name="orderId" value={order.id} />

          <label>Numéro de suivi</label>
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
    maxWidth: "620px",
    background: "#10251a",
    border: "1px solid #1f4d33",
    borderRadius: "18px",
    padding: "28px",
  },

  title: {
    color: "#7CFF9B",
    marginBottom: "20px",
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