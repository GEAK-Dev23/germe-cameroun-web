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

      <div className="mx-auto flex min-h-[560px] max-w-6xl flex-col justify-center px-5 py-24 md:px-6">
        <span className="animate-fade-up inline-block w-fit rounded-full bg-germe-wheat px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-germe-ink shadow">
          Agriculture · Élevage · Formation
        </span>
        <h1
          className="mt-4 max-w-2xl animate-fade-up font-display text-3xl font-semibold leading-[1.1] text-white sm:text-4xl md:text-6xl"
          style={{ animationDelay: "120ms" }}
        >
          Cultiver un métier, récolter une entreprise
        </h1>
        <p
          className="mt-5 max-w-xl animate-fade-up text-sm text-white/85 md:text-base"
          style={{ animationDelay: "240ms" }}
        >
          GERME Cameroun forme les agriculteurs et éleveurs de demain grâce à
          des parcours pratiques, certifiants, et un accompagnement jusqu'au
          plan d'affaires.
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
    </section>
  );
}
