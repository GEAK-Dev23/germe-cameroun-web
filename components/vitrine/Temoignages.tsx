"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";
import { vitrineApi, type Temoignage } from "@/lib/api";

function Initiales({ nom }: { nom: string }) {
  const initiales = nom
    .split(" ")
    .map((mot) => mot[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-germe-green/15 font-display text-lg font-semibold text-germe-green">
      {initiales}
    </div>
  );
}

export default function Temoignages() {
  const [avisListe, setAvisListe] = useState<Temoignage[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    vitrineApi
      .temoignages()
      .then(setAvisListe)
      .catch(() => {});
  }, []);

  if (avisListe.length === 0) return null;

  const avis = avisListe[index];

  return (
    <section className="bg-gradient-to-br from-germe-blueLight to-germe-greenLight">
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
          className="mt-10 rounded-2xl border border-white/60 bg-white p-8 text-left shadow-md"
        >
          <div key={index} className="animate-fade-up">
            <div className="flex items-center gap-4">
              {avis.photoUrl ? (
                <MirrorImage
                  src={avis.photoUrl}
                  alt={avis.nom}
                  className="h-14 w-14 rounded-full"
                  intensite={0.18}
                />
              ) : (
                <Initiales nom={avis.nom} />
              )}
              <div>
                <p className="font-display font-semibold text-germe-ink">{avis.nom}</p>
                <p className="text-xs text-germe-ink/60">{avis.fonction}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-germe-ink/70">
              « {avis.texte} »
            </p>
          </div>
        </Reveal>

        {avisListe.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + avisListe.length) % avisListe.length)}
              aria-label="Témoignage précédent"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-germe-ink/20 bg-white text-germe-ink transition hover:-translate-x-1 hover:border-germe-green hover:text-germe-green"
            >
              ←
            </button>
            <div className="flex gap-2">
              {avisListe.map((_, i) => (
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
              onClick={() => setIndex((i) => (i + 1) % avisListe.length)}
              aria-label="Témoignage suivant"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-germe-ink/20 bg-white text-germe-ink transition hover:translate-x-1 hover:border-germe-green hover:text-germe-green"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
