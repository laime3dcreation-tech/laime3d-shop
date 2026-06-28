import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          limit: 100,
        }
      );

      const items = lineItems.data.map((item) => ({
        name: item.description || "",
        quantity: item.quantity || 0,
        amount_total: item.amount_total ? item.amount_total / 100 : 0,
        currency: item.currency,
      }));

      const { error } = await supabaseAdmin.from("orders").insert([
        {
          customer_name: session.metadata?.name || "",
          email:
            session.metadata?.email ||
            session.customer_details?.email ||
            "",
          address: session.metadata?.address || "",
          total: Number(session.metadata?.total || 0),
          items,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error.message);

    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}