"use client";

import { useEffect, useRef, useState } from "react";
import MirrorImage from "@/components/vitrine/MirrorImage";

const BARRES = [
  { label: "Apprenants certifiés", valeur: 85 },
  { label: "Taux de satisfaction", valeur: 92 },
];

const DUREE_MS = 1400;

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [compteurs, setCompteurs] = useState(BARRES.map(() => 0));

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
      setCompteurs(BARRES.map((b) => Math.round(b.valeur * facteur)));
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
              15+
            </p>
            <p className="text-xs text-germe-ink/70">Ans d'engagement</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-wheat">
            Nos résultats
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">
            Une formation qui porte ses fruits
          </h2>
          <p className="mt-3 text-sm text-white/75">
            Des parcours pensés pour un impact réel sur le terrain, mesuré à
            chaque promotion.
          </p>

          <div className="mt-6 space-y-5">
            {BARRES.map((b, i) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-sm font-medium text-white">
                  <span>{b.label}</span>
                  <span className="font-display text-base font-bold text-germe-wheat">
                    {compteurs[i]}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/20">
                  <div
                    className="h-2 rounded-full bg-germe-wheat transition-[width] duration-100 ease-linear"
                    style={{ width: `${compteurs[i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
