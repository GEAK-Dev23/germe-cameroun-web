"use client";

import { useEffect, useState } from "react";
import { progressionApi, ApiError, type SoumissionExercice } from "@/lib/api";

type Option = { id: string; texte: string; correcte?: boolean };

export default function ExerciceInteractif({
  exerciceId,
  question,
  type,
  options,
  onValide,
}: {
  exerciceId: string;
  question: string;
  type: string;
  options: Option[];
  onValide: () => void;
}) {
  const [soumission, setSoumission] = useState<SoumissionExercice | null>(null);
  const [chargementInitial, setChargementInitial] = useState(true);
  const [selection, setSelection] = useState<string | null>(null);
  const [texteLibre, setTexteLibre] = useState("");
  const [resultat, setResultat] = useState<{
    reussi: boolean;
    bonneReponse: string | null;
    statutCorrection: "auto" | "en_attente";
  } | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    progressionApi
      .obtenirMaSoumission(exerciceId)
      .then(setSoumission)
      .catch(() => setSoumission(null))
      .finally(() => setChargementInitial(false));
  }, [exerciceId]);

  async function valider() {
    const reponse = type === "qcm" ? selection : texteLibre;
    if (!reponse) return;
    setChargement(true);
    setErreur(null);
    try {
      const res = await progressionApi.repondreExercice(exerciceId, reponse);
      setResultat(res);
      if (res.reussi) onValide();
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible d'enregistrer la réponse.",
      );
    } finally {
      setChargement(false);
    }
  }

  if (chargementInitial) return null;

  // Déjà réussi (QCM validé, ou réponse libre corrigée positivement).
  const reussi = resultat?.reussi ?? soumission?.reussi ?? false;
  // En attente de correction humaine (réponse libre pas encore corrigée).
  const enAttente =
    (resultat?.statutCorrection ?? soumission?.statutCorrection) === "en_attente" &&
    !reussi;
  // Correction reçue mais jugée "à améliorer" : on peut retenter.
  const aAmeliorer =
    soumission?.statutCorrection === "corrige" &&
    !soumission.reussi &&
    !resultat;

  return (
    <div
      className={
        reussi
          ? "mt-6 rounded-lg border border-germe-green/30 bg-germe-greenLight p-4"
          : enAttente
            ? "mt-6 rounded-lg border border-germe-wheat bg-germe-cream p-4"
            : "mt-6 rounded-lg border border-germe-ink/10 bg-germe-cream p-4"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-germe-ink">{question}</p>
        {reussi && (
          <span className="shrink-0 rounded-full bg-germe-green/20 px-2.5 py-0.5 text-xs font-medium text-germe-green">
            ✓ Validé
          </span>
        )}
        {enAttente && (
          <span className="shrink-0 rounded-full bg-germe-wheat/50 px-2.5 py-0.5 text-xs font-medium text-germe-ink/70">
            ⏳ En attente de correction
          </span>
        )}
      </div>

      {enAttente ? (
        <p className="mt-2 text-xs text-germe-ink/60">
          Votre réponse a bien été envoyée. Un formateur la corrigera bientôt.
        </p>
      ) : (
        <>
          {type === "qcm" ? (
            <div className="mt-3 space-y-2">
              {options.map((o) => (
                <label
                  key={o.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    selection === o.id
                      ? "border-germe-blue bg-white"
                      : "border-germe-ink/15 bg-white/60 hover:border-germe-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name={`exercice-${exerciceId}`}
                    checked={selection === o.id}
                    onChange={() => setSelection(o.id)}
                    disabled={reussi}
                    className="h-4 w-4"
                  />
                  {o.texte}
                </label>
              ))}
            </div>
          ) : (
            !reussi && (
              <textarea
                rows={5}
                value={texteLibre}
                onChange={(e) => setTexteLibre(e.target.value)}
                placeholder="Rédigez votre réponse ici..."
                className="mt-3 w-full rounded-lg border border-germe-ink/20 bg-white px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
              />
            )
          )}

          {aAmeliorer && (
            <div className="mt-2 rounded-lg bg-white p-3 text-xs">
              <p className="font-medium text-germe-ink/70">
                Retour du formateur :
              </p>
              <p className="mt-1 text-germe-ink/60">
                {soumission?.commentaireCorrecteur ??
                  "Cette réponse peut être améliorée — n'hésitez pas à la retravailler."}
              </p>
            </div>
          )}

          {resultat && type === "qcm" && !resultat.reussi && (
            <p className="mt-2 text-xs text-red-600">
              Ce n'est pas la bonne réponse — réessayez.
            </p>
          )}
          {resultat &&
            type !== "qcm" &&
            resultat.statutCorrection === "en_attente" && (
              <p className="mt-2 text-xs text-germe-ink/60">
                Réponse envoyée — en attente de correction.
              </p>
            )}
          {erreur && <p className="mt-2 text-xs text-red-600">{erreur}</p>}

          {!reussi && (
            <button
              type="button"
              onClick={valider}
              disabled={
                (type === "qcm" ? !selection : !texteLibre.trim()) || chargement
              }
              className="mt-3 rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-50"
            >
              {chargement
                ? "Envoi..."
                : aAmeliorer
                  ? "Renvoyer ma réponse"
                  : "Valider ma réponse"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
