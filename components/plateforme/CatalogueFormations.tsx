"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";
import { formationsApi, ApiError, type Formation } from "@/lib/api";

const IMAGE_PAR_DEFAUT = "/images/produits/maraichage.jpg";

export default function CatalogueFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    formationsApi
      .listerPubliees()
      .then(setFormations)
      .catch((err) =>
        setErreur(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les formations.",
        ),
      )
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl bg-germe-ink/5"
          />
        ))}
      </div>
    );
  }

  if (erreur) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {erreur}
      </p>
    );
  }

  if (formations.length === 0) {
    return (
      <p className="rounded-xl border border-germe-ink/10 bg-white p-8 text-center text-sm text-germe-ink/60">
        Aucune formation publiée pour le moment — revenez bientôt.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {formations.map((f, i) => (
        <Reveal key={f.id} delay={(i % 3) * 90}>
          <Link
            href={`/plateforme/formations/${f.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-germe-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative">
              <MirrorImage
                src={f.imageCouverture ?? IMAGE_PAR_DEFAUT}
                alt={f.titre}
                className="aspect-video w-full"
                imgClassName="transition duration-700 group-hover:scale-105"
                intensite={0.22}
              />
              <span
                className={
                  f.estPayant
                    ? "absolute right-3 top-3 rounded-full bg-germe-blue px-3 py-1 text-xs font-semibold text-white shadow"
                    : "absolute right-3 top-3 rounded-full bg-germe-green px-3 py-1 text-xs font-semibold text-white shadow"
                }
              >
                {f.estPayant
                  ? `${f.prixFcfa.toLocaleString("fr-FR")} FCFA`
                  : "Gratuit"}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="text-xs font-medium uppercase tracking-wide text-germe-green">
                {f.categorie}
              </span>
              <h3 className="mt-1 font-display text-base font-semibold text-germe-ink">
                {f.titre}
              </h3>
              <p className="mt-1 flex-1 text-sm text-germe-ink/65">
                {f.description}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-germe-blue">
                Découvrir
                <span
                  aria-hidden="true"
                  className="transition group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
