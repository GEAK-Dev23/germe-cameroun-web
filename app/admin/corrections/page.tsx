"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { correctionsApi, ApiError, type SoumissionACorreger } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCorrectionsPage() {
  const [soumissions, setSoumissions] = useState<SoumissionACorreger[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  function recharger() {
    setChargement(true);
    correctionsApi
      .lister()
      .then(setSoumissions)
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <PageHeader
        icone="✍️"
        titre="Exercices à corriger"
        sousTitre="Réponses libres (rédaction, étude de marché...) en attente d'une correction humaine."
      />

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && (
        <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>
      )}

      {!chargement && soumissions.length === 0 && !erreur && (
        <div className="mt-8">
          <EmptyState icone="🎉" titre="Tout est corrigé !" message="Aucune soumission en attente pour le moment." />
        </div>
      )}

      <div className="mt-6 space-y-4">
        {soumissions.map((s) => (
          <SoumissionCarte key={s.id} soumission={s} onCorrigee={recharger} />
        ))}
      </div>
    </main>
  );
}

function SoumissionCarte({
  soumission: s,
  onCorrigee,
}: {
  soumission: SoumissionACorreger;
  onCorrigee: () => void;
}) {
  const [commentaire, setCommentaire] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function corriger(reussi: boolean) {
    setEnvoi(true);
    try {
      await correctionsApi.corriger(s.id, reussi, commentaire || undefined);
      onCorrigee();
    } catch {
      alert("Impossible d'enregistrer la correction.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="rounded-xl border border-germe-ink/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-germe-ink/50">
        <span>
          {s.leconTitre ? `Leçon : ${s.leconTitre}` : "Leçon inconnue"}
        </span>
        {s.formationId && (
          <Link
            href={`/admin/formations/${s.formationId}`}
            className="text-germe-blue hover:underline"
          >
            Voir la formation →
          </Link>
        )}
      </div>

      <p className="mt-2 text-sm font-medium text-germe-ink">{s.question}</p>

      <div className="mt-3 rounded-lg bg-germe-cream p-3 text-sm text-germe-ink/80 whitespace-pre-line">
        {typeof s.reponse === "string" ? s.reponse : JSON.stringify(s.reponse)}
      </div>

      <textarea
        rows={2}
        placeholder="Commentaire pour l'apprenant (facultatif)"
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        className="mt-3 w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => corriger(false)}
          disabled={envoi}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          À améliorer
        </button>
        <button
          type="button"
          onClick={() => corriger(true)}
          disabled={envoi}
          className="rounded-full bg-germe-green px-4 py-2 text-xs font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-50"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
