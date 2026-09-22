"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forumApi, ApiError } from "@/lib/api";

export default function NouveauSujetPage() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      const sujet = await forumApi.creerSujet(titre, contenu);
      router.push(`/plateforme/forum/${sujet.id}`);
    } catch (err) {
      setErreur(
        err instanceof ApiError ? err.message : "Impossible de créer ce sujet.",
      );
      setEnvoi(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-12 md:px-6">
      <Link
        href="/plateforme/forum"
        className="text-sm text-germe-ink/60 hover:text-germe-ink"
      >
        ← Retour au forum
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-germe-ink">
        Nouveau sujet
      </h1>

      <form
        onSubmit={soumettre}
        className="mt-6 space-y-4 rounded-xl border border-germe-ink/10 bg-white p-6"
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
            placeholder="Ex : Comment trouver un local pour mon élevage ?"
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="contenu">
            Message
          </label>
          <textarea
            id="contenu"
            required
            rows={6}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Expliquez votre question ou votre sujet en détail..."
            className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
          />
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full rounded-full bg-germe-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-60"
        >
          {envoi ? "Publication..." : "Publier le sujet"}
        </button>
      </form>
    </main>
  );
}
