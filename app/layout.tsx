import type { Metadata } from "next";
import { Anek_Latin, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const displayFont = Anek_Latin({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Journée du Comportement Durable 2026 | Abidjan",
  description:
    "Les 10 et 11 septembre 2026 à Abidjan : deux jours pour renforcer le pouvoir des quartiers dans la transformation des comportements urbains durables.",
  icons: {
    icon: "/images/brand/jcd-logo.png",
    shortcut: "/images/brand/jcd-logo.png",
  },
  openGraph: {
    title: "Journée du Comportement Durable - 2ᵉ édition",
    description:
      "Le pouvoir des quartiers dans la transformation des comportements urbains durables.",
    type: "website",
    locale: "fr_CI",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Journée du Comportement Durable 2026",
    description: "10 et 11 septembre 2026 - Abidjan, Côte d'Ivoire",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
