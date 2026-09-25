import Link from "next/link";
import Image from "next/image";

/**
 * Coquille commune aux pages de connexion/inscription. Le panneau de
 * marque (logo + ondes animées) reste visible à toutes les tailles
 * d'écran : empilé au-dessus du formulaire sur mobile, côte à côte à
 * partir de md. Les deux panneaux ont un traitement "verre" distinct :
 * dépoli sombre à gauche, dépoli lumineux (couleurs de la charte) à
 * droite.
 */
export default function AuthShell({
  titre,
  sousTitre,
  children,
}: {
  titre: string;
  sousTitre: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen md:grid md:min-h-screen md:grid-cols-2">
      {/* Panneau de marque — toujours visible, même sur petit écran */}
      <div className="relative flex flex-col overflow-hidden bg-gradient-to-br from-germe-blueDark via-germe-blue to-germe-green px-6 py-10 sm:py-12 md:min-h-screen md:justify-between md:px-10 md:py-14">
        {/* Halos décoratifs en fond */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-germe-wheat/10 blur-3xl"
        />
        {/* Texture en pointillés, inchangée */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* "Agriculture · Élevage · Formation" — centré horizontalement, en haut */}
        <div className="relative flex justify-center">
          <span className="inline-block rounded-full bg-germe-wheat px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-germe-ink shadow sm:text-xs">
            Entrepreneuriat · Consulting · Développement local
          </span>
        </div>

        {/* Logo (bien plus grand) + textes — plus aucun cadre autour,
            simplement centrés, avec le texte repoussé plus bas */}
        <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center md:flex-none md:py-10">
          <Link
            href="/"
            aria-label="GERME Cameroun — accueil"
            className="relative flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72"
          >
            <span className="absolute inset-0 rounded-full border-2 border-white/50 [animation-delay:0s] animate-ripple" />
            <span className="absolute inset-0 rounded-full border-2 border-white/50 [animation-delay:1s] animate-ripple" />
            <span className="absolute inset-0 rounded-full border-2 border-white/50 [animation-delay:2s] animate-ripple" />
            <span className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full bg-white p-2.5 shadow-xl sm:h-52 sm:w-52">
              <Image
                src="/images/logo/logo-germe.jpeg"
                alt="GERME Cameroun"
                width={208}
                height={208}
                className="h-full w-full rounded-full object-contain"
                priority
              />
            </span>
          </Link>

          <h1 className="mt-12 max-w-xs font-display text-2xl font-semibold leading-[1.2] text-white sm:max-w-sm sm:text-3xl">
            Trouver la meilleure idée, développer une entreprise viable et
            durable.
          </h1>
          <p className="mt-3 max-w-xs text-sm text-white/80 sm:max-w-sm">
            GERME CAMEROUN, ensemble faisons germer les talents du secteur
            agrosylvopastoral et halieutique pour un avenir durable.
          </p>
        </div>

        <p className="relative text-center text-xs text-white/50 md:text-left">
          © {new Date().getFullYear()} GERME Cameroun
        </p>
      </div>

      {/* Formulaire — fond effet verre lumineux aux couleurs de la charte */}
      <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-germe-blueLight via-germe-cream to-germe-greenLight px-6 py-10 sm:py-12 md:py-0">
        {/* Lumières colorées (couleurs de la charte), bien visibles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-6%] top-[8%] h-72 w-72 rounded-full bg-germe-blue/45 blur-[70px] sm:h-96 sm:w-96"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6%] right-[-8%] h-80 w-80 rounded-full bg-germe-green/45 blur-[70px] sm:h-[26rem] sm:w-[26rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-[28%] h-52 w-52 rounded-full bg-germe-wheat/50 blur-[60px]"
        />
        {/* Fine couche de verre dépoli qui unifie l'ensemble sans effacer les couleurs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-white/20 backdrop-blur-xl"
        />

        <div className="relative w-full max-w-sm rounded-[2rem] border border-white/60 bg-white/55 p-8 shadow-xl backdrop-blur-md sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-germe-ink">
            {titre}
          </h2>
          <p className="mt-1 text-sm text-germe-ink/60">{sousTitre}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
