"use client";

import { useEffect, useState } from "react";
import { vitrineApi, ApiError, type Article } from "@/lib/api";
import ChampMedia from "@/components/admin/ChampMedia";
import EditeurTexteEnrichi from "@/components/admin/EditeurTexteEnrichi";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [chargement, setChargement] = useState(true);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  function recharger() {
    setChargement(true);
    vitrineApi
      .articlesAdmin()
      .then(setArticles)
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  async function basculerPublie(a: Article) {
    await vitrineApi.modifierArticle(a.id, {
      ...a,
      imageCouverture: a.imageCouverture ?? undefined,
      publie: !a.publie,
    });
    recharger();
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    await vitrineApi.supprimerArticle(id);
    recharger();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <PageHeader
        icone="📰"
        titre="Blog"
        sousTitre="Publiez des articles et actualités sur le site vitrine."
        action={
          <button
            type="button"
            onClick={() => setFormulaireOuvert(!formulaireOuvert)}
            className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
          >
            {formulaireOuvert ? "Annuler" : "+ Nouvel article"}
          </button>
        }
      />

      {formulaireOuvert && (
        <FormulaireArticle
          onCree={() => {
            setFormulaireOuvert(false);
            recharger();
          }}
        />
      )}

      {chargement ? (
        <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>
      ) : articles.length === 0 ? (
        <div className="mt-8">
          <EmptyState icone="📰" titre="Aucun article pour le moment" />
        </div>
      ) : (
        <div className="mt-8 divide-y divide-germe-ink/10 overflow-hidden rounded-2xl border border-germe-ink/10 bg-white shadow-sm">
          {articles.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-germe-ink">{a.titre}</p>
                <p className="mt-0.5 text-xs text-germe-ink/50">{a.chapo}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => basculerPublie(a)}
                  className={
                    a.publie
                      ? "rounded-full bg-germe-green/15 px-3 py-1 text-xs font-medium text-germe-green"
                      : "rounded-full bg-germe-ink/10 px-3 py-1 text-xs font-medium text-germe-ink/60"
                  }
                >
                  {a.publie ? "Publié" : "Brouillon"}
                </button>
                <button
                  type="button"
                  onClick={() => supprimer(a.id)}
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

function FormulaireArticle({ onCree }: { onCree: () => void }) {
  const [titre, setTitre] = useState("");
  const [chapo, setChapo] = useState("");
  const [contenu, setContenu] = useState("");
  const [imageCouverture, setImageCouverture] = useState("");
  const [publie, setPublie] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await vitrineApi.creerArticle({
        titre,
        chapo,
        contenu,
        imageCouverture: imageCouverture || undefined,
        publie,
      });
      onCree();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de créer l'article.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="mt-6 space-y-3 rounded-xl border border-germe-ink/10 bg-white p-5">
      <input
        required
        placeholder="Titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <textarea
        required
        rows={2}
        placeholder="Chapô (court résumé affiché dans les listes)"
        value={chapo}
        onChange={(e) => setChapo(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <ChampMedia
        value={imageCouverture}
        onChange={setImageCouverture}
        placeholder="Image de couverture (facultatif)"
      />
      <div>
        <p className="mb-1 text-[11px] font-medium text-germe-ink/50">Contenu</p>
        <EditeurTexteEnrichi value={contenu} onChange={setContenu} rows={8} />
      </div>
      <label className="flex items-center gap-2 text-sm text-germe-ink">
        <input
          type="checkbox"
          checked={publie}
          onChange={(e) => setPublie(e.target.checked)}
          className="h-4 w-4 rounded border-germe-ink/30"
        />
        Publier immédiatement
      </label>

      {erreur && <p className="text-xs text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={envoi}
        className="rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {envoi ? "Création..." : "Créer l'article"}
      </button>
    </form>
  );
}
