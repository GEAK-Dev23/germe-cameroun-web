"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { vitrineApi, type Article } from "@/lib/api";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date));
}

export default function BlogListePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    vitrineApi
      .articles()
      .then(setArticles)
      .finally(() => setChargement(false));
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-5 py-16 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
        Notre blog
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-germe-ink">
        Conseils & actualités
      </h1>

      {chargement && <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>}

      {!chargement && articles.length === 0 && (
        <p className="mt-8 text-sm text-germe-ink/50">
          Aucun article publié pour le moment.
        </p>
      )}

      <div className="mt-10 space-y-6">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/blog/${a.id}`}
            className="block rounded-xl border border-germe-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-xs text-germe-ink/40">{formaterDate(a.createdAt)}</span>
            <h2 className="mt-1 font-display text-xl font-semibold text-germe-ink">
              {a.titre}
            </h2>
            <p className="mt-2 text-sm text-germe-ink/60">{a.chapo}</p>
            <p className="mt-3 text-xs font-medium text-germe-green">
              Lire l'article →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
