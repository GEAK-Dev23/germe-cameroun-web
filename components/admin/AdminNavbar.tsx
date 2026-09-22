"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi, type Utilisateur } from "@/lib/api";
import NotificationsBell from "@/components/layout/NotificationsBell";

const LIENS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/formations", label: "Formations" },
  { href: "/admin/apprenants", label: "Apprenants" },
  { href: "/admin/ressources", label: "Ressources" },
  { href: "/admin/corrections", label: "Corrections" },
  { href: "/admin/webinaires", label: "Webinaires" },
  { href: "/admin/articles", label: "Blog" },
  { href: "/admin/temoignages", label: "Témoignages" },
  { href: "/admin/offres-partenaires", label: "Partenaires" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
];

export default function AdminNavbar() {
  const router = useRouter();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

  useEffect(() => {
    authApi
      .me()
      .then(({ utilisateur }) => setUtilisateur(utilisateur))
      .catch(() => setUtilisateur(null));
  }, []);

  async function seDeconnecter() {
    await authApi.logout().catch(() => {});
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-germe-ink/10 bg-germe-blueDark">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <Link href="/admin" aria-label="GERME Cameroun — Admin" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-0.5">
            <Image
              src="/images/logo/logo-germe.jpeg"
              alt="GERME Cameroun"
              width={44}
              height={44}
              className="h-full w-full rounded-md object-contain"
              priority
            />
          </span>
          <span className="font-display text-lg font-semibold text-white">
            GERME <span className="text-germe-wheat">Admin</span>
          </span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-white/75 lg:flex">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <NotificationsBell sombre />
          <Link
            href="/plateforme"
            className="text-sm text-white/60 hover:text-white"
          >
            ← Vers la plateforme
          </Link>
          <span className="text-sm text-white/75">{utilisateur?.fullName}</span>
          <button
            type="button"
            onClick={seDeconnecter}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Se déconnecter
          </button>
        </div>

        <button
          type="button"
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOuvert}
          onClick={() => setMenuOuvert((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
        >
          <span
            className={`absolute h-0.5 w-5 bg-white transition-all duration-200 ${menuOuvert ? "rotate-45" : "-translate-y-1.5"}`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-white transition-all duration-200 ${menuOuvert ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-white transition-all duration-200 ${menuOuvert ? "-rotate-45" : "translate-y-1.5"}`}
          />
        </button>

        {menuOuvert && (
          <>
            <div
              className="fixed inset-0 z-40 bg-germe-ink/15 lg:hidden"
              onClick={() => setMenuOuvert(false)}
              aria-hidden="true"
            />
            <nav className="absolute right-5 top-full z-50 mt-3 w-64 max-w-[80vw] animate-menu-pop rounded-2xl border border-germe-ink/10 bg-white p-4 shadow-2xl lg:hidden">
              <ul className="flex flex-col gap-1 text-sm font-medium text-germe-ink/80">
                {LIENS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setMenuOuvert(false)}
                      className="block rounded-lg px-3 py-2.5 transition hover:bg-germe-green/10 hover:text-germe-green"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/plateforme"
                    onClick={() => setMenuOuvert(false)}
                    className="block rounded-lg px-3 py-2.5 transition hover:bg-germe-green/10 hover:text-germe-green"
                  >
                    ← Vers la plateforme
                  </Link>
                </li>
              </ul>
              <div className="mt-3 border-t border-germe-ink/10 pt-3">
                <button
                  type="button"
                  onClick={seDeconnecter}
                  className="block w-full rounded-full bg-germe-ink/5 px-5 py-2.5 text-center text-sm font-medium text-germe-ink"
                >
                  Se déconnecter
                </button>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
