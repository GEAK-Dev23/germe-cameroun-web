"use client";

import { useEffect, useState } from "react";
import { vitrineApi, ApiError, type OffrePartenaire } from "@/lib/api";
import ChampMedia from "@/components/admin/ChampMedia";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminOffresPartenairesPage() {
  const [offres, setOffres] = useState<OffrePartenaire[]>([]);
  const [chargement, setChargement] = useState(true);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  function recharger() {
    setChargement(true);
    vitrineApi
      .offresAdmin()
      .then(setOffres)
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  async function basculerPublie(o: OffrePartenaire) {
    await vitrineApi.modifierOffre(o.id, {
      ...o,
      logoUrl: o.logoUrl ?? undefined,
      lienExterne: o.lienExterne ?? undefined,
      publie: !o.publie,
    });
    recharger();
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer cette offre ?")) return;
    await vitrineApi.supprimerOffre(id);
    recharger();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <PageHeader
        icone="🤝"
        titre="Offres partenaires"
        sousTitre='Affichées dans la section "Nos partenaires" du site vitrine.'
        action={
          <button
            type="button"
            onClick={() => setFormulaireOuvert(!formulaireOuvert)}
            className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
          >
            {formulaireOuvert ? "Annuler" : "+ Nouvelle offre"}
          </button>
        }
      />

      {formulaireOuvert && (
        <FormulaireOffre
          onCree={() => {
            setFormulaireOuvert(false);
            recharger();
          }}
        />
      )}

      {chargement ? (
        <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>
      ) : offres.length === 0 ? (
        <div className="mt-8">
          <EmptyState icone="🤝" titre="Aucune offre pour le moment" />
        </div>
      ) : (
        <div className="mt-8 divide-y divide-germe-ink/10 overflow-hidden rounded-2xl border border-germe-ink/10 bg-white shadow-sm">
          {offres.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-germe-ink">{o.nomPartenaire}</p>
                <p className="mt-0.5 text-xs text-germe-ink/50">{o.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => basculerPublie(o)}
                  className={
                    o.publie
                      ? "rounded-full bg-germe-green/15 px-3 py-1 text-xs font-medium text-germe-green"
                      : "rounded-full bg-germe-ink/10 px-3 py-1 text-xs font-medium text-germe-ink/60"
                  }
                >
                  {o.publie ? "Publiée" : "Brouillon"}
                </button>
                <button
                  type="button"
                  onClick={() => supprimer(o.id)}
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

function FormulaireOffre({ onCree }: { onCree: () => void }) {
  const [nomPartenaire, setNomPartenaire] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [lienExterne, setLienExterne] = useState("");
  const [publie, setPublie] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await vitrineApi.creerOffre({
        nomPartenaire,
        logoUrl: logoUrl || undefined,
        description,
        lienExterne: lienExterne || undefined,
        publie,
      });
      onCree();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de créer l'offre.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="mt-6 space-y-3 rounded-xl border border-germe-ink/10 bg-white p-5">
      <input
        required
        placeholder="Nom du partenaire"
        value={nomPartenaire}
        onChange={(e) => setNomPartenaire(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <ChampMedia value={logoUrl} onChange={setLogoUrl} placeholder="Logo (facultatif)" />
      <textarea
        required
        rows={3}
        placeholder="Description de l'offre"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <input
        placeholder="Lien externe (facultatif)"
        value={lienExterne}
        onChange={(e) => setLienExterne(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
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
        {envoi ? "Création..." : "Ajouter l'offre"}
      </button>
    </form>
  );
}
