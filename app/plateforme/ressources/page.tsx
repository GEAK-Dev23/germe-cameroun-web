"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ressourcesApi, ApiError, type Ressource } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function RessourcesPage() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nonEligible, setNonEligible] = useState<string | null>(null);
  const [categorieActive, setCategorieActive] = useState<string | null>(null);

  useEffect(() => {
    ressourcesApi
      .lister()
      .then(setRessources)
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 403) {
          setNonEligible(err.message);
        } else {
          setErreur(err instanceof ApiError ? err.message : "Erreur de chargement.");
        }
      })
      .finally(() => setChargement(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(ressources.map((r) => r.categorie))],
    [ressources],
  );

  const ressourcesFiltrees = categorieActive
    ? ressources.filter((r) => r.categorie === categorieActive)
    : ressources;

  if (!chargement && nonEligible) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat/40 text-2xl">
          🔒
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink">
          Pas encore disponible
        </h1>
        <p className="mt-2 text-sm text-germe-ink/60">{nonEligible}</p>
        <Link href="/plateforme" className="mt-6 inline-block text-sm text-germe-blue hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <PageHeader
        icone="📚"
        titre="Bibliothèque de ressources"
        sousTitre="Modèles, guides et fiches pratiques — propres aux formations que vous suivez ou avez suivies."
      />

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategorieActive(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition ${
              categorieActive === null
                ? "bg-germe-green text-white"
                : "bg-white text-germe-ink/70 hover:bg-germe-cream"
            }`}
          >
            Tout voir
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategorieActive(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition ${
                categorieActive === c
                  ? "bg-germe-green text-white"
                  : "bg-white text-germe-ink/70 hover:bg-germe-cream"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && (
        <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>
      )}

      {!chargement && ressourcesFiltrees.length === 0 && !erreur && (
        <div className="mt-8">
          <EmptyState
            icone="📄"
            titre="Aucune ressource disponible pour le moment"
            message="Revenez bientôt : l'équipe pédagogique ajoute régulièrement de nouveaux modèles et guides."
          />
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ressourcesFiltrees.map((r) => (
          <a
            key={r.id}
            href={r.fichierUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-germe-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-germe-green/30 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-germe-blueLight to-germe-blue/20 text-xl transition group-hover:scale-105">
              📄
            </span>
            <p className="mt-4 font-medium text-germe-ink">{r.titre}</p>
            {r.description && (
              <p className="mt-1 text-xs text-germe-ink/50">{r.description}</p>
            )}
            <p className="mt-2 text-[11px] text-germe-ink/40">
              {r.formations.map((f) => f.titre).join(", ")}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-block rounded-full bg-germe-cream px-2.5 py-0.5 text-[11px] font-medium text-germe-ink/60">
                {r.categorie}
              </span>
              <span className="text-xs font-medium text-germe-green opacity-0 transition group-hover:opacity-100">
                Ouvrir →
              </span>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
