"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { webinairesApi, ApiError, type Webinaire } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function formaterDateHeure(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(
    new Date(date),
  );
}

export default function WebinairesPage() {
  const [webinaires, setWebinaires] = useState<Webinaire[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nonEligible, setNonEligible] = useState<string | null>(null);

  useEffect(() => {
    webinairesApi
      .lister()
      .then(setWebinaires)
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 403) {
          setNonEligible(err.message);
        } else {
          setErreur(err instanceof ApiError ? err.message : "Erreur de chargement.");
        }
      })
      .finally(() => setChargement(false));
  }, []);

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

  const maintenant = Date.now();
  const aVenir = webinaires.filter((w) => new Date(w.dateHeure).getTime() >= maintenant);
  const passes = webinaires.filter((w) => new Date(w.dateHeure).getTime() < maintenant);

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 md:px-6">
      <PageHeader
        icone="📹"
        titre="Webinaires & classes virtuelles"
        sousTitre="Rejoignez nos sessions en direct avec l'équipe pédagogique."
      />

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>}

      {!chargement && (
        <>
          <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-germe-ink/40">À venir</h2>
          {aVenir.length === 0 ? (
            <div className="mt-3">
              <EmptyState icone="📅" titre="Aucun webinaire programmé" message="Revenez bientôt pour découvrir les prochaines sessions." />
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {aVenir.map((w) => (
                <div key={w.id} className="rounded-2xl border border-germe-green/20 bg-gradient-to-br from-germe-greenLight to-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-germe-green/15 text-lg">🎥</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-germe-ink">{w.titre}</p>
                      <p className="mt-0.5 text-xs text-germe-ink/60">
                        {formaterDateHeure(w.dateHeure)}
                        {w.animePar && ` · Animé par ${w.animePar}`}
                      </p>
                    </div>
                  </div>
                  {w.description && (
                    <p className="mt-3 text-sm text-germe-ink/70">{w.description}</p>
                  )}
                  <a
                    href={w.lienVisio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
                  >
                    Rejoindre la session →
                  </a>
                </div>
              ))}
            </div>
          )}

          {passes.length > 0 && (
            <>
              <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-germe-ink/40">Passés</h2>
              <div className="mt-3 space-y-2">
                {passes.map((w) => (
                  <div key={w.id} className="rounded-xl bg-germe-cream/70 p-4">
                    <p className="text-sm font-medium text-germe-ink/70">{w.titre}</p>
                    <p className="text-xs text-germe-ink/40">{formaterDateHeure(w.dateHeure)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
