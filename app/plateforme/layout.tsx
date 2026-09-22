"use client";

import { useEffect, useState } from "react";
import PlateformeSidebar from "@/components/plateforme/PlateformeSidebar";

export default function PlateformeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ouvert, setOuvert] = useState(false);

  // Ouverte par défaut sur grand écran, repliée sur mobile — décidé après
  // le montage pour éviter tout écart entre le rendu serveur et client.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setOuvert(mq.matches);
  }, []);

  return (
    <div className="min-h-screen">
      <PlateformeSidebar ouvert={ouvert} onFermer={() => setOuvert(false)} />

      {/* Fond sur lequel se referme le menu, sur mobile uniquement */}
      {ouvert && (
        <div
          aria-hidden="true"
          onClick={() => setOuvert(false)}
          className="fixed inset-0 z-30 bg-germe-ink/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Bouton flottant pour rouvrir le menu, visible uniquement fermé */}
      {!ouvert && (
        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-label="Afficher le menu"
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-germe-ink/10 bg-white text-germe-ink/70 shadow-lg transition hover:text-germe-blue"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Fond effet verre lumineux, identique à la partie droite de la connexion */}
      <div
        className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-germe-blueLight via-germe-cream to-germe-greenLight transition-[padding] duration-300 ${
          ouvert ? "md:pl-72" : "md:pl-0"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-[-6%] top-[8%] h-72 w-72 rounded-full bg-germe-blue/45 blur-[70px] sm:h-96 sm:w-96"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-[6%] right-[-8%] h-80 w-80 rounded-full bg-germe-green/45 blur-[70px] sm:h-[26rem] sm:w-[26rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed right-[12%] top-[28%] h-52 w-52 rounded-full bg-germe-wheat/50 blur-[60px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 bg-white/20 backdrop-blur-xl"
        />

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
