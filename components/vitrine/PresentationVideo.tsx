"use client";

import { useState } from "react";
import Reveal from "@/components/vitrine/Reveal";

// Identifiant de la vidéo YouTube : la partie après "v=" dans
// https://www.youtube.com/watch?v=XXXXXXXXXXX (ou après "youtu.be/").
// Pour changer de vidéo, il suffit de modifier cette seule ligne.
const YOUTUBE_ID = "yLXJTrje6lk";

const DOCUMENTS = [
  {
    langue: "Français",
    href: "/documents/presentation-germe-cameroun-fr.pdf",
    fichier: "Presentation-GERME-Cameroun-FR.pdf",
  },
  {
    langue: "English",
    href: "/documents/presentation-germe-cameroun-en.pdf",
    fichier: "Presentation-GERME-Cameroun-EN.pdf",
  },
];

export default function PresentationVideo() {
  const [lecture, setLecture] = useState(false);
  // Si la miniature YouTube ne charge pas, on garde un fond uni propre
  // plutôt qu'une icône d'image cassée.
  const [miniatureOk, setMiniatureOk] = useState(true);

  return (
    <section id="presentation" className="bg-white">
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-germe-green">
            Présentation
          </p>
          <h2 className="mt-2 text-center font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Découvrez GERME Cameroun en vidéo
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-germe-ink/70">
            Le mot de notre Président : notre histoire, notre méthode et nos
            résultats en quelques minutes. Vidéo en anglais, sous-titrée en
            anglais.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-germe-blueDark shadow-lg">
            {lecture ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
                title="Présentation de GERME Cameroun"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setLecture(true)}
                aria-label="Lire la vidéo de présentation de GERME Cameroun"
                className="group absolute inset-0 h-full w-full"
              >
                {miniatureOk && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    onError={() => setMiniatureOk(false)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 bg-germe-blueDark/30 transition group-hover:bg-germe-blueDark/20" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-germe-green shadow-lg transition group-hover:scale-110 md:h-20 md:w-20">
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={150} className="mt-8">
          <p className="text-center text-sm font-medium text-germe-ink">
            Téléchargez notre présentation complète (PDF)
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {DOCUMENTS.map((d) => (
              <a
                key={d.href}
                href={d.href}
                download={d.fichier}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-germe-blue to-germe-green px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
                </svg>
                {d.langue}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
