"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";
import { vitrineApi, type Article } from "@/lib/api";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date));
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    vitrineApi
      .articles()
      .then((liste) => setArticles(liste.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section id="blog" className="bg-germe-cream">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Notre blog
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Conseils & actualités
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.id} delay={i * 100}>
              <Link
                href={`/blog/${a.id}`}
                className="block overflow-hidden rounded-xl border border-germe-ink/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
              >
                {a.imageCouverture && (
                  <MirrorImage
                    src={a.imageCouverture}
                    alt={a.titre}
                    className="aspect-video w-full"
                    imgClassName="transition duration-700 hover:scale-105"
                    intensite={0.22}
                  />
                )}
                <div className="p-5">
                  <span className="inline-block rounded-full bg-germe-wheat px-3 py-1 text-xs font-medium text-germe-ink">
                    {formaterDate(a.createdAt)}
                  </span>
                  <h3 className="mt-2 font-display text-base font-semibold text-germe-ink">
                    {a.titre}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-germe-ink/60">{a.chapo}</p>
                  <span className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-germe-green/15 text-germe-green transition hover:bg-germe-green hover:text-white">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Link
            href="/blog"
            className="mt-8 inline-block text-sm font-medium text-germe-green hover:underline"
          >
            Voir tous les articles →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
