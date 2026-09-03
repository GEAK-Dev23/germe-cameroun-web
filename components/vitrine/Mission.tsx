import Reveal from "@/components/vitrine/Reveal";

const MISSIONS = [
  { icone: "🤝", titre: "Travail collaboratif", accent: true },
  { icone: "🌱", titre: "Agriculture durable" },
  { icone: "🐄", titre: "Élevage responsable" },
  { icone: "🚜", titre: "Équipement moderne" },
  { icone: "🎓", titre: "Formation certifiante" },
];

export default function Mission() {
  return (
    <section className="bg-germe-cream">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Notre mission
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Agriculture, élevage et formation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-germe-ink/70">
            Quatre entités, une même exigence : transmettre des pratiques
            solides et accompagner chaque projet jusqu'à sa réussite.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {MISSIONS.map((m, i) => (
            <Reveal key={m.titre} delay={i * 90}>
              <div
                className={
                  m.accent
                    ? "flex h-full flex-col items-center gap-3 rounded-xl bg-germe-green p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    : "flex h-full flex-col items-center gap-3 rounded-xl border border-germe-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                }
              >
                <span className="text-3xl" aria-hidden="true">
                  {m.icone}
                </span>
                <p
                  className={
                    m.accent
                      ? "text-sm font-semibold"
                      : "text-sm font-semibold text-germe-ink"
                  }
                >
                  {m.titre}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
