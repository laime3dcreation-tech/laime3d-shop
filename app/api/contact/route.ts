import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Laime3D <contact@laime3d.com>",
      to: ["laime3dcontact@yahoo.com"],
      replyTo: email,
      subject: "Nouveau message depuis Laime3D",
      html: `
        <div style="font-family: Arial, sans-serif; background:#0b1f14; color:#e8f5e9; padding:30px;">
          <div style="max-width:620px; margin:auto; background:#10251a; border:1px solid #1f4d33; border-radius:16px; padding:24px;">
            <h1 style="color:#7CFF9B;">Nouveau message Laime3D</h1>

            <p><strong>Prénom :</strong> ${firstName}</p>
            <p><strong>Nom :</strong> ${lastName}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>

            <hr style="border:none; border-top:1px solid #1f4d33; margin:20px 0;" />

            <h2 style="color:#7CFF9B;">Message</h2>
            <p style="white-space:pre-line; line-height:1.6;">${message}</p>
          </div>
        </div>
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