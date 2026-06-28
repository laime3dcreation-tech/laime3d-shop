import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cart = body.cart || [];
    const customer = body.customer || {};

    if (!cart.length) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    let total = 0;

    const simpleItems = cart.map((item: any) => {
      total += item.price * item.qty;

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      };
    });

    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customer.email || undefined,
      metadata: {
        name: customer.name || "",
        email: customer.email || "",
        address: customer.address || "",
        total: String(total),
        items_count: String(simpleItems.length),
      },
      success_url: process.env.NEXT_PUBLIC_SITE_URL + "/success",
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL + "/cancel",
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}