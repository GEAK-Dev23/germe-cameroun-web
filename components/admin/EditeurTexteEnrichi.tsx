"use client";

import { useRef } from "react";

// Enrobe la sélection courante du textarea avec les marqueurs donnés
// (ex : "**" pour le gras). Sans sélection, insère une paire de marqueurs
// avec le curseur entre les deux, prêt à taper.
function enroberSelection(
  textarea: HTMLTextAreaElement,
  valeur: string,
  onChange: (v: string) => void,
  ouvrant: string,
  fermant: string = ouvrant,
) {
  const debut = textarea.selectionStart;
  const fin = textarea.selectionEnd;
  const selection = valeur.slice(debut, fin);
  const nouvelleValeur =
    valeur.slice(0, debut) + ouvrant + selection + fermant + valeur.slice(fin);
  onChange(nouvelleValeur);

  requestAnimationFrame(() => {
    textarea.focus();
    const nouveauDebut = debut + ouvrant.length;
    const nouveauFin = nouveauDebut + selection.length;
    textarea.setSelectionRange(nouveauDebut, nouveauFin);
  });
}

export default function EditeurTexteEnrichi({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function appliquer(ouvrant: string, fermant?: string) {
    if (!ref.current) return;
    enroberSelection(ref.current, value, onChange, ouvrant, fermant);
  }

  return (
    <div className="rounded-lg border border-germe-ink/20 focus-within:border-germe-blue">
      <div className="flex items-center gap-1 border-b border-germe-ink/10 bg-germe-cream/50 px-2 py-1">
        <button
          type="button"
          onClick={() => appliquer("**")}
          title="Gras"
          className="rounded px-2 py-0.5 text-xs font-bold text-germe-ink/70 hover:bg-white"
        >
          G
        </button>
        <button
          type="button"
          onClick={() => appliquer("++")}
          title="Texte plus grand"
          className="rounded px-2 py-0.5 text-base font-semibold text-germe-ink/70 hover:bg-white"
        >
          A
        </button>
        <button
          type="button"
          onClick={() => appliquer("--")}
          title="Texte plus petit"
          className="rounded px-2 py-0.5 text-[10px] font-semibold text-germe-ink/70 hover:bg-white"
        >
          A
        </button>
        <span className="ml-1 text-[10px] text-germe-ink/40">
          sélectionnez du texte puis cliquez
        </span>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-b-lg px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}
