"use client";

import Link from "next/link";
import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";

export type Formation = {
  id: string;
  titre: string;
  description: string;
  image: string;
  estPayant: boolean;
  prixFcfa?: number;
  categorie: string;
  progression?: number; // 0-100, présent seulement si déjà commencée
};

// Données de démonstration — à remplacer par un appel à l'API NestJS
// (GET /formations) une fois le backend branché.
export const FORMATIONS_DEMO: Formation[] = [
  {
    id: "intro-agriculture-durable",
    titre: "Introduction à l'agriculture durable",
    description:
      "Les bases pour démarrer une exploitation respectueuse des sols.",
    image: "/images/produits/maraichage.jpg",
    estPayant: false,
    categorie: "Agriculture",
    progression: 40,
  },
  {
    id: "elevage-volailles-fondamentaux",
    titre: "Élevage de volailles : les fondamentaux",
    description: "Alimentation, santé animale et rentabilité d'un poulailler.",
    image: "/images/produits/betail.jpg",
    estPayant: false,
    categorie: "Élevage",
  },
  {
    id: "maraichage-intensif-hors-sol",
    titre: "Maraîchage intensif hors-sol",
    description: "Techniques modernes pour maximiser le rendement au m².",
    image: "/images/produits/manioc.jpg",
    estPayant: true,
    prixFcfa: 15000,
    categorie: "Agriculture",
  },
  {
    id: "plan-affaires-exploitation",
    titre: "Monter et financer son exploitation",
    description:
      "Structurer un plan d'affaires solide et convaincre un bailleur.",
    image: "/images/produits/cacao.jpg",
    estPayant: true,
    prixFcfa: 20000,
    categorie: "Gestion",
  },
  {
    id: "machinisme-agricole",
    titre: "Machinisme agricole",
    description: "Utilisation et entretien courant des équipements motorisés.",
    image: "/images/produits/mais.jpg",
    estPayant: true,
    prixFcfa: 12000,
    categorie: "Équipement",
  },
];

export default function CatalogueFormations() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FORMATIONS_DEMO.map((f, i) => (
        <Reveal key={f.id} delay={(i % 3) * 90}>
          <Link
            href={`/plateforme/formations/${f.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-germe-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative">
              <MirrorImage
                src={f.image}
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
                  ? `${f.prixFcfa?.toLocaleString("fr-FR")} FCFA`
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

              {typeof f.progression === "number" ? (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs font-medium text-germe-ink/70">
                    <span>Progression</span>
                    <span>{f.progression}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-germe-ink/10">
                    <div
                      className="h-1.5 rounded-full bg-germe-green"
                      style={{ width: `${f.progression}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-germe-blue">
                  Découvrir
                  <span
                    aria-hidden="true"
                    className="transition group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              )}
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
