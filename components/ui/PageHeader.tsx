/**
 * En-tête standard de toutes les pages accessibles depuis le menu
 * (apprenant et admin) : badge dégradé + titre + sous-titre + emplacement
 * pour une action (bouton, recherche...). Remplace les simples <h1> pour
 * un rendu plus soigné et cohérent d'une page à l'autre.
 */
export default function PageHeader({
  icone,
  titre,
  sousTitre,
  action,
}: {
  icone: string;
  titre: string;
  sousTitre?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-germe-ink/10 pb-6">
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-germe-blue to-germe-green text-2xl shadow-sm">
          {icone}
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-germe-ink">{titre}</h1>
          {sousTitre && <p className="mt-1 text-sm text-germe-ink/60">{sousTitre}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
