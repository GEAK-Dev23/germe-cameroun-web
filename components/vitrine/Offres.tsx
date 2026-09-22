import Reveal from "@/components/vitrine/Reveal";

const AXES = [
  {
    icone: "🏛️",
    titre: "AXE 1 : Ingénierie Conseil & Structuration Organisationnelle",
    texte:
      "Accompagnement stratégique, études, planification et renforcement des capacités des organisations publiques, privées et communautaires.",
  },
  {
    icone: "💼",
    titre: "AXE 2 : Entrepreneuriat & Développement Économique Local",
    texte:
      "Formation entrepreneuriale, insertion économique, développement de chaînes de valeur et création d'emplois durables pour les jeunes et les femmes.",
  },
  {
    icone: "🌿",
    titre: "AXE 3 : Résilience Climatique & Développement Durable",
    texte:
      "Solutions d'adaptation au changement climatique, entrepreneuriat vert et promotion de modèles économiques respectueux de l'environnement.",
  },
  {
    icone: "🤝",
    titre: "AXE 4 : Inclusion Sociale, Genre & Action Humanitaire",
    texte:
      "Autonomisation des femmes et des populations vulnérables, promotion de l'égalité de genre et interventions humanitaires de proximité.",
  },
];

export default function Offres() {
  return (
    <section id="services" className="bg-germe-cream">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Nos domaines
          </p>
          <div className="relative inline-block">
            <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
              Nos 4 axes d'intervention
            </h2>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-full select-none whitespace-nowrap font-display text-2xl font-semibold text-germe-ink [transform:scaleY(-1)] md:text-3xl"
              style={{
                opacity: 0.06,
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
              }}
            >
              Nos 4 axes d'intervention
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-germe-ink/70">
            Nos interventions s'articulent autour de 4 axes complémentaires,
            portés par la synergie de nos entités :
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {AXES.map((a, i) => (
            <Reveal key={a.titre} delay={(i % 2) * 100}>
              <div className="flex h-full items-start gap-4 rounded-xl border border-germe-ink/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:scale-105 hover:shadow-lg">
                <span
                  className={
                    i % 2 === 0
                      ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-germe-green/15 text-2xl"
                      : "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-germe-wheat text-2xl"
                  }
                  aria-hidden="true"
                >
                  {a.icone}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-germe-ink">
                    {a.titre}
                  </h3>
                  <p className="mt-1 text-sm text-germe-ink/70">{a.texte}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
