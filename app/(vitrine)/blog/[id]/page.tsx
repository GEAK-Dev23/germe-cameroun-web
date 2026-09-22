"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { vitrineApi, ApiError, type Article } from "@/lib/api";
import RichText from "@/components/plateforme/RichText";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date));
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    vitrineApi
      .article(id)
      .then(setArticle)
      .catch((err) =>
        setErreur(err instanceof ApiError ? err.message : "Article introuvable."),
      )
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) {
    return <p className="mx-auto max-w-2xl px-5 py-20 text-center text-germe-ink/50">Chargement...</p>;
  }

  if (erreur || !article) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-sm text-red-600">{erreur ?? "Article introuvable."}</p>
        <Link href="/blog" className="mt-4 inline-block text-sm text-germe-blue hover:underline">
          ← Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 md:px-6">
      <Link href="/blog" className="text-sm text-germe-ink/60 hover:text-germe-ink">
        ← Retour au blog
      </Link>

      {article.imageCouverture && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageCouverture}
          alt=""
          className="mt-4 aspect-video w-full rounded-xl object-cover"
        />
      )}

      <p className="mt-6 text-xs text-germe-ink/40">
        {formaterDate(article.createdAt)} · Par {article.auteurNom}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-germe-ink">
        {article.titre}
      </h1>
      <p className="mt-3 text-sm italic text-germe-ink/60">{article.chapo}</p>

      <div className="mt-6">
        <RichText texte={article.contenu} className="text-base leading-relaxed text-germe-ink/80" />
      </div>
    </main>
  );
}
