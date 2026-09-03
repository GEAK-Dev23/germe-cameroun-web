"use client";

import { useEffect, useRef, useState } from "react";

const BARRES = [
  { label: "Apprenants certifiés", valeur: 85 },
  { label: "Taux de satisfaction", valeur: 92 },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section className="bg-white">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-2xl shadow-lg md:grid-cols-2 md:mx-6 md:my-20"
      >
        <div className="relative min-h-[260px] overflow-hidden">
          <img
            src="/images/stats/tracteur-champ.jpg"
            alt="Tracteur dans un champ de céréales"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-germe-blue/30" />
          <div className="absolute left-6 top-6 rounded-xl bg-germe-blue px-5 py-4 text-white shadow-lg">
            <p className="font-display text-3xl font-bold">15+</p>
            <p className="text-xs">Ans d'engagement</p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Nos résultats
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-germe-ink md:text-2xl">
            Une formation qui porte ses fruits
          </h2>
          <p className="mt-3 text-sm text-germe-ink/70">
            Des parcours pensés pour un impact réel sur le terrain, mesuré à
            chaque promotion.
          </p>

          <div className="mt-6 space-y-5">
            {BARRES.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-sm font-medium text-germe-ink">
                  <span>{b.label}</span>
                  <span>{visible ? b.valeur : 0}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-germe-ink/10">
                  <div
                    className="h-2 rounded-full bg-germe-green transition-all duration-[1400ms] ease-out"
                    style={{ width: visible ? `${b.valeur}%` : "0%" }}
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
