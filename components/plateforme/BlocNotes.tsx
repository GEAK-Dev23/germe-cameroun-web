"use client";

import { useEffect, useRef, useState } from "react";
import { notesApi, ApiError } from "@/lib/api";

const DELAI_SAUVEGARDE_MS = 1200;

export default function BlocNotes({ formationId }: { formationId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [contenu, setContenu] = useState("");
  const [statut, setStatut] = useState<"inactif" | "en_attente" | "enregistre" | "erreur">(
    "inactif",
  );
  const [chargement, setChargement] = useState(true);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const premierChargement = useRef(true);

  useEffect(() => {
    notesApi
      .obtenir(formationId)
      .then((n) => {
        setContenu(n.contenu);
        premierChargement.current = false;
      })
      .catch(() => {
        premierChargement.current = false;
      })
      .finally(() => setChargement(false));
  }, [formationId]);

  function surChangement(valeur: string) {
    setContenu(valeur);
    if (premierChargement.current) return;

    setStatut("en_attente");
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(async () => {
      try {
        await notesApi.enregistrer(formationId, valeur);
        setStatut("enregistre");
      } catch {
        setStatut("erreur");
      }
    }, DELAI_SAUVEGARDE_MS);
  }

  async function effacer() {
    if (!confirm("Effacer définitivement vos notes pour cette formation ?")) return;
    try {
      await notesApi.supprimer(formationId);
      setContenu("");
      setStatut("inactif");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Impossible d'effacer les notes.");
    }
  }

  return (
    <div className="rounded-xl border border-germe-ink/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className="flex w-full items-center justify-between gap-2 p-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-germe-ink">
          📝 Mes notes
        </span>
        <span className="text-germe-ink/40">{ouvert ? "▲" : "▼"}</span>
      </button>

      {ouvert && (
        <div className="border-t border-germe-ink/10 p-4">
          {chargement ? (
            <p className="text-xs text-germe-ink/40">Chargement...</p>
          ) : (
            <>
              <textarea
                rows={8}
                value={contenu}
                onChange={(e) => surChangement(e.target.value)}
                placeholder="Prenez des notes pendant votre formation — elles ne sont visibles que par vous et sont sauvegardées automatiquement."
                className="w-full resize-y rounded-lg border border-germe-ink/20 px-3 py-2 text-sm leading-relaxed focus:border-germe-blue focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] text-germe-ink/40">
                  {statut === "en_attente" && "Enregistrement..."}
                  {statut === "enregistre" && "✓ Notes enregistrées"}
                  {statut === "erreur" && (
                    <span className="text-red-600">
                      Échec de l'enregistrement — vérifiez votre connexion.
                    </span>
                  )}
                </p>
                {contenu && (
                  <button
                    type="button"
                    onClick={effacer}
                    className="text-[11px] font-medium text-red-500 hover:underline"
                  >
                    Effacer mes notes
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
