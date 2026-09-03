"use client";

import { useState } from "react";
import Reveal from "@/components/vitrine/Reveal";

const AVIS = [
  {
    nom: "Jonathan Ateba",
    lieu: "Bafoussam",
    texte:
      "La formation en maraîchage m'a permis de doubler ma récolte en une saison. Les exercices pratiques font vraiment la différence.",
    photo: "/images/temoignages/jonathan.jpg",
  },
  {
    nom: "Sandrine Mballa",
    lieu: "Yaoundé",
    texte:
      "Grâce au plan d'affaires généré après ma certification, j'ai pu obtenir un financement pour agrandir mon élevage de volailles.",
    photo: "/images/temoignages/sandrine.jpg",
  },
];

export default function Temoignages() {
  const [index, setIndex] = useState(0);
  const avis = AVIS[index];

  return (
    <section className="bg-germe-cream">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Témoignages
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Ce que disent nos apprenants
          </h2>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 rounded-2xl border border-germe-ink/10 bg-white p-8 text-left shadow-sm"
        >
          <div className="flex items-center gap-4">
            <img
              src={avis.photo}
              alt={avis.nom}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p className="font-display font-semibold text-germe-ink">
                {avis.nom}
              </p>
              <p className="text-xs text-germe-ink/60">{avis.lieu}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-germe-ink/70">
            « {avis.texte} »
          </p>
        </Reveal>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + AVIS.length) % AVIS.length)}
            aria-label="Témoignage précédent"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-germe-ink/20 text-germe-ink transition hover:border-germe-green hover:text-germe-green"
          >
            ←
          </button>
          <div className="flex gap-2">
            {AVIS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Voir le témoignage ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition ${i === index ? "bg-germe-green" : "bg-germe-ink/20"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % AVIS.length)}
            aria-label="Témoignage suivant"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-germe-ink/20 text-germe-ink transition hover:border-germe-green hover:text-germe-green"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
