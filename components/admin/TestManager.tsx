"use client";

import { useEffect, useState } from "react";
import QcmBuilder from "./QcmBuilder";
import { ApiError, type TestAdmin } from "@/lib/api";

export default function TestManager({
  titre,
  obtenirTest,
  ajouterQuestion,
  modifierQuestion,
  supprimerQuestion,
  couleur = "germe-blue",
}: {
  titre: string;
  obtenirTest: () => Promise<TestAdmin>;
  ajouterQuestion: (
    question: string,
    options: { id: string; texte: string; correcte: boolean }[],
  ) => Promise<unknown>;
  modifierQuestion?: (
    id: string,
    question: string,
    options: { id: string; texte: string; correcte: boolean }[],
  ) => Promise<unknown>;
  supprimerQuestion: (id: string) => Promise<unknown>;
  couleur?: "germe-blue" | "germe-green";
}) {
  const [test, setTest] = useState<TestAdmin | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [questionEnEdition, setQuestionEnEdition] = useState<string | null>(
    null,
  );

  function recharger() {
    setChargement(true);
    setErreur(null);
    obtenirTest()
      .then(setTest)
      .catch((err) =>
        setErreur(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger ce QCM pour le moment.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onAjouter(
    question: string,
    options: { id: string; texte: string; correcte: boolean }[],
  ) {
    await ajouterQuestion(question, options);
    recharger();
  }

  async function onModifier(
    id: string,
    question: string,
    options: { id: string; texte: string; correcte: boolean }[],
  ) {
    if (!modifierQuestion) return;
    await modifierQuestion(id, question, options);
    setQuestionEnEdition(null);
    recharger();
  }

  async function onSupprimer(id: string) {
    await supprimerQuestion(id);
    recharger();
  }

  const couleurTexte = couleur === "germe-green" ? "text-germe-green" : "text-germe-blue";

  return (
    <div className="rounded-lg border border-germe-ink/10 bg-germe-cream/60 p-3">
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold ${couleurTexte}`}>{titre}</p>
        {erreur && (
          <button
            type="button"
            onClick={recharger}
            className="text-[11px] font-medium text-germe-ink/50 hover:text-germe-ink"
          >
            Réessayer
          </button>
        )}
      </div>

      {chargement ? (
        <p className="mt-2 text-xs text-germe-ink/50">Chargement...</p>
      ) : erreur ? (
        <p className="mt-2 text-xs text-red-600">{erreur}</p>
      ) : (
        <>
          {test && test.questions.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {test.questions.map((q, i) =>
                questionEnEdition === q.id ? (
                  <li key={q.id}>
                    <QcmBuilder
                      couleur={couleur}
                      boutonLabel="Enregistrer"
                      valeurInitiale={{
                        question: q.question,
                        options: q.options.map((o) => ({
                          texte: o.texte,
                          correcte: o.correcte,
                        })),
                      }}
                      onAjouter={(question, options) =>
                        onModifier(q.id, question, options)
                      }
                      onAnnuler={() => setQuestionEnEdition(null)}
                    />
                  </li>
                ) : (
                  <li
                    key={q.id}
                    className="flex items-start justify-between gap-2 rounded-md bg-white px-2.5 py-1.5 text-xs"
                  >
                    <div>
                      <p className="font-medium text-germe-ink">
                        {i + 1}. {q.question}
                      </p>
                      <p className="mt-0.5 text-germe-ink/50">
                        Bonne réponse :{" "}
                        {q.options.find((o) => o.correcte)?.texte ?? "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {modifierQuestion && (
                        <button
                          type="button"
                          onClick={() => setQuestionEnEdition(q.id)}
                          aria-label="Modifier la question"
                          className="text-germe-ink/40 hover:text-germe-blue"
                        >
                          ✎
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSupprimer(q.id)}
                        aria-label="Supprimer la question"
                        className="text-germe-ink/40 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ),
              )}
            </ul>
          )}

          <div className="mt-2">
            <QcmBuilder onAjouter={onAjouter} couleur={couleur} />
          </div>
        </>
      )}
    </div>
  );
}
