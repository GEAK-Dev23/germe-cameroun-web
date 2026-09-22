"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi, progressionApi, type Utilisateur } from "@/lib/api";
import NotificationsBell from "@/components/layout/NotificationsBell";

const LIENS = [
  { href: "/plateforme", label: "Catalogue" },
  { href: "/plateforme/mes-formations", label: "Mes formations" },
  { href: "/plateforme/ressources", label: "Ressources", gated: true },
  { href: "/plateforme/outils/simulateur-rentabilite", label: "Simulateur rapide", gated: true },
  { href: "/plateforme/forum", label: "Forum" },
  { href: "/plateforme/webinaires", label: "Webinaires", gated: true },
  { href: "/plateforme/reseau", label: "Réseau", gated: true },
  { href: "/plateforme/messages", label: "Messages", gated: true },
  { href: "/plateforme/certificats", label: "Certificats" },
];

const LIBELLES_ROLES: Record<Utilisateur["role"], string> = {
  super_admin: "Super admin",
  admin: "Admin",
  formateur: "Formateur",
  apprenant: "Apprenant",
};

export default function PlateformeSidebar({
  ouvert,
  onFermer,
}: {
  ouvert: boolean;
  onFermer: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [eligible, setEligible] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(({ utilisateur }) => setUtilisateur(utilisateur))
      .catch(() => setUtilisateur(null));
  }, []);

  useEffect(() => {
    if (utilisateur?.role !== "apprenant") return;
    progressionApi
      .eligibiliteFonctionnalites()
      .then(({ eligible }) => setEligible(eligible))
      .catch(() => {});
  }, [utilisateur]);

  async function seDeconnecter() {
    await authApi.logout().catch(() => {});
    router.push("/");
    router.refresh();
  }

  const estAdmin =
    utilisateur?.role === "super_admin" ||
    utilisateur?.role === "admin" ||
    utilisateur?.role === "formateur";
  const initiale = utilisateur?.fullName?.charAt(0).toUpperCase() ?? "?";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-gradient-to-br from-germe-blueDark via-germe-blue to-germe-green shadow-2xl transition-transform duration-300 ease-out ${
        ouvert ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Texture en pointillés + halos, cohérents avec la page de connexion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full bg-white/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-12 h-64 w-64 rounded-full bg-germe-wheat/10 blur-3xl"
      />

      {/* En-tête : logo + bouton de réduction */}
      <div className="relative flex items-center justify-between gap-2 px-5 pt-6">
        <Link href="/plateforme" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow">
            <Image
              src="/images/logo/logo-germe.jpeg"
              alt="GERME Cameroun"
              width={44}
              height={44}
              className="h-full w-full rounded-lg object-contain"
              priority
            />
          </span>
          <span className="truncate font-display text-base font-semibold text-white">
            GERME <span className="text-germe-wheat">Cameroun</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onFermer}
          aria-label="Réduire le menu"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative mt-8 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {LIENS.map((l) => {
          const actif = pathname === l.href;
          const verrouille = l.gated && utilisateur?.role === "apprenant" && !eligible;
          if (verrouille) {
            return (
              <span
                key={l.href}
                title="Devient accessible dès votre première formation commencée"
                className="flex cursor-not-allowed items-center gap-1.5 rounded-xl border-l-2 border-transparent px-4 py-2.5 text-sm font-medium text-white/30"
              >
                🔒 {l.label}
              </span>
            );
          }
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center rounded-xl border-l-2 px-4 py-2.5 text-sm font-medium transition ${
                actif
                  ? "border-germe-wheat bg-white/15 text-white"
                  : "border-transparent text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Pied : profil + notifications + déconnexion */}
      <div className="relative border-t border-white/10 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
              {initiale}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">
                {utilisateur?.fullName ?? "..."}
              </p>
              <p className="text-[11px] text-white/50">
                {utilisateur ? LIBELLES_ROLES[utilisateur.role] : ""}
              </p>
            </div>
          </div>
          <NotificationsBell sombre />
        </div>

        <div className="mt-3 flex flex-col gap-0.5">
          <Link
            href="/plateforme/profil"
            className="rounded-lg px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Mon profil
          </Link>
          {estAdmin && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Espace admin
            </Link>
          )}
          <button
            type="button"
            onClick={seDeconnecter}
            className="rounded-lg px-3 py-2 text-left text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}
