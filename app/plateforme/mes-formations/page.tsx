"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  progressionApi,
  ApiError,
  type FormationAvecCurriculum,
  type EtatFormation,
} from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

const IMAGE_PAR_DEFAUT = "/images/produits/maraichage.jpg";

function calculerProgression(etat: EtatFormation): number {
  const totalChapitres = etat.modules.reduce((s, m) => s + m.chapitres.length, 0);
  if (totalChapitres === 0) return 0;
  const chapitresReussis = etat.modules.reduce(
    (s, m) => s + m.chapitres.filter((c) => c.testReussi || !c.testExiste).length,
    0,
  );
  return Math.round((chapitresReussis / totalChapitres) * 100);
}

export default function MesFormationsPage() {
  const [formations, setFormations] = useState<{ formation: FormationAvecCurriculum; etat: EtatFormation }[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    progressionApi
      .mesFormations()
      .then(setFormations)
      .catch((err) =>
        setErreur(err instanceof ApiError ? err.message : "Erreur de chargement."),
      )
      .finally(() => setChargement(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <PageHeader
        icone="🎓"
        titre="Mes formations"
        sousTitre="Reprenez là où vous vous êtes arrêté."
        action={
          <Link
            href="/plateforme"
            className="rounded-full border border-germe-ink/15 bg-white px-4 py-2 text-xs font-medium text-germe-ink/70 shadow-sm transition hover:border-germe-blue hover:text-germe-blue"
          >
            Voir le catalogue complet
          </Link>
        }
      />

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>}

      {!chargement && formations.length === 0 && !erreur && (
        <div className="mt-8">
          <EmptyState
            icone="🎓"
            titre="Vous n'avez pas encore commencé de formation"
            message="Parcourez le catalogue pour démarrer votre première formation."
          />
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {formations.map(({ formation, etat }) => {
          const pourcentage = calculerProgression(etat);
          return (
            <Link
              key={formation.id}
              href={`/plateforme/formations/${formation.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-germe-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formation.imageCouverture ?? IMAGE_PAR_DEFAUT}
                  alt=""
                  className="aspect-video w-full object-cover transition duration-700 group-hover:scale-105"
                />
                {etat.attestationDebloquee && (
                  <span className="absolute right-3 top-3 rounded-full bg-germe-green px-3 py-1 text-xs font-semibold text-white shadow">
                    🏆 Terminée
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-medium uppercase tracking-wide text-germe-green">
                  {formation.categorie}
                </span>
                <h3 className="mt-1 font-display text-base font-semibold text-germe-ink">
                  {formation.titre}
                </h3>

                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-germe-cream">
                    <div
                      className="h-full rounded-full bg-germe-green transition-all"
                      style={{ width: `${pourcentage}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-germe-ink/50">
                    {pourcentage}% complété
                  </p>
                </div>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-germe-blue">
                  Continuer
                  <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
