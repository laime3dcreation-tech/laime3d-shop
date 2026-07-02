import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

async function createReceiptPdf(order: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 790;

  function draw(text: string, x = 50, size = 11, isBold = false) {
    page.drawText(text, {
      x,
      y,
      size,
      font: isBold ? bold : font,
      color: rgb(0.05, 0.12, 0.08),
    });
    y -= size + 8;
  }

  page.drawText("LAIME3D", {
    x: 50,
    y,
    size: 28,
    font: bold,
    color: rgb(0.15, 0.6, 0.25),
  });

  y -= 45;

  draw("RECU DE COMMANDE", 50, 18, true);
  draw(`Commande : ${order.orderNumber}`, 50, 12);
  draw(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 50, 12);
  draw("www.laime3d.com", 50, 12);

  y -= 15;

  draw("CLIENT", 50, 14, true);
  draw(order.customerName || "Client");
  draw(order.email || "");
  draw(order.phone || "");

  y -= 15;

  draw("LIVRAISON", 50, 14, true);
  draw(order.deliveryLabel || "");
  draw(order.address || "");

  y -= 20;

  draw("ARTICLES", 50, 14, true);

  order.items.forEach((item: any) => {
    const line = `${item.name} x${item.quantity} - ${Number(
      item.amount_total || 0
    ).toFixed(2)} EUR`;

    draw(line, 50, 11);
  });

  y -= 10;

  draw(`Sous-total : ${Number(order.productsTotal || 0).toFixed(2)} EUR`, 50, 12);
  draw(`Livraison : ${Number(order.deliveryPrice || 0).toFixed(2)} EUR`, 50, 12);
  draw(`TOTAL : ${Number(order.total || 0).toFixed(2)} EUR`, 50, 15, true);

  y -= 25;

  draw("Merci pour votre commande chez LAIME3D.", 50, 12, true);
  draw("Cree avec le coeur. Imprime avec passion.", 50, 11);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET in Vercel" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        { limit: 100 }
      );

      const items = lineItems.data.map((item) => ({
        name: item.description || "",
        quantity: item.quantity || 0,
        amount_total: item.amount_total ? item.amount_total / 100 : 0,
        currency: item.currency,
      }));

      const firstName = metadata.first_name || "";
      const lastName = metadata.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();

      const deliveryMethod = metadata.delivery_method || "";
      const deliveryLabel =
        deliveryMethod === "home" ? "Livraison à domicile" : "Mondial Relay";

      const address =
        deliveryMethod === "home"
          ? [
              metadata.address,
              metadata.address_extra,
              metadata.postal_code,
              metadata.city,
              metadata.country,
            ]
              .filter(Boolean)
              .join(", ")
          : [
              metadata.relay_name,
              metadata.relay_address,
              metadata.relay_postal_code,
              metadata.relay_city,
            ]
              .filter(Boolean)
              .join(", ");

      const finalTotal =
        Number(metadata.final_total || 0) ||
        (session.amount_total ? session.amount_total / 100 : 0);

      const orderNumber = `LAIME3D-${Date.now()}`;

      const orderPayload = {
        customer_name: fullName,
        first_name: firstName,
        last_name: lastName,

        email: metadata.email || session.customer_details?.email || "",
        phone: metadata.phone || "",

        address,
        shipping_address: metadata.address || "",
        address_extra: metadata.address_extra || "",
        postal_code: metadata.postal_code || "",
        city: metadata.city || "",
        country: metadata.country || "France",

        delivery_method: deliveryMethod,
        delivery_price: Number(metadata.delivery_price || 0),
        products_total: Number(metadata.products_total || 0),
        final_total: finalTotal,

        relay_id: metadata.relay_id || "",
        relay_name: metadata.relay_name || "",
        relay_address: metadata.relay_address || "",
        relay_postal_code: metadata.relay_postal_code || "",
        relay_city: metadata.relay_city || "",

        total: finalTotal,
        status: "new",
        items,
      };

      const { data: insertedOrder, error } = await supabaseAdmin
        .from("orders")
        .insert([orderPayload])
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Supabase insert error: " + error.message },
          { status: 500 }
        );
      }

      const pdfBase64 = await createReceiptPdf({
        orderNumber: insertedOrder?.id || orderNumber,
        customerName: fullName,
        email: orderPayload.email,
        phone: orderPayload.phone,
        deliveryLabel,
        address,
        items,
        productsTotal: orderPayload.products_total,
        deliveryPrice: orderPayload.delivery_price,
        total: finalTotal,
      });

      if (orderPayload.email) {
        await resend.emails.send({
          from: "LAIME3D <contact@laime3d.com>",
          to: [orderPayload.email],
          bcc: ["laime3dcontact@yahoo.com"],
          subject: "Merci pour votre commande LAIME3D",
          html: `
            <div style="font-family: Arial, sans-serif; background:#0b1f14; color:#e8f5e9; padding:30px;">
              <div style="max-width:640px; margin:auto; background:#10251a; border:1px solid #1f4d33; border-radius:18px; padding:26px;">
                <h1 style="color:#7CFF9B;">Merci pour votre commande ❤️</h1>

                <p>Bonjour ${firstName || fullName || ""},</p>

                <p>
                  Nous avons bien reçu votre commande LAIME3D.
                  Votre reçu est joint à cet e-mail au format PDF.
                </p>

                <p><b>Commande :</b> ${insertedOrder?.id || orderNumber}</p>
                <p><b>Total :</b> ${finalTotal.toFixed(2)} €</p>
                <p><b>Livraison :</b> ${deliveryLabel}</p>

                <p>
                  Chaque création est préparée avec soin.
                  L’expédition se fait généralement sous 24 à 72 heures selon le modèle.
                </p>

                <p style="color:#7CFF9B;"><b>Créé avec le cœur. Imprimé avec passion.</b></p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `LAIME3D-recu-${insertedOrder?.id || orderNumber}.pdf`,
              content: pdfBase64,
            },
          ],
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      { error: "Webhook error: " + error.message },
      { status: 400 }
    );
  }
}