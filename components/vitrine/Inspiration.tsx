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
          <h2 className="font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Bienvenue chez GERME Cameroun
          </h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-germe-green">
            Notre inspiration
          </p>
          <p className="mt-4 text-sm leading-relaxed text-germe-ink/70 md:text-base">
            GERME CAMEROUN est une structure d'appui à l'entrepreneuriat et au
            développement économique local, spécialisée dans la formation,
            l'accompagnement/coaching, l'insertion socioprofessionnelle.
          </p>

          <p className="mt-6 text-sm font-medium text-germe-ink">
            Chez GERME Cameroun, nos actions sont guidées par 6 valeurs
            fondamentales qui animent toutes nos entités :
          </p>

          <ul className="mt-4 space-y-4">
            {[
              {
                titre: "Professionnalisme",
                texte:
                  "Rigueur, qualité et respect des engagements, de la conception à la mise en œuvre sur le terrain.",
              },
              {
                titre: "Intégrité",
                texte:
                  "Transparence, éthique et redevabilité envers nos bénéficiaires, nos clients et nos partenaires institutionnels.",
              },
              {
                titre: "Inclusion",
                texte:
                  "Nous révélons et accompagnons le potentiel de chaque personne, avec une attention particulière pour les femmes, les jeunes et les populations vulnérables.",
              },
              {
                titre: "Durabilité",
                texte:
                  "Nous bâtissons des solutions résilientes qui allient performance économique, adaptation climatique et respect de l'environnement.",
              },
              {
                titre: "Innovation de proximité",
                texte:
                  "Des solutions pratiques et créatives, co-construites et adaptées aux réalités locales.",
              },
              {
                titre: "Synergie des 4 entités",
                texte:
                  "Une vision commune, quatre expertises complémentaires au service d'une seule ambition : transformer durablement les potentiels locaux en réussites. Nous réussissons ensemble.",
              },
            ].map((valeur, i) => (
              <li key={valeur.titre} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-germe-green/15 text-xs font-semibold text-germe-green">
                  {i + 1}
                </span>
                <p className="text-sm text-germe-ink/80">
                  <span className="font-semibold text-germe-ink">
                    {valeur.titre}
                  </span>{" "}
                  : {valeur.texte}
                </p>
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
