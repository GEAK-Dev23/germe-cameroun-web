import Reveal from "@/components/vitrine/Reveal";

const MISSIONS = [
  {
    icone: "🧭",
    titre: "Consulting et Appui Stratégique",
    texte:
      "Réaliser des diagnostics organisationnels, des études de faisabilité, des plans stratégiques et des plans d'affaires pour les entreprises, ONG et collectivités.",
  },
  {
    icone: "🎓",
    titre: "Formation et Renforcement de Capacités",
    texte:
      "Déployer le programme GERME et d'autres approches innovantes pour doter les entrepreneurs et les organisations des compétences en gestion, finance, marketing et leadership.",
  },
  {
    icone: "🚀",
    titre: "Entrepreneuriat et Insertion Socio-économique",
    texte:
      "Accompagner la création, la formalisation et la croissance des micro, petites et moyennes entreprises, avec un focus sur les jeunes et les femmes.",
  },
  {
    icone: "🌍",
    titre: "Environnement, Climat et Genre",
    texte:
      "Intégrer systématiquement les dimensions de durabilité environnementale, de résilience climatique et d'équité de genre dans tous nos projets et conseils.",
  },
  {
    icone: "📈",
    titre: "Suivi-Évaluation et Capitalisation",
    texte:
      "Assurer la qualité, la redevabilité et la mesure d'impact de nos interventions pour garantir des résultats durables.",
  },
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
              Nos missions
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
              Nos missions
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80">
            GERME Cameroun a pour mission de fournir des services intégrés de
            consulting, de formation et d'accompagnement pour promouvoir
            l'entrepreneuriat durable et la performance organisationnelle.
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-germe-wheat">
            Nos missions spécifiques
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((m, i) => (
            <Reveal key={m.titre} delay={i * 90}>
              <div className="flex h-full flex-col items-start gap-3 rounded-xl border border-white/25 bg-white/15 p-6 text-left backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/25">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-germe-wheat text-2xl">
                  {m.icone}
                </span>
                <p className="text-sm font-semibold text-white">
                  {i + 1}. {m.titre}
                </p>
                <p className="text-sm text-white/80">{m.texte}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
