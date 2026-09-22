"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formationsApi, ApiError } from "@/lib/api";
import ChampMedia from "@/components/admin/ChampMedia";

export default function NouvelleFormationPage() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState("Agriculture");
  const [imageCouverture, setImageCouverture] = useState("");
  const [estPayant, setEstPayant] = useState(false);
  const [prixFcfa, setPrixFcfa] = useState(0);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);
    try {
      const formation = await formationsApi.creer({
        titre,
        description: description || undefined,
        categorie,
        imageCouverture: imageCouverture || undefined,
        estPayant,
        prixFcfa: estPayant ? prixFcfa : 0,
      });
      router.push(`/admin/formations/${formation.id}`);
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de créer la formation.",
      );
      setChargement(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-12 md:px-6">
      <Link
        href="/admin/formations"
        className="text-sm text-germe-ink/60 hover:text-germe-ink"
      >
        ← Retour aux formations
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-germe-ink">
        Nouvelle formation
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-xl border border-germe-ink/10 bg-white p-6"
      >
        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="titre">
            Titre
          </label>
          <input
            id="titre"
            required
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          />
        </div>

        <div>
          <p className="text-sm text-germe-ink/70">
            Image de couverture de la formation
          </p>
          <div className="mt-1">
            <ChampMedia
              value={imageCouverture}
              onChange={setImageCouverture}
              placeholder="URL de l'image (ou téléversez un fichier)"
            />
          </div>
          {imageCouverture && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageCouverture}
              alt=""
              className="mt-2 aspect-video w-full max-w-xs rounded-lg object-cover"
            />
          )}
          <p className="mt-1 text-xs text-germe-ink/40">
            Facultatif — une image par défaut est utilisée si vous ne
            renseignez rien.
          </p>
        </div>

        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="categorie">
            Catégorie
          </label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          >
            <option>Agriculture</option>
            <option>Élevage</option>
            <option>Gestion</option>
            <option>Équipement</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="est-payant"
            type="checkbox"
            checked={estPayant}
            onChange={(e) => setEstPayant(e.target.checked)}
            className="h-4 w-4 rounded border-germe-ink/30"
          />
          <label htmlFor="est-payant" className="text-sm text-germe-ink">
            Formation payante
          </label>
        </div>

        {estPayant && (
          <div>
            <label className="text-sm text-germe-ink/70" htmlFor="prix">
              Prix (FCFA)
            </label>
            <input
              id="prix"
              type="number"
              min={0}
              value={prixFcfa}
              onChange={(e) => setPrixFcfa(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
            />
          </div>
        )}

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded-full bg-germe-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-60"
        >
          {chargement ? "Création..." : "Créer et continuer"}
        </button>
        <p className="text-center text-xs text-germe-ink/50">
          Vous pourrez ajouter les modules, chapitres et leçons juste après.
        </p>
      </form>
    </main>
  );
}
