"use client";

import { useEffect, useState } from "react";
import { vitrineApi, ApiError, type Temoignage } from "@/lib/api";
import ChampMedia from "@/components/admin/ChampMedia";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminTemoignagesPage() {
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [chargement, setChargement] = useState(true);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  function recharger() {
    setChargement(true);
    vitrineApi
      .temoignagesAdmin()
      .then(setTemoignages)
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  async function basculerPublie(t: Temoignage) {
    await vitrineApi.modifierTemoignage(t.id, {
      ...t,
      photoUrl: t.photoUrl ?? undefined,
      publie: !t.publie,
    });
    recharger();
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer ce témoignage ?")) return;
    await vitrineApi.supprimerTemoignage(id);
    recharger();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <PageHeader
        icone="⭐"
        titre="Témoignages"
        sousTitre="Mettez en avant les succès de vos apprenants sur le site vitrine."
        action={
          <button
            type="button"
            onClick={() => setFormulaireOuvert(!formulaireOuvert)}
            className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
          >
            {formulaireOuvert ? "Annuler" : "+ Nouveau témoignage"}
          </button>
        }
      />

      {formulaireOuvert && (
        <FormulaireTemoignage
          onCree={() => {
            setFormulaireOuvert(false);
            recharger();
          }}
        />
      )}

      {chargement ? (
        <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>
      ) : temoignages.length === 0 ? (
        <div className="mt-8">
          <EmptyState icone="⭐" titre="Aucun témoignage pour le moment" />
        </div>
      ) : (
        <div className="mt-8 divide-y divide-germe-ink/10 overflow-hidden rounded-2xl border border-germe-ink/10 bg-white shadow-sm">
          {temoignages.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-germe-ink">
                  {t.nom} <span className="text-xs text-germe-ink/40">— {t.fonction}</span>
                </p>
                <p className="mt-0.5 text-xs text-germe-ink/50">« {t.texte} »</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => basculerPublie(t)}
                  className={
                    t.publie
                      ? "rounded-full bg-germe-green/15 px-3 py-1 text-xs font-medium text-germe-green"
                      : "rounded-full bg-germe-ink/10 px-3 py-1 text-xs font-medium text-germe-ink/60"
                  }
                >
                  {t.publie ? "Publié" : "Brouillon"}
                </button>
                <button
                  type="button"
                  onClick={() => supprimer(t.id)}
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

function FormulaireTemoignage({ onCree }: { onCree: () => void }) {
  const [nom, setNom] = useState("");
  const [fonction, setFonction] = useState("");
  const [texte, setTexte] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [publie, setPublie] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await vitrineApi.creerTemoignage({
        nom,
        fonction,
        texte,
        photoUrl: photoUrl || undefined,
        publie,
      });
      onCree();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de créer le témoignage.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="mt-6 space-y-3 rounded-xl border border-germe-ink/10 bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
        />
        <input
          required
          placeholder="Fonction (ex : Maraîchère, Bafoussam)"
          value={fonction}
          onChange={(e) => setFonction(e.target.value)}
          className="rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
        />
      </div>
      <textarea
        required
        rows={3}
        placeholder="Témoignage"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <ChampMedia value={photoUrl} onChange={setPhotoUrl} placeholder="Photo (facultatif)" />
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
        {envoi ? "Création..." : "Ajouter"}
      </button>
    </form>
  );
}
