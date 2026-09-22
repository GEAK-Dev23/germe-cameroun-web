"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  authApi,
  forumApi,
  ApiError,
  type SujetForumDetail,
  type Utilisateur,
} from "@/lib/api";

const LIBELLES_ROLES: Record<string, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  formateur: "Formateur",
  apprenant: "Apprenant",
};

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function SujetForumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [sujet, setSujet] = useState<SujetForumDetail | null>(null);
  const [moi, setMoi] = useState<Utilisateur | null>(null);
  const [reponse, setReponse] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  function recharger() {
    Promise.all([forumApi.obtenirSujet(id), authApi.me().catch(() => null)])
      .then(([s, moiRes]) => {
        setSujet(s);
        setMoi(moiRes?.utilisateur ?? null);
      })
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const estPersonnel =
    moi?.role === "super_admin" || moi?.role === "admin" || moi?.role === "formateur";

  async function repondre(e: React.FormEvent) {
    e.preventDefault();
    if (!reponse.trim()) return;
    setEnvoi(true);
    try {
      await forumApi.repondre(id, reponse);
      setReponse("");
      recharger();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Impossible d'envoyer la réponse.");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimerSujet() {
    if (!confirm("Supprimer définitivement ce sujet et ses réponses ?")) return;
    await forumApi.supprimerSujet(id);
    router.push("/plateforme/forum");
  }

  async function supprimerReponse(reponseId: string) {
    if (!confirm("Supprimer cette réponse ?")) return;
    await forumApi.supprimerReponse(reponseId);
    recharger();
  }

  async function basculerEpingle() {
    await forumApi.basculerEpingle(id);
    recharger();
  }

  if (chargement) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center text-germe-ink/50">
        Chargement...
      </div>
    );
  }

  if (erreur || !sujet) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-sm text-red-600">{erreur ?? "Sujet introuvable."}</p>
        <Link href="/plateforme/forum" className="mt-4 inline-block text-sm text-germe-blue hover:underline">
          ← Retour au forum
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12 md:px-6">
      <Link href="/plateforme/forum" className="text-sm text-germe-ink/60 hover:text-germe-ink">
        ← Retour au forum
      </Link>

      <div className="mt-4 rounded-xl border border-germe-ink/10 bg-white p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-xl font-semibold text-germe-ink">
            {sujet.epingle && <span className="mr-1">📌</span>}
            {sujet.titre}
          </h1>
          {estPersonnel && (
            <button
              type="button"
              onClick={basculerEpingle}
              className="shrink-0 text-xs font-medium text-germe-ink/50 hover:text-germe-ink"
            >
              {sujet.epingle ? "Désépingler" : "Épingler"}
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-germe-ink/50">
          {sujet.auteurNom} · {LIBELLES_ROLES[sujet.auteurRole] ?? sujet.auteurRole} ·{" "}
          {formaterDate(sujet.createdAt)}
        </p>
        <p className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-germe-ink/80">
          {sujet.contenu}
        </p>
        {(moi?.id === sujet.auteurId || estPersonnel) && (
          <button
            type="button"
            onClick={supprimerSujet}
            className="mt-4 text-xs font-medium text-red-500 hover:underline"
          >
            Supprimer ce sujet
          </button>
        )}
      </div>

      <h2 className="mt-8 text-sm font-semibold text-germe-ink">
        {sujet.reponses.length} réponse{sujet.reponses.length !== 1 ? "s" : ""}
      </h2>

      <div className="mt-3 space-y-3">
        {sujet.reponses.map((r) => (
          <div key={r.id} className="rounded-xl border border-germe-ink/10 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium text-germe-ink/60">
                {r.auteurNom} · {LIBELLES_ROLES[r.auteurRole] ?? r.auteurRole} ·{" "}
                {formaterDate(r.createdAt)}
              </p>
              {(moi?.id === r.auteurId || estPersonnel) && (
                <button
                  type="button"
                  onClick={() => supprimerReponse(r.id)}
                  className="shrink-0 text-xs text-germe-ink/40 hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="mt-2 whitespace-pre-line break-words text-sm text-germe-ink/80">
              {r.contenu}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={repondre} className="mt-6 space-y-2">
        <textarea
          rows={3}
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          placeholder="Votre réponse..."
          className="w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 text-sm focus:border-germe-blue focus:outline-none"
        />
        <button
          type="submit"
          disabled={!reponse.trim() || envoi}
          className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-50"
        >
          {envoi ? "Envoi..." : "Répondre"}
        </button>
      </form>
    </main>
  );
}
