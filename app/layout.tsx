import type { Metadata } from "next";
import "../styles/globals.css";

const TITRE = "GERME Cameroun — Entrepreneuriat et développement économique";
const DESCRIPTION =
  "GERME Cameroun est une structure d'appui à l'entrepreneuriat et au développement économique local : formation, accompagnement/coaching d'entreprises et renforcement de capacités.";

export const metadata: Metadata = {
  // Adresse de base pour résoudre les liens relatifs des métadonnées
  // (image de partage, etc.).
  metadataBase: new URL("https://www.germecameroune.org"),
  title: TITRE,
  description: DESCRIPTION,
  // Aperçu affiché quand le lien est partagé sur Facebook, LinkedIn,
  // WhatsApp, etc.
  openGraph: {
    type: "website",
    siteName: "GERME Cameroun",
    locale: "fr_FR",
    title: TITRE,
    description: DESCRIPTION,
    images: [
      {
        url: "/images/og/og-germe.jpg",
        width: 1200,
        height: 630,
        alt: "GERME Cameroun — Ensemble, faisons germer les talents pour un avenir durable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITRE,
    description: DESCRIPTION,
    images: ["/images/og/og-germe.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
