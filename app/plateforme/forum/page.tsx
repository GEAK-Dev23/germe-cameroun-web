"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { forumApi, ApiError, type SujetForum } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

const LIBELLES_ROLES: Record<string, string> = {
  super_admin: "Équipe pédagogique",
  admin: "Équipe pédagogique",
  formateur: "Formateur",
  apprenant: "Apprenant",
};

function tempsEcoule(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const heures = Math.floor(diffMs / 3_600_000);
  if (heures < 1) return "à l'instant";
  if (heures < 24) return `il y a ${heures} h`;
  const jours = Math.floor(heures / 24);
  return `il y a ${jours} j`;
}

export default function ForumPage() {
  const [sujets, setSujets] = useState<SujetForum[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    forumApi
      .listerSujets()
      .then(setSujets)
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <PageHeader
        icone="💬"
        titre="Forum communautaire"
        sousTitre="Échangez avec d'autres apprenants et l'équipe pédagogique."
        action={
          <Link
            href="/plateforme/forum/nouveau"
            className="rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
          >
            + Nouveau sujet
          </Link>
        }
      />

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && (
        <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>
      )}

      {!chargement && sujets.length === 0 && !erreur && (
        <div className="mt-8">
          <EmptyState
            icone="💬"
            titre="Aucun sujet pour le moment"
            message="Soyez le premier à lancer une discussion avec la communauté."
          />
        </div>
      )}

      <div className="mt-8 space-y-2">
        {sujets.map((s) => (
          <Link
            key={s.id}
            href={`/plateforme/forum/${s.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-germe-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-germe-blue/30 hover:shadow-md"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {s.epingle && <span className="text-xs">📌</span>}
                <p className="truncate font-medium text-germe-ink">{s.titre}</p>
              </div>
              <p className="mt-0.5 text-xs text-germe-ink/50">
                {s.auteurNom} · {LIBELLES_ROLES[s.auteurRole] ?? s.auteurRole} ·{" "}
                {tempsEcoule(s.createdAt)}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-germe-blueLight px-3 py-1 text-xs font-medium text-germe-blue">
              {s.nombreReponses} réponse{s.nombreReponses !== 1 ? "s" : ""}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
