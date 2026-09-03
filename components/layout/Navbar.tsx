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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <a href="#accueil" className="font-display text-lg font-semibold text-germe-blue md:text-xl">
          GERME <span className="text-germe-green">Cameroun</span>
        </a>

        <nav className="hidden gap-8 text-sm font-medium text-germe-ink/80 lg:flex">
          {LIENS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-germe-green">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="text-sm font-medium text-germe-ink/70 hover:text-germe-green">
            Se connecter
          </Link>
          <a
            href="#formations"
            className="rounded-full bg-germe-green px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-germe-greenDark"
          >
            Se former
          </a>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
          onClick={() => setOuvert((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className="h-0.5 w-6 bg-germe-ink" />
          <span className="h-0.5 w-6 bg-germe-ink" />
          <span className="h-0.5 w-6 bg-germe-ink" />
        </button>
      </div>

      {ouvert && (
        <nav className="border-t border-germe-ink/10 bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-germe-ink/80">
            {LIENS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOuvert(false)}>
                {l.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setOuvert(false)}>Se connecter</Link>
            <a
              href="#formations"
              onClick={() => setOuvert(false)}
              className="rounded-full bg-germe-green px-5 py-2.5 text-center font-semibold text-white"
            >
              Se former
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
