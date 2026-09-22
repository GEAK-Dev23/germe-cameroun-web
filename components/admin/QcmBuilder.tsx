"use client";

import { useState } from "react";

type OptionDraft = { texte: string };

export default function QcmBuilder({
  onAjouter,
  onAnnuler,
  boutonLabel = "Ajouter la question",
  couleur = "germe-blue",
  valeurInitiale,
}: {
  onAjouter: (
    question: string,
    options: { id: string; texte: string; correcte: boolean }[],
  ) => Promise<void>;
  onAnnuler?: () => void;
  boutonLabel?: string;
  couleur?: "germe-blue" | "germe-green";
  valeurInitiale?: {
    question: string;
    options: { texte: string; correcte: boolean }[];
  };
}) {
  const [question, setQuestion] = useState(valeurInitiale?.question ?? "");
  const [options, setOptions] = useState<OptionDraft[]>(
    valeurInitiale?.options.map((o) => ({ texte: o.texte })) ?? [
      { texte: "" },
      { texte: "" },
    ],
  );
  const [bonneReponse, setBonneReponse] = useState(
    valeurInitiale?.options.findIndex((o) => o.correcte) ?? 0,
  );
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function majOption(index: number, texte: string) {
    setOptions((o) => o.map((opt, i) => (i === index ? { texte } : opt)));
  }

  function ajouterOption() {
    if (options.length >= 6) return;
    setOptions((o) => [...o, { texte: "" }]);
  }

  function retirerOption(index: number) {
    if (options.length <= 2) return;
    setOptions((o) => o.filter((_, i) => i !== index));
    if (bonneReponse === index) setBonneReponse(0);
    else if (bonneReponse > index) setBonneReponse((b) => b - 1);
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    if (!question.trim() || options.some((o) => !o.texte.trim())) {
      setErreur("Renseignez la question et toutes les options.");
      return;
    }
    setEnvoi(true);
    try {
      const optionsFormatees = options.map((o, i) => ({
        id: `opt-${i + 1}`,
        texte: o.texte,
        correcte: i === bonneReponse,
      }));
      await onAjouter(question, optionsFormatees);
      if (!valeurInitiale) {
        setQuestion("");
        setOptions([{ texte: "" }, { texte: "" }]);
        setBonneReponse(0);
      }
    } catch {
      setErreur("Impossible d'enregistrer cette question.");
    } finally {
      setEnvoi(false);
    }
  }

  const couleurBouton =
    couleur === "germe-green"
      ? "bg-germe-green hover:bg-germe-greenDark"
      : "bg-germe-blue hover:bg-germe-blueDark";

  return (
    <form
      onSubmit={soumettre}
      className="space-y-3 rounded-lg border border-dashed border-germe-ink/20 p-3"
    >
      <input
        required
        placeholder="Énoncé de la question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      />

      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="bonne-reponse"
              checked={bonneReponse === i}
              onChange={() => setBonneReponse(i)}
              title="Marquer comme bonne réponse"
              className="h-4 w-4 shrink-0 accent-germe-green"
            />
            <input
              required
              placeholder={`Option ${i + 1}`}
              value={opt.texte}
              onChange={(e) => majOption(i, e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => retirerOption(i)}
                aria-label="Retirer cette option"
                className="shrink-0 text-germe-ink/40 hover:text-red-600"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {options.length < 6 ? (
          <button
            type="button"
            onClick={ajouterOption}
            className="text-xs font-medium text-germe-ink/60 hover:text-germe-ink"
          >
            + Ajouter une option
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          {onAnnuler && (
            <button
              type="button"
              onClick={onAnnuler}
              className="text-xs font-medium text-germe-ink/50 hover:text-germe-ink"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={envoi}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50 ${couleurBouton}`}
          >
            {envoi ? "Enregistrement..." : boutonLabel}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-germe-ink/45">
        Cochez le bouton radio devant la bonne réponse.
      </p>

      {erreur && <p className="text-xs text-red-600">{erreur}</p>}
    </form>
  );
}
