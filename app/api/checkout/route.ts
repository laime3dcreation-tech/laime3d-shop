import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cart = body.cart || [];
    const customer = body.customer || {};
    const delivery = body.delivery || {};

    if (!cart.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productsTotal = Number(delivery.productsTotal || 0);
    const deliveryPrice = Number(delivery.price || 0);
    const finalTotal = Number(delivery.finalTotal || productsTotal + deliveryPrice);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map(
      (item: any) => {
        const productName = item.selectedColor
          ? `${item.name} - Couleur : ${item.selectedColor}`
          : item.name;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: item.qty,
        };
      }
    );

    if (deliveryPrice > 0) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name:
              delivery.method === "home"
                ? "Livraison à domicile"
                : "Livraison Mondial Relay",
          },
          unit_amount: Math.round(deliveryPrice * 100),
        },
        quantity: 1,
      });
    }

    const deliveryLabel =
      delivery.method === "home" ? "Livraison à domicile" : "Mondial Relay";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customer.email || undefined,
      metadata: {
        first_name: customer.firstName || "",
        last_name: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",

        delivery_method: delivery.method || "",
        delivery_label: deliveryLabel,
        delivery_price: String(deliveryPrice),
        products_total: String(productsTotal),
        final_total: String(finalTotal),

        address: delivery.address || "",
        address_extra: delivery.addressExtra || "",
        postal_code: delivery.postalCode || "",
        city: delivery.city || "",
        country: delivery.country || "",

        relay_id: delivery.relay?.id || "",
        relay_name: delivery.relay?.name || "",
        relay_address: delivery.relay?.address || "",
        relay_postal_code: delivery.relay?.postalCode || "",
        relay_city: delivery.relay?.city || "",

        items_count: String(cart.length),
        items: JSON.stringify(
          cart.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            selectedColor: item.selectedColor || "",
          }))
        ).slice(0, 450),
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