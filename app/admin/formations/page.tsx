"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formationsApi, ApiError, type Formation } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminFormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  function recharger() {
    setChargement(true);
    formationsApi
      .listerToutes()
      .then(setFormations)
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  async function basculerPublication(f: Formation) {
    await formationsApi.modifier(f.id, { publie: !f.publie });
    recharger();
  }

  async function supprimer(f: Formation) {
    if (!confirm(`Supprimer définitivement "${f.titre}" et tout son contenu ?`))
      return;
    await formationsApi.supprimer(f.id);
    recharger();
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-6">
      <PageHeader
        icone="🎓"
        titre="Formations"
        sousTitre={`${formations.length} formation${formations.length > 1 ? "s" : ""} au total.`}
        action={
          <Link
            href="/admin/formations/nouvelle"
            className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
          >
            + Nouvelle formation
          </Link>
        }
      />

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}

      {!chargement && formations.length === 0 && !erreur && (
        <div className="mt-10">
          <EmptyState icone="🎓" titre="Aucune formation pour le moment" message="Créez votre première formation pour démarrer." />
        </div>
      )}

      <div className="mt-8 space-y-3">
        {formations.map((f) => (
          <div
            key={f.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-germe-ink/10 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              {f.imageCouverture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.imageCouverture}
                  alt=""
                  className="h-14 w-24 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-xl bg-germe-cream text-[10px] text-germe-ink/30">
                  Pas d'image
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display font-medium text-germe-ink">
                    {f.titre}
                  </p>
                  <span
                    className={
                      f.publie
                        ? "rounded-full bg-germe-green/15 px-2.5 py-0.5 text-xs font-medium text-germe-green"
                        : "rounded-full bg-germe-ink/10 px-2.5 py-0.5 text-xs font-medium text-germe-ink/60"
                    }
                  >
                    {f.publie ? "Publiée" : "Brouillon"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-germe-ink/50">
                  {f.categorie} ·{" "}
                  {f.estPayant
                    ? `${f.prixFcfa.toLocaleString("fr-FR")} FCFA`
                    : "Gratuit"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => basculerPublication(f)}
                className="rounded-full border border-germe-ink/15 px-4 py-2 text-xs font-medium text-germe-ink transition hover:border-germe-green hover:text-germe-green"
              >
                {f.publie ? "Dépublier" : "Publier"}
              </button>
              <Link
                href={`/admin/formations/${f.id}`}
                className="rounded-full bg-germe-blue px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-germe-blueDark"
              >
                Gérer le contenu
              </Link>
              <button
                type="button"
                onClick={() => supprimer(f)}
                className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
