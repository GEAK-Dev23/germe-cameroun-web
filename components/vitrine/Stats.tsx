"use client";

import { useEffect, useRef, useState } from "react";
import MirrorImage from "@/components/vitrine/MirrorImage";

const CHIFFRES = [
  { valeur: 3500, prefixe: "+", suffixe: "", label: "jeunes et femmes formés" },
  {
    valeur: 68,
    prefixe: "",
    suffixe: "%",
    label: "de taux d'insertion économique après formation",
  },
  {
    valeur: 450,
    prefixe: "+",
    suffixe: "",
    label: "entreprises et coopératives accompagnées",
  },
  { valeur: 12, prefixe: "", suffixe: "", label: "régions d'intervention couvertes" },
  { valeur: 10, prefixe: "+", suffixe: "", label: "partenariats locaux mobilisés" },
];

const DUREE_MS = 1400;

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [compteurs, setCompteurs] = useState(CHIFFRES.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let frameId: number;
    const debut = performance.now();

    const animer = (maintenant: number) => {
      const progression = Math.min((maintenant - debut) / DUREE_MS, 1);
      // easing "ease-out" pour un comptage qui ralentit en fin de course
      const facteur = 1 - Math.pow(1 - progression, 3);
      setCompteurs(CHIFFRES.map((c) => Math.round(c.valeur * facteur)));
      if (progression < 1) {
        frameId = requestAnimationFrame(animer);
      }
    };

    frameId = requestAnimationFrame(animer);
    return () => cancelAnimationFrame(frameId);
  }, [visible]);

  return (
    <section className="bg-germe-blue">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:grid-cols-2 md:items-center md:px-6"
      >
        <div className="relative min-h-[260px] overflow-hidden rounded-2xl shadow-lg">
          <MirrorImage
            src="/images/stats/tracteur-champ.jpg"
            alt="Tracteur dans un champ de céréales"
            className="absolute inset-0"
            imgClassName="transition duration-700 hover:scale-105"
            intensite={0.25}
          />
          <div className="pointer-events-none absolute inset-0 bg-germe-blueDark/30" />
          <div className="absolute left-6 top-6 rounded-xl bg-white px-5 py-4 shadow-lg">
            <p className="font-display text-3xl font-bold text-germe-blue">
              {CHIFFRES[0].prefixe}
              {compteurs[0]}
            </p>
            <p className="text-xs text-germe-ink/70">{CHIFFRES[0].label}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-wheat">
            Nos résultats
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">
            Chiffres clés (2022 - 2025)
          </h2>
          <p className="mt-3 text-sm text-white/75">
            Des parcours pensés pour un impact réel sur le terrain, mesuré à
            chaque promotion.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-5">
            {CHIFFRES.slice(1).map((c, i) => (
              <div key={c.label}>
                <p className="font-display text-2xl font-bold text-germe-wheat">
                  {c.prefixe}
                  {compteurs[i + 1]}
                  {c.suffixe}
                </p>
                <p className="mt-1 text-xs text-white/75">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
