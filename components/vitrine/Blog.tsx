import Reveal from "@/components/vitrine/Reveal";

const ARTICLES = [
  {
    titre: "5 gestes pour préserver la fertilité de votre sol",
    date: "12 août 2026",
    image: "/images/blog/sol-fertile.jpg",
  },
  {
    titre: "Bien choisir sa période de plantation au Cameroun",
    date: "3 juillet 2026",
    image: "/images/blog/plantation.jpg",
  },
  {
    titre: "Élevage avicole : prévenir plutôt que guérir",
    date: "21 juin 2026",
    image: "/images/blog/elevage-volailles.jpg",
  },
];

export default function Blog() {
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
          {ARTICLES.map((a, i) => (
            <Reveal key={a.titre} delay={i * 100}>
              <article className="overflow-hidden rounded-xl border border-germe-ink/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.titre}
                    className="aspect-video w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-germe-ink/50">{a.date}</p>
                  <h3 className="mt-2 font-display text-base font-semibold text-germe-ink">
                    {a.titre}
                  </h3>
                  <button
                    type="button"
                    className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-germe-green/15 text-germe-green transition hover:bg-germe-green hover:text-white"
                    aria-label="Lire l'article"
                  >
                    →
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
