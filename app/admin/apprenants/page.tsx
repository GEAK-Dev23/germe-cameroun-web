"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { suiviApi, ApiError, type UtilisateurAdmin } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function initiales(nom: string): string {
  return nom.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminApprenantsPage() {
  const [apprenants, setApprenants] = useState<UtilisateurAdmin[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    suiviApi
      .apprenants()
      .then(setApprenants)
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }, []);

  const filtres = apprenants.filter(
    (a) =>
      a.fullName.toLowerCase().includes(recherche.toLowerCase()) ||
      a.email.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <PageHeader
        icone="👤"
        titre="Suivi des apprenants"
        sousTitre={`${apprenants.length} apprenant${apprenants.length !== 1 ? "s" : ""} — consultez la progression individuelle de chacun.`}
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
          {filtres.map((a) => (
            <Link
              key={a.id}
              href={`/admin/apprenants/${a.id}`}
              className="flex items-center gap-3 rounded-2xl border border-germe-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-germe-blue/30 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-germe-blue to-germe-green text-xs font-semibold text-white">
                {initiales(a.fullName)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-germe-ink">{a.fullName}</p>
                <p className="text-xs text-germe-ink/50">{a.email}</p>
              </div>
              <span className="text-germe-ink/30">→</span>
            </Link>
          ))}
          {filtres.length === 0 && (
            <EmptyState icone="👤" titre="Aucun apprenant ne correspond à cette recherche" />
          )}
        </div>
      )}
    </main>
  );
}
