"use client";

import { useEffect, useState } from "react";
import { authApi, profilApi, ApiError } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

export default function ProfilPage() {
  const [bio, setBio] = useState("");
  const [secteur, setSecteur] = useState("");
  const [telephoneReseau, setTelephoneReseau] = useState("");
  const [visibleReseau, setVisibleReseau] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    authApi
      .me()
      .then(({ utilisateur }) => {
        setBio(utilisateur.bio ?? "");
        setSecteur(utilisateur.secteur ?? "");
        setTelephoneReseau(utilisateur.telephoneReseau ?? "");
        setVisibleReseau(utilisateur.visibleReseau ?? false);
      })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    setSucces(false);
    try {
      await profilApi.mettreAJour({ bio, secteur, telephoneReseau, visibleReseau });
      setSucces(true);
    } catch (err) {
      setErreur(
        err instanceof ApiError ? err.message : "Impossible d'enregistrer votre profil.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center text-germe-ink/50">
        Chargement...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-10 md:px-6">
      <PageHeader
        icone="🙍"
        titre="Mon profil"
        sousTitre="Ces informations sont utilisées pour la mise en réseau avec d'autres entrepreneurs — elles restent facultatives et privées par défaut."
      />

      <form
        onSubmit={enregistrer}
        className="mt-6 space-y-4 rounded-2xl border border-germe-ink/10 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="secteur">
            Secteur d'activité
          </label>
          <input
            id="secteur"
            value={secteur}
            onChange={(e) => setSecteur(e.target.value)}
            placeholder="Ex : Maraîchage bio, Élevage avicole..."
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="bio">
            Courte présentation
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Parlez brièvement de votre projet ou de votre activité..."
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="telephoneReseau">
            Téléphone de contact
          </label>
          <input
            id="telephoneReseau"
            value={telephoneReseau}
            onChange={(e) => setTelephoneReseau(e.target.value)}
            placeholder="Ex : +237 6XX XXX XXX"
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-germe-ink/40">
            Jamais visible par les autres membres du Réseau — uniquement par
            l'équipe pédagogique, pour vous mettre en relation à votre demande.
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-lg bg-germe-cream/60 p-3 text-sm text-germe-ink">
          <input
            type="checkbox"
            checked={visibleReseau}
            onChange={(e) => setVisibleReseau(e.target.checked)}
            className="h-4 w-4 rounded border-germe-ink/30"
          />
          Apparaître dans l'annuaire du réseau d'entrepreneurs
        </label>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        {succes && <p className="text-sm text-germe-green">Profil enregistré !</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full rounded-full bg-germe-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-60"
        >
          {envoi ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </main>
  );
}
