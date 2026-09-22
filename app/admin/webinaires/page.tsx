"use client";

import { useEffect, useState } from "react";
import { webinairesApi, ApiError, type Webinaire } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function formaterDateHeure(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(
    new Date(date),
  );
}

export default function AdminWebinairesPage() {
  const [webinaires, setWebinaires] = useState<Webinaire[]>([]);
  const [chargement, setChargement] = useState(true);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  function recharger() {
    setChargement(true);
    webinairesApi
      .lister()
      .then(setWebinaires)
      .finally(() => setChargement(false));
  }

  useEffect(recharger, []);

  async function supprimer(id: string) {
    if (!confirm("Supprimer ce webinaire ?")) return;
    await webinairesApi.supprimer(id);
    recharger();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <PageHeader
        icone="📹"
        titre="Webinaires"
        sousTitre="Programmez une classe virtuelle — tous les apprenants seront notifiés."
        action={
          <button
            type="button"
            onClick={() => setFormulaireOuvert(!formulaireOuvert)}
            className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
          >
            {formulaireOuvert ? "Annuler" : "+ Programmer un webinaire"}
          </button>
        }
      />

      {formulaireOuvert && (
        <FormulaireWebinaire
          onCree={() => {
            setFormulaireOuvert(false);
            recharger();
          }}
        />
      )}

      {chargement ? (
        <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>
      ) : webinaires.length === 0 ? (
        <div className="mt-8">
          <EmptyState icone="📹" titre="Aucun webinaire programmé" />
        </div>
      ) : (
        <div className="mt-8 divide-y divide-germe-ink/10 overflow-hidden rounded-2xl border border-germe-ink/10 bg-white shadow-sm">
          {webinaires.map((w) => (
            <div key={w.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-germe-ink">{w.titre}</p>
                <p className="mt-0.5 text-xs text-germe-ink/50">
                  {formaterDateHeure(w.dateHeure)}
                  {w.animePar && ` · Animé par ${w.animePar}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => supprimer(w.id)}
                className="shrink-0 text-xs font-medium text-red-500 hover:underline"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function FormulaireWebinaire({ onCree }: { onCree: () => void }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lienVisio, setLienVisio] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [animePar, setAnimePar] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await webinairesApi.creer({
        titre,
        description: description || undefined,
        lienVisio,
        dateHeure: new Date(dateHeure).toISOString(),
        animePar: animePar || undefined,
      });
      onCree();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de créer le webinaire.");
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
        rows={2}
        placeholder="Description (facultatif)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          type="datetime-local"
          value={dateHeure}
          onChange={(e) => setDateHeure(e.target.value)}
          className="rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
        />
        <input
          placeholder="Animé par (facultatif)"
          value={animePar}
          onChange={(e) => setAnimePar(e.target.value)}
          className="rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
        />
      </div>
      <input
        required
        placeholder="Lien de la visioconférence (Google Meet, Zoom, Jitsi...)"
        value={lienVisio}
        onChange={(e) => setLienVisio(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />

      {erreur && <p className="text-xs text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={envoi}
        className="rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {envoi ? "Création..." : "Programmer le webinaire"}
      </button>
    </form>
  );
}
