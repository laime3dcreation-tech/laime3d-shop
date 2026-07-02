import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      const deliveryLabel = metadata.delivery_label || "";

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

      const { error } = await supabaseAdmin.from("orders").insert([
        {
          customer_name: fullName,
          first_name: firstName,
          last_name: lastName,

          email:
            metadata.email ||
            session.customer_details?.email ||
            "",

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
          final_total: Number(metadata.final_total || session.amount_total ? Number(session.amount_total) / 100 : 0),

          relay_id: metadata.relay_id || "",
          relay_name: metadata.relay_name || "",
          relay_address: metadata.relay_address || "",
          relay_postal_code: metadata.relay_postal_code || "",
          relay_city: metadata.relay_city || "",

          total: Number(metadata.final_total || session.amount_total ? Number(session.amount_total) / 100 : 0),
          status: "new",
          items,
        },
      ]);

      if (error) {
        return NextResponse.json(
          { error: "Supabase insert error: " + error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Webhook error: " + error.message },
      { status: 400 }
    );
  }
}