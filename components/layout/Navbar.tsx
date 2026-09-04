"use client";

import Link from "next/link";
import { useState } from "react";

const LIENS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#apropos", label: "À propos" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
  { href: "#blog", label: "Blog" },
];

export default function Navbar() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-germe-ink/10 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <a
          href="#accueil"
          className="font-display text-lg font-semibold text-germe-blue md:text-xl"
        >
          GERME <span className="text-germe-green">Cameroun</span>
        </a>

        <nav className="hidden gap-8 text-sm font-medium text-germe-ink/80 lg:flex">
          {LIENS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-germe-green"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Link
          href="/plateforme"
          className="hidden rounded-full bg-germe-green px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md lg:inline-block"
        >
          Se former
        </Link>

        {/* Bouton menu mobile : bascule hamburger / croix */}
        <button
          type="button"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={ouvert}
          onClick={() => setOuvert((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-germe-ink/5 lg:hidden"
        >
          <span
            className={`absolute h-0.5 w-5 bg-germe-ink transition-all duration-200 ${
              ouvert ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-germe-ink transition-all duration-200 ${
              ouvert ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-germe-ink transition-all duration-200 ${
              ouvert ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>

        {/* Panneau mobile : se superpose au contenu, ne pousse rien vers le bas */}
        {ouvert && (
          <>
            <div
              className="fixed inset-0 z-40 bg-germe-ink/15 lg:hidden"
              onClick={() => setOuvert(false)}
              aria-hidden="true"
            />
            <nav className="absolute right-5 top-full z-50 mt-3 w-64 max-w-[80vw] animate-menu-pop rounded-2xl border border-germe-ink/10 bg-white p-4 shadow-2xl lg:hidden">
              <ul className="flex flex-col gap-1 text-sm font-medium text-germe-ink/80">
                {LIENS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOuvert(false)}
                      className="block rounded-lg px-3 py-2.5 transition hover:bg-germe-green/10 hover:text-germe-green"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-germe-ink/10 pt-3">
                <Link
                  href="/plateforme"
                  onClick={() => setOuvert(false)}
                  className="block rounded-full bg-germe-green px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-germe-greenDark"
                >
                  Se former
                </Link>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
