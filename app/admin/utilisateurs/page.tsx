"use client";

import { useEffect, useState } from "react";
import {
  usersApi,
  authApi,
  ApiError,
  type UtilisateurAdmin,
  type RoleUtilisateur,
  type Utilisateur,
} from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

const LIBELLES_ROLES: Record<RoleUtilisateur, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  formateur: "Formateur",
  apprenant: "Apprenant",
};

function initiales(nom: string): string {
  return nom.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminUtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurAdmin[]>([]);
  const [moi, setMoi] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");

  function recharger() {
    setChargement(true);
    Promise.all([usersApi.lister(), authApi.me()])
      .then(([liste, { utilisateur }]) => {
        setUtilisateurs(liste);
        setMoi(utilisateur);
      })
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  async function changerRole(id: string, role: RoleUtilisateur) {
    try {
      await usersApi.changerRole(id, role);
      recharger();
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : "Impossible de modifier ce rôle.",
      );
    }
  }

  const peutChangerRoles = moi?.role === "super_admin";

  const utilisateursFiltres = utilisateurs.filter(
    (u) =>
      u.fullName.toLowerCase().includes(recherche.toLowerCase()) ||
      u.email.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <PageHeader
        icone="⚙️"
        titre="Utilisateurs"
        sousTitre={`${utilisateurs.length} compte${utilisateurs.length !== 1 ? "s" : ""} sur la plateforme.${
          !peutChangerRoles ? " (seul un super admin peut modifier les rôles)" : ""
        }`}
      />

      <input
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        placeholder="Rechercher par nom ou email..."
        className="mt-6 w-full max-w-sm rounded-lg border border-germe-ink/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-germe-blue focus:outline-none"
      />

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && (
        <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>
      )}

      {!chargement && (
        <div className="mt-6 space-y-2">
          {utilisateursFiltres.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-germe-ink/10 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-germe-blue to-germe-green text-xs font-semibold text-white">
                  {initiales(u.fullName)}
                </span>
                <div>
                  <p className="font-medium text-germe-ink">{u.fullName}</p>
                  <p className="text-xs text-germe-ink/50">{u.email}</p>
                </div>
              </div>

              {peutChangerRoles ? (
                <select
                  value={u.role}
                  onChange={(e) =>
                    changerRole(u.id, e.target.value as RoleUtilisateur)
                  }
                  className="rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
                >
                  {Object.entries(LIBELLES_ROLES).map(([valeur, label]) => (
                    <option key={valeur} value={valeur}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="rounded-full bg-germe-cream px-3 py-1 text-xs font-medium text-germe-ink/70">
                  {LIBELLES_ROLES[u.role]}
                </span>
              )}
            </div>
          ))}
          {utilisateursFiltres.length === 0 && (
            <EmptyState icone="⚙️" titre="Aucun utilisateur ne correspond à cette recherche" />
          )}
        </div>
      )}
    </main>
  );
}
