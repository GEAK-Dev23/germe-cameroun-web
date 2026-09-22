import type { ReactNode } from "react";

// Mini-syntaxe volontairement minimale pour la mise en forme saisie par
// l'administrateur : **gras**, ++grand++, --petit--. Analysée en un seul
// passage (pas d'imbrication) et restituée uniquement sous forme
// d'éléments React (jamais de dangerouslySetInnerHTML) : aucun risque
// d'injection HTML, quel que soit le texte saisi.
const MOTIF = /\*\*(.+?)\*\*|\+\+(.+?)\+\+|--(.+?)--/g;

function analyserLigne(ligne: string, clePrefixe: string): ReactNode[] {
  const morceaux: ReactNode[] = [];
  let curseur = 0;
  let compteur = 0;
  let correspondance: RegExpExecArray | null;

  MOTIF.lastIndex = 0;
  while ((correspondance = MOTIF.exec(ligne)) !== null) {
    if (correspondance.index > curseur) {
      morceaux.push(ligne.slice(curseur, correspondance.index));
    }
    const cle = `${clePrefixe}-${compteur++}`;
    if (correspondance[1] !== undefined) {
      morceaux.push(<strong key={cle}>{correspondance[1]}</strong>);
    } else if (correspondance[2] !== undefined) {
      morceaux.push(
        <span key={cle} className="text-[1.15em] leading-normal">
          {correspondance[2]}
        </span>,
      );
    } else if (correspondance[3] !== undefined) {
      morceaux.push(
        <span key={cle} className="text-[0.85em] leading-normal">
          {correspondance[3]}
        </span>,
      );
    }
    curseur = correspondance.index + correspondance[0].length;
  }
  if (curseur < ligne.length) {
    morceaux.push(ligne.slice(curseur));
  }
  return morceaux;
}

/** Affiche un texte saisi via EditeurTexteEnrichi, mise en forme comprise. */
export default function RichText({
  texte,
  className,
}: {
  texte: string;
  className?: string;
}) {
  const lignes = texte.split("\n");
  return (
    <p className={className}>
      {lignes.map((ligne, i) => (
        <span key={i}>
          {analyserLigne(ligne, `l${i}`)}
          {i < lignes.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}
