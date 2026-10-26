import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "GERME Cameroun — Entrepreneuriat et développement économique",
  description:
    "GERME Cameroun est une structure d'appui à l'entrepreneuriat et au développement économique local : formation, accompagnement/coaching d'entreprises et renforcement de capacités.",
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
