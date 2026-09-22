/**
 * État vide standard (aucune formation, aucun message, aucune
 * ressource...) — remplace les simples lignes de texte "Aucun élément"
 * par un rendu plus soigné et cohérent d'une page à l'autre.
 */
export default function EmptyState({
  icone,
  titre,
  message,
}: {
  icone: string;
  titre: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-germe-ink/15 bg-white/60 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-germe-cream text-2xl">
        {icone}
      </span>
      <p className="mt-4 text-sm font-medium text-germe-ink">{titre}</p>
      {message && <p className="mt-1 max-w-sm text-xs text-germe-ink/50">{message}</p>}
    </div>
  );
}
