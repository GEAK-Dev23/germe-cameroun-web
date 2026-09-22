"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/vitrine/Reveal";
import { vitrineApi, type OffrePartenaire } from "@/lib/api";

export default function OffresPartenaires() {
  const [offres, setOffres] = useState<OffrePartenaire[]>([]);

  useEffect(() => {
    vitrineApi
      .offresPartenaires()
      .then(setOffres)
      .catch(() => {});
  }, []);

  if (offres.length === 0) return null;

  return (
    <section id="partenaires" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Nos partenaires
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Offres et opportunités du réseau
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-germe-ink/60">
            Financements, équipements et opportunités proposés par nos
            partenaires aux entrepreneurs de la communauté GERME.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offres.map((o, i) => (
            <Reveal key={o.id} delay={i * 100}>
              <div className="flex h-full flex-col rounded-xl border border-germe-ink/10 bg-germe-cream p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                {o.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.logoUrl}
                    alt={o.nomPartenaire}
                    className="h-10 w-auto object-contain"
                  />
                )}
                <p className="mt-3 font-display font-semibold text-germe-ink">
                  {o.nomPartenaire}
                </p>
                <p className="mt-2 flex-1 text-sm text-germe-ink/60">{o.description}</p>
                {o.lienExterne && (
                  <a
                    href={o.lienExterne}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-xs font-medium text-germe-green hover:underline"
                  >
                    En savoir plus →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
