import Link from "next/link";
import Reveal from "@/components/vitrine/Reveal";
import { FORMATIONS_DEMO } from "@/components/plateforme/CatalogueFormations";

// Structure de démonstration — à remplacer par un appel à l'API NestJS
// (GET /formations/:id/curriculum) une fois le backend branché.
const MODULES_DEMO = [
  {
    id: "m1",
    titre: "Module 1 — Préparer le terrain",
    chapitres: [
      {
        id: "c1",
        titre: "Chapitre 1 — Analyse du sol",
        lecons: [
          { id: "l1", titre: "Reconnaître un sol fertile", dureeMin: 8 },
          {
            id: "l2",
            titre: "Prélever et interpréter un échantillon",
            dureeMin: 12,
          },
        ],
      },
      {
        id: "c2",
        titre: "Chapitre 2 — Préparation avant semis",
        lecons: [{ id: "l3", titre: "Labour et amendement", dureeMin: 10 }],
      },
    ],
  },
  {
    id: "m2",
    titre: "Module 2 — Conduite de culture",
    chapitres: [
      {
        id: "c3",
        titre: "Chapitre 1 — Semis et plantation",
        lecons: [
          { id: "l4", titre: "Choisir la bonne période", dureeMin: 9 },
          { id: "l5", titre: "Techniques de semis", dureeMin: 14 },
        ],
      },
    ],
  },
];

export default function FormationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const formation =
    FORMATIONS_DEMO.find((f) => f.id === params.id) ?? FORMATIONS_DEMO[0];

  return (
    <main>
      <section className="bg-gradient-to-r from-germe-blueDark via-germe-blue to-germe-green">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-6">
          <Link
            href="/plateforme"
            className="text-sm text-white/70 hover:text-white"
          >
            ← Retour au catalogue
          </Link>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-germe-wheat">
            {formation.categorie}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-white md:text-3xl">
            {formation.titre}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            {formation.description}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3 md:px-6">
        {/* Sommaire : module > chapitre > leçon */}
        <Reveal className="md:col-span-1">
          <div className="rounded-xl border border-germe-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-germe-ink/60">
              Sommaire
            </h2>
            <div className="mt-4 space-y-5">
              {MODULES_DEMO.map((m) => (
                <div key={m.id}>
                  <p className="font-display text-sm font-semibold text-germe-blue">
                    {m.titre}
                  </p>
                  <div className="mt-2 space-y-3 border-l border-germe-ink/10 pl-4">
                    {m.chapitres.map((c) => (
                      <div key={c.id}>
                        <p className="text-sm font-medium text-germe-ink">
                          {c.titre}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {c.lecons.map((l) => (
                            <li key={l.id}>
                              <a
                                href={`#lecon-${l.id}`}
                                className="flex items-center justify-between gap-2 text-sm text-germe-ink/65 hover:text-germe-green"
                              >
                                <span>{l.titre}</span>
                                <span className="shrink-0 text-xs text-germe-ink/40">
                                  {l.dureeMin} min
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-germe-greenLight p-4">
              <p className="text-sm font-medium text-germe-ink">Test final</p>
              <p className="mt-1 text-xs text-germe-ink/60">
                Se débloque une fois tous les exercices validés.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Contenu : vidéo + texte, exercice en fin de leçon */}
        <div className="space-y-8 md:col-span-2">
          {MODULES_DEMO.flatMap((m) => m.chapitres)
            .flatMap((c) => c.lecons)
            .map((l, i) => (
              <Reveal key={l.id} delay={i * 60}>
                <article
                  id={`lecon-${l.id}`}
                  className="scroll-mt-24 rounded-xl border border-germe-ink/10 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-germe-ink">
                      {l.titre}
                    </h3>
                    <span className="text-xs text-germe-ink/50">
                      {l.dureeMin} min
                    </span>
                  </div>

                  <div className="mt-4 flex aspect-video w-full items-center justify-center rounded-lg bg-germe-ink/5">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-germe-blue shadow">
                      ▶
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-germe-ink/70">
                    Le texte d'accompagnement de la leçon s'affichera ici, sous
                    la vidéo, tel que rédigé par le formateur.
                  </p>

                  <div className="mt-6 rounded-lg border border-germe-green/20 bg-germe-greenLight p-4">
                    <p className="text-sm font-medium text-germe-ink">
                      Exercice de fin de leçon
                    </p>
                    <p className="mt-1 text-xs text-germe-ink/60">
                      À valider pour débloquer la suite de la formation.
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white transition hover:bg-germe-greenDark"
                    >
                      Faire l'exercice
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}

          {/* Espace d'échange formateur-apprenant */}
          <Reveal className="rounded-xl border border-germe-ink/10 bg-white p-6 shadow-sm">
            <h3 className="font-display text-base font-semibold text-germe-ink">
              Échanges avec le formateur
            </h3>
            <p className="mt-1 text-sm text-germe-ink/60">
              Posez vos questions sur cette formation — visible par vous et
              l'équipe pédagogique.
            </p>
            <div className="mt-4 rounded-lg bg-germe-cream p-4 text-sm text-germe-ink/50">
              Aucun message pour le moment.
            </div>
            <form className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Écrire un message..."
                className="flex-1 rounded-full border border-germe-ink/20 bg-white px-4 py-2 text-sm focus:border-germe-blue focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-germe-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-germe-blueDark"
              >
                Envoyer
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
