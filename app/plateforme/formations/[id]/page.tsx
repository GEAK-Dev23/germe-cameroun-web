"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/vitrine/Reveal";
import ExerciceInteractif from "@/components/plateforme/ExerciceInteractif";
import MurPaiement from "@/components/plateforme/MurPaiement";
import MessagerieFormation from "@/components/plateforme/MessagerieFormation";
import BlocNotes from "@/components/plateforme/BlocNotes";
import {
  formationsApi,
  progressionApi,
  paiementsApi,
  ApiError,
  type FormationAvecCurriculum,
  type Progression,
  type EtatFormation,
  type Chapitre,
  type Lecon,
  type MediaLecon,
  type BlocContenu,
  type AccesFormation,
} from "@/lib/api";
import RichText from "@/components/plateforme/RichText";

function MediaLeconVignette({ media }: { media: MediaLecon }) {
  return (
    <div className="overflow-hidden rounded-lg bg-germe-ink/5">
      {media.type === "video" ? (
        <video src={media.url} controls className="aspect-video w-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.url}
          alt={media.legende ?? ""}
          className="aspect-video w-full object-cover"
        />
      )}
      {media.legende && (
        <p className="px-2 py-1 text-[11px] text-germe-ink/50">
          {media.legende}
        </p>
      )}
    </div>
  );
}

