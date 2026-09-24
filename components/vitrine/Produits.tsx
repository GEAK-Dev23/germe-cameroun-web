import Reveal from "@/components/vitrine/Reveal";

const POLES = [
  {
    titre: "PÔLE 1 : Agriculture Durable & Économie Verte",
    items: [
      "Agrobusiness et entrepreneuriat agricole",
      "Élevage, pisciculture et aquaculture",
      "Transformation agroalimentaire",
      "Adaptation climatique et énergies renouvelables",
    ],
  },
  {
    titre: "PÔLE 2 : Entrepreneuriat, Gestion & Innovation",
    items: [
      "Design thinking, création et gestion d'entreprise (GERME / UPSHIFT)",
      "Leadership, management associatif et coopératif",
      "Éducation financière et accès au financement",
      "Numérique, digitalisation des activités et e-commerce",
    ],
  },
  {
    titre: "PÔLE 3 : Métiers Porteurs & Inclusion Sociale",
    items: [
      "Services numériques de proximité, marketing digital et artisanat d'art utilitaire",
      "Cosmétique naturelle locale et production de soins à base de produits du terroir",
      "Communication digitale, branding local et techniques de vente",
      "Intervention sociale, genre et développement communautaire",
    ],
  },
];

export default function Produits() {
  return (
    <section className="bg-germe-greenDark">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-wheat">
            Nos filières
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
            Nos filières de formation
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75">
            Nos parcours de formation professionnalisante sont structurés en 3
            pôles :
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {POLES.map((pole, i) => (
            <Reveal key={pole.titre} delay={i * 100}>
              <div className="flex h-full flex-col rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="font-display text-base font-semibold text-white">
                  {pole.titre}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {pole.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-white/80"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-germe-wheat" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
