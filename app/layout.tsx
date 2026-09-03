import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "GERME Cameroun — Formations en agriculture et élevage",
  description:
    "GERME Cameroun forme les entrepreneurs agricoles de demain : cours pratiques, certification et accompagnement vers un plan d'affaires.",
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
