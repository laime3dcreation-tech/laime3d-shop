import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, phone, message } = body;

    await resend.emails.send({
      from: "Laime3D <onboarding@resend.dev>",
      to: ["laime3dcreation@gmail.com"],
      subject: "Nouveau message Laime3D",
      html: `
        <h2>Nouveau message depuis Laime3D</h2>
        <p><b>Prénom :</b> ${firstName}</p>
        <p><b>Nom :</b> ${lastName}</p>
        <p><b>Email :</b> ${email}</p>
        <p><b>Téléphone :</b> ${phone || "Non renseigné"}</p>
        <hr />
        <p><b>Message :</b></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Contact email error:", error);

    return NextResponse.json(
      { error: error.message || "Erreur d'envoi" },
      { status: 500 }
    );
  }
}