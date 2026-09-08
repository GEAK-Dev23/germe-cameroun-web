"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi, type Utilisateur } from "@/lib/api";

const LIENS = [
  { href: "/plateforme", label: "Catalogue" },
  { href: "/plateforme/mes-formations", label: "Mes formations" },
  { href: "/plateforme/certificats", label: "Certificats" },
];

const LIBELLES_ROLES: Record<Utilisateur["role"], string> = {
  super_admin: "Super admin",
  admin: "Admin",
  formateur: "Formateur",
  apprenant: "Apprenant",
};

export default function PlateformeNavbar() {
  const router = useRouter();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [profilOuvert, setProfilOuvert] = useState(false);
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

  const estAdmin =
    utilisateur?.role === "super_admin" || utilisateur?.role === "admin";
  const initiale = utilisateur?.fullName?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 border-b border-germe-ink/10 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <Link
          href="/plateforme"
          className="font-display text-lg font-semibold text-germe-blue"
        >
          GERME <span className="text-germe-green">Cameroun</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-germe-ink/80 lg:flex">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-germe-green"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfilOuvert((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-germe-ink/10 py-1.5 pl-1.5 pr-3 transition hover:border-germe-green"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-germe-green text-xs font-semibold text-white">
                {initiale}
              </span>
              <span className="text-sm font-medium text-germe-ink">
                {utilisateur ? LIBELLES_ROLES[utilisateur.role] : "..."}
              </span>
            </button>

            {profilOuvert && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfilOuvert(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 animate-menu-pop rounded-2xl border border-germe-ink/10 bg-white p-2 shadow-2xl">
                  <div className="px-3 py-2 text-xs text-germe-ink/50">
                    {utilisateur?.email}
                  </div>
                  <Link
                    href="/plateforme/profil"
                    className="block rounded-lg px-3 py-2.5 text-sm text-germe-ink/80 transition hover:bg-germe-green/10 hover:text-germe-green"
                  >
                    Mon profil
                  </Link>
                  {estAdmin && (
                    <Link
                      href="/admin"
                      className="block rounded-lg px-3 py-2.5 text-sm text-germe-ink/80 transition hover:bg-germe-green/10 hover:text-germe-green"
                    >
                      Espace admin
                    </Link>
                  )}
                  <div className="my-1 border-t border-germe-ink/10" />
                  <button
                    type="button"
                    onClick={seDeconnecter}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-germe-ink/80 transition hover:bg-germe-ink/5"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOuvert}
          onClick={() => setMenuOuvert((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-germe-ink/5 lg:hidden"
        >
          <span
            className={`absolute h-0.5 w-5 bg-germe-ink transition-all duration-200 ${menuOuvert ? "rotate-45" : "-translate-y-1.5"}`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-germe-ink transition-all duration-200 ${menuOuvert ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-germe-ink transition-all duration-200 ${menuOuvert ? "-rotate-45" : "translate-y-1.5"}`}
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
                {estAdmin && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setMenuOuvert(false)}
                      className="block rounded-lg px-3 py-2.5 transition hover:bg-germe-green/10 hover:text-germe-green"
                    >
                      Espace admin
                    </Link>
                  </li>
                )}
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
