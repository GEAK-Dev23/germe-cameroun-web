import Reveal from "@/components/vitrine/Reveal";

const OFFRES = [
  {
    icone: "🌾",
    titre: "Cultures vivrières",
    texte: "Techniques de culture adaptées aux sols et climats du Cameroun.",
  },
  {
    icone: "🍊",
    titre: "Fruits & vergers",
    texte:
      "Plantation, entretien et récolte des principales filières fruitières.",
  },
  {
    icone: "🥕",
    titre: "Maraîchage",
    texte: "Production maraîchère intensive, y compris hors-sol.",
  },
  {
    icone: "🚜",
    titre: "Machinisme agricole",
    texte: "Utilisation et entretien des équipements agricoles modernes.",
  },
  {
    icone: "📊",
    titre: "Plans d'exploitation",
    texte: "Structurer, budgétiser et financer son projet agricole.",
  },
  {
    icone: "🐐",
    titre: "Élevage",
    texte: "Conduite d'élevage, alimentation et santé animale.",
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
              Ce que GERME Cameroun propose
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
              Ce que GERME Cameroun propose
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {OFFRES.map((o, i) => (
            <Reveal key={o.titre} delay={(i % 2) * 100}>
              <div className="flex h-full items-start gap-4 rounded-xl border border-germe-ink/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:scale-105 hover:shadow-lg">
                <span
                  className={
                    i % 2 === 0
                      ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-germe-green/15 text-2xl"
                      : "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-germe-wheat text-2xl"
                  }
                  aria-hidden="true"
                >
                  {o.icone}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-germe-ink">
                    {o.titre}
                  </h3>
                  <p className="mt-1 text-sm text-germe-ink/70">{o.texte}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
