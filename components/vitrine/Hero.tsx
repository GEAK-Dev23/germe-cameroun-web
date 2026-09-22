import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="accueil" className="relative isolate overflow-hidden">
      {/* Photo plein cadre avec léger zoom continu */}
      <div
        className="absolute inset-0 -z-10 animate-hero-zoom bg-germe-green bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero/champ-agricole.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-germe-blueDark/85 via-germe-blue/50 to-germe-green/45" />

      <div className="flex min-h-[560px]">
        {/* Colonne logo, ancrée au bord gauche réel de la section */}
        <div className="relative flex w-1/5 shrink-0 items-center justify-center bg-white p-4 sm:p-6">
          <Image
            src="/images/logo/logo-germe.jpeg"
            alt="GERME Cameroun"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-1 justify-center">
          <div className="flex w-full max-w-6xl flex-col justify-center px-5 py-24 md:px-6">
            <span className="animate-fade-up inline-block w-fit rounded-full bg-germe-wheat px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-germe-ink shadow">
              Agriculture · Élevage · Formation
            </span>
            <h1
              className="mt-4 max-w-2xl animate-fade-up font-display text-3xl font-semibold leading-[1.1] text-white sm:text-4xl md:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              Trouver la meilleure idée, développer une entreprise viable et
              durable
            </h1>
            <p
              className="mt-5 max-w-xl animate-fade-up text-sm text-white/85 md:text-base"
              style={{ animationDelay: "240ms" }}
            >
              GERME CAMEROUN, ensemble faisons germer les talents du secteur
              agrosylvopastoral et halieutique pour un avenir durable.
            </p>
            <div
              className="mt-8 flex animate-fade-up flex-wrap gap-4"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href="#apropos"
                className="inline-flex items-center gap-2 rounded-full bg-germe-green px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-lg"
              >
                Découvrir GERME
                <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/plateforme"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-germe-blue hover:shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px]"
                >
                  ▶
                </span>
                Se former
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
