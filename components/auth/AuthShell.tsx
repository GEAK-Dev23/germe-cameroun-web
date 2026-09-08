import Link from "next/link";

/**
 * Coquille commune aux pages de connexion/inscription : même signature
 * visuelle que le site vitrine (dégradé bleu→vert, badge doré, Fraunces),
 * mais recentrée sur le formulaire plutôt que sur une grande illustration.
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
    <main className="grid min-h-screen md:grid-cols-2">
      {/* Panneau de marque, masqué sur mobile pour laisser toute la place au formulaire */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-germe-blueDark via-germe-blue to-germe-green md:flex md:flex-col md:justify-between md:p-10">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-white"
        >
          GERME <span className="text-germe-wheat">Cameroun</span>
        </Link>

        <div>
          <span className="inline-block rounded-full bg-germe-wheat px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-germe-ink shadow">
            Agriculture · Élevage · Formation
          </span>
          <h1 className="mt-5 max-w-sm font-display text-3xl font-semibold leading-[1.15] text-white">
            Cultiver un métier, récolter une entreprise.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/80">
            Rejoignez les apprenants qui transforment leur savoir-faire agricole
            en exploitation rentable.
          </p>
        </div>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} GERME Cameroun
        </p>
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center bg-germe-cream px-6 py-12 md:py-0">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-germe-blue md:hidden"
          >
            GERME <span className="text-germe-green">Cameroun</span>
          </Link>

          <h2 className="mt-6 font-display text-2xl font-semibold text-germe-ink md:mt-0">
            {titre}
          </h2>
          <p className="mt-1 text-sm text-germe-ink/60">{sousTitre}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