function ContenuLecon({ lecon: l }: { lecon: Lecon }) {
  // Nouveau format : blocs ordonnés texte/photo/vidéo, permettant du texte
  // avant et/ou après chaque média. Si absent (leçon créée avant ce champ),
  // on retombe sur l'ancien format (vidéo principale + texte + galerie).
  if (l.blocs && l.blocs.length > 0) {
    return (
      <div className="mt-4 space-y-4">
        {l.blocs.map((bloc) => (
          <BlocContenuVignette key={bloc.id} bloc={bloc} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex aspect-video w-full items-center justify-center rounded-lg bg-germe-ink/5">
        {l.videoUrl ? (
          <video src={l.videoUrl} controls className="h-full w-full rounded-lg" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-germe-blue shadow">
            ▶
          </span>
        )}
      </div>

      {l.contenuTexte && (
        <RichText
          texte={l.contenuTexte}
          className="mt-4 text-sm leading-relaxed text-germe-ink/70"
        />
      )}

      {l.medias && l.medias.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {l.medias.map((media) => (
            <MediaLeconVignette key={media.id} media={media} />
          ))}
        </div>
      )}
    </>
  );
}

function BlocContenuVignette({ bloc }: { bloc: BlocContenu }) {
  if (bloc.type === "texte") {
    return (
      <RichText texte={bloc.texte} className="text-sm leading-relaxed text-germe-ink/70" />
    );
  }
  if (bloc.type === "document") {
    return (
      <a
        href={bloc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg border border-germe-ink/10 bg-white p-3 transition hover:border-germe-blue"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-germe-blueLight text-lg">
          📄
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-germe-blue">
            {bloc.legende || "Ouvrir le document"}
          </span>
          <span className="block text-xs text-germe-ink/40">
            Document PDF — cliquez pour ouvrir
          </span>
        </span>
      </a>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg bg-germe-ink/5">
      {bloc.type === "video" ? (
        <video src={bloc.url} controls className="aspect-video w-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bloc.url} alt={bloc.legende ?? ""} className="aspect-video w-full object-cover" />
      )}
      {bloc.legende && (
        <p className="px-2 py-1 text-[11px] text-germe-ink/50">{bloc.legende}</p>
      )}
    </div>
  );
}

function BadgeStatutTest({
  existe,
  debloque,
  reussi,
}: {
  existe: boolean;
  debloque: boolean;
  reussi: boolean;
}) {
  if (reussi) {
    return (
      <span className="rounded-full bg-germe-green/15 px-2 py-0.5 text-[11px] font-medium text-germe-green">
        ✓ Réussi
      </span>
    );
  }
  if (!debloque) {
    return (
      <span className="rounded-full bg-germe-ink/10 px-2 py-0.5 text-[11px] font-medium text-germe-ink/50">
        🔒 Verrouillé
      </span>
    );
  }
  if (!existe) {
    return (
      <span className="rounded-full bg-germe-ink/10 px-2 py-0.5 text-[11px] font-medium text-germe-ink/50">
        À venir
      </span>
    );
  }
  return (
    <span className="rounded-full bg-germe-wheat/40 px-2 py-0.5 text-[11px] font-medium text-germe-ink/70">
      À passer
    </span>
  );
}

export default function FormationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [formation, setFormation] = useState<FormationAvecCurriculum | null>(
    null,
  );
  const [progression, setProgression] = useState<Progression | null>(null);
  const [etat, setEtat] = useState<EtatFormation | null>(null);
  const [acces, setAcces] = useState<AccesFormation | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  function recharger() {
    Promise.all([
      formationsApi.obtenirUne(id),
      progressionApi.obtenirProgression(id),
      progressionApi.obtenirEtat(id),
      paiementsApi.verifierAcces(id),
    ])
      .then(([f, p, e, a]) => {
        setFormation(f);
        setProgression(p);
        setEtat(e);
        setAcces(a);
      })
      .catch((err) =>
        setErreur(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger cette formation.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (chargement) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center text-germe-ink/50">
        Chargement...
      </div>
    );
  }

  if (erreur || !formation || !etat) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="text-sm text-red-600">
          {erreur ?? "Formation introuvable."}
        </p>
        <Link
          href="/plateforme"
          className="mt-4 inline-block text-sm text-germe-blue hover:underline"
        >
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  function chapitreEtat(chapitreId: string) {
    for (const m of etat!.modules) {
      const c = m.chapitres.find((ch) => ch.chapitreId === chapitreId);
      if (c) return c;
    }
    return undefined;
  }

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

          {progression && progression.totalExercices > 0 && (
            <div className="mt-5 max-w-sm">
              <div className="mb-1 flex justify-between text-xs font-medium text-white/80">
                <span>Exercices facultatifs</span>
                <span>
                  {progression.exercicesReussis} / {progression.totalExercices}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/20">
                <div
                  className="h-1.5 rounded-full bg-germe-wheat transition-all"
                  style={{
                    width: `${(progression.exercicesReussis / progression.totalExercices) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {etat.attestationDebloquee && (
            <Link
              href={`/plateforme/formations/${formation.id}/attestation`}
              className="mt-5 inline-block rounded-full bg-germe-wheat px-6 py-2.5 text-xs font-semibold text-germe-ink transition hover:brightness-95"
            >
              🎓 Voir mon attestation
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3 md:px-6">
        {/* Colonne latérale : sommaire (toujours visible, y compris le
            programme des modules payants) + bloc-notes personnel. */}
        <div className="space-y-6 md:col-span-1">
        <Reveal>
          <div className="rounded-xl border border-germe-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-germe-ink/60">
              Sommaire
            </h2>
            {formation.modules.length === 0 ? (
              <p className="mt-4 text-sm text-germe-ink/50">
                Le contenu de cette formation arrive bientôt.
              </p>
            ) : (
              <div className="mt-4 space-y-6">
                {formation.modules.map((m) => {
                  const etatModule = etat.modules.find(
                    (em) => em.moduleId === m.id,
                  );
                  return (
                    <div key={m.id}>
                      <div className="flex items-center gap-1.5">
                        {!etatModule?.debloque && (
                          <span className="text-xs">🔒</span>
                        )}
                        <p className="font-display text-sm font-semibold text-germe-blue">
                          {m.titre}
                        </p>
                      </div>

                      {(m.programme || m.description || m.imagePresentation || m.videoPresentation) && (
                        <details className="mt-1 rounded-lg bg-germe-cream/70 px-2.5 py-1.5 text-xs text-germe-ink/70">
                          <summary className="cursor-pointer font-medium text-germe-ink/80">
                            Voir le programme du module
                          </summary>
                          {m.videoPresentation && (
                            <video
                              src={m.videoPresentation}
                              controls
                              className="mt-2 aspect-video w-full rounded-md"
                            />
                          )}
                          {!m.videoPresentation && m.imagePresentation && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.imagePresentation}
                              alt=""
                              className="mt-2 aspect-video w-full rounded-md object-cover"
                            />
                          )}
                          {m.description && (
                            <RichText texte={m.description} className="mt-2" />
                          )}
                          {m.programme && (
                            <RichText texte={m.programme} className="mt-2" />
                          )}
                        </details>
                      )}

                      <div className="mt-2 space-y-3 border-l border-germe-ink/10 pl-4">
                        {m.chapitres.map((c) => {
                          const ec = etatModule?.chapitres.find(
                            (x) => x.chapitreId === c.id,
                          );
                          return (
                            <div key={c.id}>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {!ec?.accessible && (
                                  <span className="text-[11px]">
                                    {ec?.expire ? "⏰" : "🔒"}
                                  </span>
                                )}
                                <p className="text-sm font-medium text-germe-ink">
                                  {c.titre}
                                </p>
                                {ec?.expire && (
                                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                                    Fermé
                                  </span>
                                )}
                              </div>
                              <ul className="mt-1 space-y-1">
                                {c.lecons.map((l) => (
                                  <li key={l.id}>
                                    <a
                                      href={
                                        ec?.accessible
                                          ? `#lecon-${l.id}`
                                          : undefined
                                      }
                                      className={
                                        ec?.accessible
                                          ? "flex items-center justify-between gap-2 text-sm text-germe-ink/65 hover:text-germe-green"
                                          : "flex cursor-not-allowed items-center justify-between gap-2 text-sm text-germe-ink/35"
                                      }
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
                          );
                        })}
                      </div>

                      {etatModule && (
                        <div
                          className={
                            etatModule.testModuleReussi
                              ? "mt-2 flex items-center justify-between rounded-lg border border-germe-green/30 bg-germe-greenLight px-3 py-2"
                              : "mt-2 flex items-center justify-between rounded-lg bg-germe-cream px-3 py-2"
                          }
                        >
                          <span className="text-xs font-medium text-germe-ink">
                            Test du module
                          </span>
                          <div className="flex items-center gap-2">
                            <BadgeStatutTest
                              existe={etatModule.testModuleExiste}
                              debloque={etatModule.testModuleDebloque}
                              reussi={etatModule.testModuleReussi}
                            />
                            {etatModule.testModuleDebloque &&
                              etatModule.testModuleExiste &&
                              !etatModule.testModuleReussi && (
                                <Link
                                  href={`/plateforme/formations/${id}/modules/${m.id}/test`}
                                  className="text-xs font-semibold text-germe-blue hover:underline"
                                >
                                  Passer →
                                </Link>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Reveal>

        {acces?.acces && <BlocNotes formationId={id} />}
        </div>

        <div className="space-y-8 md:col-span-2">
          {acces && !acces.acces ? (
            <MurPaiement formation={formation} acces={acces} />
          ) : (
            <>
              {formation.modules.every((m) => m.chapitres.length === 0) && (
                <p className="rounded-xl border border-germe-ink/10 bg-white p-8 text-center text-sm text-germe-ink/50">
                  Aucune leçon n'a encore été ajoutée à cette formation.
                </p>
              )}

              {formation.modules.map((m) => {
                const etatModule = etat.modules.find(
                  (em) => em.moduleId === m.id,
                );
                return (
                  <div key={m.id} className="space-y-6">
                    {m.chapitres.map((c, ic) => {
                      const ec = chapitreEtat(c.id);
                      const dernierChapitre = ic === m.chapitres.length - 1;
                      return (
                        <ChapitreContenu
                          key={c.id}
                          chapitre={c}
                          formationId={id}
                          accessible={ec?.accessible ?? false}
                          expire={ec?.expire ?? false}
                          dateLimite={ec?.dateLimite ?? null}
                          testExiste={ec?.testExiste ?? false}
                          testReussi={ec?.testReussi ?? false}
                          onValideExercice={recharger}
                          afficherTestModule={
                            dernierChapitre && !!etatModule
                          }
                          moduleId={m.id}
                          etatModule={etatModule}
                        />
                      );
                    })}
                  </div>
                );
              })}

              {formation.modules.length > 0 && (
                <Reveal>
                  <div
                    className={
                      etat.examenFinal.reussi
                        ? "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-germe-green/30 bg-germe-greenLight p-4 sm:p-5"
                        : "flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-germe-wheat bg-white p-4 sm:p-5"
                    }
                  >
                    <div>
                      <p className="font-display text-sm font-semibold text-germe-ink sm:text-base">
                        🎓 Examen final de la formation
                      </p>
                      <p className="mt-0.5 text-xs text-germe-ink/60">
                        {etat.examenFinal.reussi
                          ? "Examen réussi — vous pouvez générer votre attestation."
                          : etat.examenFinal.debloque
                            ? "Tous les modules sont validés — passez l'examen final pour débloquer votre attestation."
                            : "Se débloque une fois tous les modules de la formation réussis."}
                      </p>
                    </div>
                    {etat.examenFinal.debloque && !etat.examenFinal.reussi && (
                      <Link
                        href={`/plateforme/formations/${id}/test-final`}
                        className="rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white transition hover:bg-germe-greenDark"
                      >
                        Passer l'examen final
                      </Link>
                    )}
                  </div>
                </Reveal>
              )}

              <Reveal>
                <MessagerieFormation
                  formationId={formation.id}
                  formateurs={formation.formateurs}
                />
              </Reveal>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function ChapitreContenu({
  chapitre: c,
  formationId,
  accessible,
  expire,
  dateLimite,
  testExiste,
  testReussi,
  onValideExercice,
  afficherTestModule,
  moduleId,
  etatModule,
}: {
  chapitre: Chapitre;
  formationId: string;
  accessible: boolean;
  expire: boolean;
  dateLimite: string | null;
  testExiste: boolean;
  testReussi: boolean;
  onValideExercice: () => void;
  afficherTestModule: boolean;
  moduleId: string;
  etatModule?: EtatFormation["modules"][number];
}) {
  if (!accessible) {
    return (
      <div className="rounded-xl border border-dashed border-germe-ink/15 bg-white/60 p-6 text-center">
        <p className="text-sm font-medium text-germe-ink/60">
          {expire ? "⏰" : "🔒"} {c.titre}
        </p>
        <p className="mt-1 text-xs text-germe-ink/45">
          {expire
            ? `Ce chapitre n'est plus accessible depuis le ${dateLimite ? new Date(dateLimite).toLocaleString("fr-FR") : "délai fixé"}.`
            : "Terminez le QCM du chapitre précédent pour débloquer ce chapitre."}
        </p>
      </div>
    );
  }

  return (
    <>
      {dateLimite && (
        <p className="mb-2 inline-block rounded-full bg-germe-wheat/40 px-2.5 py-0.5 text-[11px] font-medium text-germe-ink/70">
          ⏰ Accessible jusqu'au {new Date(dateLimite).toLocaleString("fr-FR")}
        </p>
      )}
      {(c.description || c.imagePresentation || c.videoPresentation) && (
        <Reveal>
          <div className="rounded-xl border border-germe-ink/10 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-display text-base font-semibold text-germe-ink sm:text-lg">
              {c.titre}
            </h3>
            {c.videoPresentation && (
              <video
                src={c.videoPresentation}
                controls
                className="mt-3 aspect-video w-full rounded-lg"
              />
            )}
            {!c.videoPresentation && c.imagePresentation && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.imagePresentation}
                alt=""
                className="mt-3 aspect-video w-full rounded-lg object-cover"
              />
            )}
            {c.description && (
              <RichText
                texte={c.description}
                className="mt-3 text-sm leading-relaxed text-germe-ink/70"
              />
            )}
          </div>
        </Reveal>
      )}

      {c.lecons.map((l, i) => (
        <Reveal key={l.id} delay={i * 60}>
          <article
            id={`lecon-${l.id}`}
            className="scroll-mt-24 rounded-xl border border-germe-ink/10 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-germe-ink sm:text-lg">
                {l.titre}
              </h3>
              <span className="text-xs text-germe-ink/50">{l.dureeMin} min</span>
            </div>

            <ContenuLecon lecon={l} />

            {l.exercices.map((ex) => (
              <ExerciceInteractif
                key={ex.id}
                exerciceId={ex.id}
                question={ex.question}
                type={ex.type}
                options={
                  (ex.options as { id: string; texte: string }[]) ?? []
                }
                onValide={onValideExercice}
              />
            ))}
          </article>
        </Reveal>
      ))}

      <Reveal>
        <div
          className={
            testReussi
              ? "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-germe-green/30 bg-germe-greenLight p-4"
              : "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-germe-ink/10 bg-germe-cream p-4"
          }
        >
          <div>
            <p className="text-sm font-medium text-germe-ink">
              QCM obligatoire — {c.titre}
            </p>
            <p className="mt-0.5 text-xs text-germe-ink/60">
              {testReussi
                ? "Chapitre validé."
                : testExiste
                  ? "Requis pour débloquer la suite (seuil : 60%)."
                  : "Ce QCM n'a pas encore été configuré par l'équipe pédagogique."}
            </p>
          </div>
          {testExiste && !testReussi && (
            <Link
              href={`/plateforme/formations/${formationId}/chapitres/${c.id}/test`}
              className="rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white transition hover:bg-germe-greenDark"
            >
              Passer le QCM
            </Link>
          )}
        </div>
      </Reveal>

      {afficherTestModule && etatModule && (
        <Reveal>
          <div
            className={
              etatModule.testModuleReussi
                ? "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-germe-green/30 bg-germe-greenLight p-4"
                : "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-germe-blue/20 bg-germe-blueLight p-4"
            }
          >
            <div>
              <p className="text-sm font-medium text-germe-ink">
                Test obligatoire de fin de module
              </p>
              <p className="mt-0.5 text-xs text-germe-ink/60">
                {etatModule.testModuleReussi
                  ? "Module validé."
                  : etatModule.testModuleDebloque
                    ? "Tous les chapitres sont validés — passez le test du module."
                    : "Se débloque une fois tous les chapitres validés."}
              </p>
            </div>
            {etatModule.testModuleDebloque &&
              etatModule.testModuleExiste &&
              !etatModule.testModuleReussi && (
                <Link
                  href={`/plateforme/formations/${formationId}/modules/${moduleId}/test`}
                  className="rounded-full bg-germe-blue px-5 py-2 text-xs font-semibold text-white transition hover:bg-germe-blueDark"
                >
                  Passer le test
                </Link>
              )}
          </div>
        </Reveal>
      )}
    </>
  );
}
