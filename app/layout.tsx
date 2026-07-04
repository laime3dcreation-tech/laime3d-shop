import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import FloatingCart from "@/components/FloatingCart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.laime3d.com"),

  title: {
    default: "LAIME3D | Créations artisanales imprimées en 3D",
    template: "%s | LAIME3D",
  },

  description:
    "Découvrez des créations artisanales imprimées en 3D : figurines flexibles, lampes, vases, porte-clés et objets personnalisés. Fabrication soignée en France, livraison rapide.",

  keywords: [
    "impression 3D",
    "créations 3D",
    "figurines 3D",
    "figurines flexibles",
    "lampe 3D",
    "vase 3D",
    "porte-clés 3D",
    "cadeaux personnalisés",
    "PLA",
    "artisan",
    "LAIME3D",
  ],

  authors: [{ name: "LAIME3D" }],
  creator: "LAIME3D",
  publisher: "LAIME3D",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.laime3d.com",
    siteName: "LAIME3D",
    title: "LAIME3D | Créations artisanales imprimées en 3D",
    description:
      "Créations artisanales imprimées en 3D : figurines flexibles, lampes, vases, porte-clés et objets personnalisés.",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "LAIME3D - Créations artisanales imprimées en 3D",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "LAIME3D | Créations artisanales imprimées en 3D",
    description:
      "Créations artisanales imprimées en 3D : figurines flexibles, lampes, vases, porte-clés et objets personnalisés.",
    images: ["/banner.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "LAIME3D",
  url: "https://www.laime3d.com",
  logo: "https://www.laime3d.com/icon.png",
  image: "https://www.laime3d.com/banner.png",
  description:
    "Créations artisanales imprimées en 3D : figurines flexibles, lampes, vases, porte-clés et objets personnalisés.",
  email: "laime3dcontact@yahoo.com",
  areaServed: "FR",
  sameAs: ["https://instagram.com/laime3d"],
  brand: {
    "@type": "Brand",
    name: "LAIME3D",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}

        <FloatingCart />
      </body>
    </html>
  );
}
