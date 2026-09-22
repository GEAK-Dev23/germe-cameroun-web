"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiError, type TestApprenant, type ResultatSoumission } from "@/lib/api";

export default function TestQcmRunner({
  obtenirTest,
  soumettreTest,
  retourHref,
  retourLabel = "← Retour à la formation",
  succesHref,
  succesLabel = "Continuer",
}: {
  obtenirTest: () => Promise<TestApprenant>;
  soumettreTest: (
    testId: string,
    reponses: Record<string, string>,
  ) => Promise<ResultatSoumission>;
  retourHref: string;
  retourLabel?: string;
  succesHref: string;
  succesLabel?: string;
}) {
  const [test, setTest] = useState<TestApprenant | null>(null);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [resultat, setResultat] = useState<ResultatSoumission | null>(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    obtenirTest()
      .then(setTest)
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Impossible de charger le test.",
        ),
      )
      .finally(() => setChargement(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function soumettre() {
    if (!test) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await soumettreTest(test.id, reponses);
      setResultat(res);
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de soumettre le test.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  function reprendre() {
    setResultat(null);
    setReponses({});
    setChargement(true);
    obtenirTest()
      .then(setTest)
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Impossible de charger le test.",
        ),
      )
      .finally(() => setChargement(false));
  }

  if (chargement) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-germe-ink/50 sm:px-5">
        Chargement...
      </div>
    );
  }

  if (erreur && !resultat) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-5">
        <p className="text-sm text-red-600">{erreur}</p>
        <Link
          href={retourHref}
          className="mt-4 inline-block text-sm text-germe-blue hover:underline"
        >
          {retourLabel}
        </Link>
      </div>
    );
  }

  if (resultat) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-5 sm:py-16 md:px-6">
        {resultat.reussi ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-germe-green/15 text-3xl">
              🎉
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink sm:text-2xl">
              Félicitations, vous avez réussi !
            </h1>
            <p className="mt-2 text-sm text-germe-ink/70">
              Score obtenu : <strong>{resultat.score}%</strong> (seuil requis :{" "}
              {resultat.seuilRequis}%)
            </p>
            <Link
              href={succesHref}
              className="mt-6 inline-block rounded-full bg-germe-green px-7 py-3 text-sm font-semibold text-white transition hover:bg-germe-greenDark"
            >
              {succesLabel}
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-germe-ink/10 text-3xl">
              😕
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink sm:text-2xl">
              Pas tout à fait — réessayez
            </h1>
            <p className="mt-2 text-sm text-germe-ink/70">
              Score obtenu : <strong>{resultat.score}%</strong> (seuil requis :{" "}
              {resultat.seuilRequis}%)
            </p>
            <button
              type="button"
              onClick={reprendre}
              className="mt-6 rounded-full bg-germe-blue px-7 py-3 text-sm font-semibold text-white transition hover:bg-germe-blueDark"
            >
              Retenter le test
            </button>
          </>
        )}
      </main>
    );
  }

  if (!test) return null;

  const toutesRepondues = test.questions.every((q) => reponses[q.id]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-12 md:px-6">
      <Link
        href={retourHref}
        className="text-sm text-germe-ink/60 hover:text-germe-ink"
      >
        {retourLabel}
      </Link>
      <h1 className="mt-3 font-display text-xl font-semibold text-germe-ink sm:text-2xl">
        {test.titre}
      </h1>
      <p className="mt-1 text-sm text-germe-ink/60">
        Répondez à toutes les questions puis validez.
      </p>

      <div className="mt-8 space-y-6">
        {test.questions.map((q, i) => (
          <div
            key={q.id}
            className="rounded-xl border border-germe-ink/10 bg-white p-4 sm:p-5"
          >
            <p className="text-sm font-medium text-germe-ink">
              {i + 1}. {q.question}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    reponses[q.id] === o.id
                      ? "border-germe-blue bg-germe-blueLight"
                      : "border-germe-ink/15 hover:border-germe-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={reponses[q.id] === o.id}
                    onChange={() =>
                      setReponses((r) => ({ ...r, [q.id]: o.id }))
                    }
                    className="h-4 w-4 shrink-0"
                  />
                  {o.texte}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {erreur && <p className="mt-4 text-sm text-red-600">{erreur}</p>}

      <button
        type="button"
        onClick={soumettre}
        disabled={!toutesRepondues || envoi}
        className="mt-8 w-full rounded-full bg-germe-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-50"
      >
        {envoi ? "Envoi..." : "Valider le test"}
      </button>
    </main>
  );
}
