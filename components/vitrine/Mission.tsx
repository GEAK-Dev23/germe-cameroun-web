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
    <section className="bg-germe-green">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-wheat">
            Notre mission
          </p>
          <div className="relative inline-block">
            <h2 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
              Agriculture, élevage et formation
            </h2>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-full select-none whitespace-nowrap font-display text-2xl font-semibold text-white [transform:scaleY(-1)] md:text-3xl"
              style={{
                opacity: 0.12,
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
              }}
            >
              Agriculture, élevage et formation
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
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
                    ? "flex h-full flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                    : "flex h-full flex-col items-center gap-3 rounded-xl border border-white/25 bg-white/15 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/25"
                }
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat text-2xl">
                  {m.icone}
                </span>
                <p
                  className={
                    m.accent
                      ? "text-sm font-semibold text-germe-green"
                      : "text-sm font-semibold text-white"
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
