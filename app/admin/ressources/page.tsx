"use client";

import { useEffect, useState } from "react";
import {
  ressourcesApi,
  formationsApi,
  ApiError,
  type Ressource,
  type Formation,
} from "@/lib/api";
import ChampMedia from "@/components/admin/ChampMedia";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

const CATEGORIES = [
  "Général",
  "Business plan",
  "Modèle financier",
  "Étude de marché",
  "Guide pratique",
];

export default function AdminRessourcesPage() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [chargement, setChargement] = useState(true);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  function recharger() {
    setChargement(true);
    Promise.all([ressourcesApi.listerToutes(), formationsApi.listerToutes()])
      .then(([r, f]) => {
        setRessources(r);
        setFormations(f);
      })
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  async function supprimer(id: string) {
    if (!confirm("Supprimer cette ressource ?")) return;
    await ressourcesApi.supprimer(id);
    recharger();
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 md:px-6">
      <PageHeader
        icone="📚"
        titre="Bibliothèque de ressources"
        sousTitre="Modèles, guides et fiches pratiques téléchargeables par les apprenants."
        action={
          <button
            type="button"
            onClick={() => setFormulaireOuvert(!formulaireOuvert)}
            className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
          >
            {formulaireOuvert ? "Annuler" : "+ Ajouter une ressource"}
          </button>
        }
      />

      {formulaireOuvert && (
        <FormulaireRessource
          formations={formations}
          onCree={() => {
            setFormulaireOuvert(false);
            recharger();
          }}
        />
      )}

      {chargement ? (
        <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>
      ) : ressources.length === 0 ? (
        <div className="mt-8">
          <EmptyState icone="📄" titre="Aucune ressource pour le moment" />
        </div>
      ) : (
        <div className="mt-8 divide-y divide-germe-ink/10 overflow-hidden rounded-2xl border border-germe-ink/10 bg-white shadow-sm">
          {ressources.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-germe-ink">{r.titre}</p>
                  <span className="rounded-full bg-germe-cream px-2 py-0.5 text-[11px] font-medium text-germe-ink/60">
                    {r.categorie}
                  </span>
                </div>
                {r.description && (
                  <p className="mt-0.5 text-xs text-germe-ink/50">
                    {r.description}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-germe-ink/40">
                  Formations : {r.formations.map((f) => f.titre).join(", ") || "aucune"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <a
                  href={r.fichierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-germe-blue hover:underline"
                >
                  Voir le fichier
                </a>
                <button
                  type="button"
                  onClick={() => supprimer(r.id)}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function FormulaireRessource({
  formations,
  onCree,
}: {
  formations: Formation[];
  onCree: () => void;
}) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [fichierUrl, setFichierUrl] = useState("");
  const [categorie, setCategorie] = useState("Général");
  const [formationIds, setFormationIds] = useState<string[]>([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function basculerFormation(id: string) {
    setFormationIds((liste) =>
      liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id],
    );
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!fichierUrl) {
      setErreur("Téléversez un fichier ou renseignez son URL.");
      return;
    }
    if (formationIds.length === 0) {
      setErreur("Sélectionnez au moins une formation.");
      return;
    }
    setEnvoi(true);
    setErreur(null);
    try {
      await ressourcesApi.creer({
        titre,
        description: description || undefined,
        fichierUrl,
        categorie,
        formationIds,
      });
      onCree();
    } catch (err) {
      setErreur(
        err instanceof ApiError ? err.message : "Impossible de créer la ressource.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form
      onSubmit={soumettre}
      className="mt-6 space-y-3 rounded-xl border border-germe-ink/10 bg-white p-5"
    >
      <input
        required
        placeholder="Titre (ex : Modèle de business plan)"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <textarea
        rows={2}
        placeholder="Description (facultatif)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <ChampMedia
        value={fichierUrl}
        onChange={setFichierUrl}
        placeholder="URL du fichier (PDF, image...) ou téléversez-le"
        accept="application/pdf,image/*,video/*"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-medium text-germe-ink/60">
          Formations concernées (au moins une)
        </p>
        <div className="mt-1 max-h-40 space-y-1.5 overflow-y-auto rounded-lg border border-germe-ink/15 p-2.5">
          {formations.map((f) => (
            <label key={f.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formationIds.includes(f.id)}
                onChange={() => basculerFormation(f.id)}
                className="rounded border-germe-ink/30"
              />
              {f.titre}
            </label>
          ))}
        </div>
      </div>

      {erreur && <p className="text-xs text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={envoi}
        className="rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {envoi ? "Création..." : "Ajouter la ressource"}
      </button>
    </form>
  );
}
