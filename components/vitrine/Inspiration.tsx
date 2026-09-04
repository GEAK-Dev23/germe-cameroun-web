import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";
import Organigramme from "@/components/organigramme/Organigramme";

export default function Inspiration() {
  return (
    <section id="apropos" className="bg-germe-greenLight">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-6 md:py-28">
        {/* Collage photo */}
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="aspect-[4/5] w-3/5 shadow-lg">
            <MirrorImage
              src="/images/inspiration/agriculteur-terrain.jpg"
              alt="Agriculteur au travail sur le terrain"
              className="h-full w-full rounded-2xl"
              imgClassName="animate-hero-zoom transition duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute bottom-0 right-0 aspect-[4/5] w-3/5 border-4 border-white shadow-lg">
            <MirrorImage
              src="/images/inspiration/mains-plante.jpg"
              alt="Mains tenant une jeune pousse"
              className="h-full w-full rounded-2xl"
              imgClassName="animate-hero-zoom transition duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute -left-4 top-1/3 flex h-20 w-20 items-center justify-center rounded-full bg-germe-blue text-center text-xs font-semibold text-white shadow-lg">
            4 entités
            <br />
            réunies
          </div>
        </Reveal>

        {/* Texte */}
        <Reveal delay={120}>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Notre inspiration
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Bienvenue chez GERME Cameroun
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-germe-ink/70 md:text-base">
            ONG, Association, SARL et Centre de Formation Professionnelle :
            GERME Cameroun rassemble quatre entités complémentaires au service
            d'une même ambition — accompagner les agriculteurs et éleveurs
            camerounais vers des exploitations rentables et durables.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Des formateurs de terrain, formés aux réalités locales",
              "Un accompagnement qui va de la leçon au plan d'affaires",
              "Une gouvernance commune, quatre missions complémentaires",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-germe-ink/80"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-germe-green/15 text-germe-green">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Organigramme, intégré à la section "À propos" */}
      <div className="border-t border-germe-ink/10 bg-gradient-to-br from-germe-blueLight to-germe-greenLight">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-6">
          <Organigramme />
        </div>
      </div>
    </section>
  );
}
