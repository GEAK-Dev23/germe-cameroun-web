const RESEAUX = [
  {
    nom: "Facebook",
    href: "https://facebook.com/germecameroun",
    path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z",
  },
  {
    nom: "Instagram",
    href: "https://instagram.com/germecameroun",
    path: "M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.5 1.4.5 2.5.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.5-.3.7-.6 1.2-1.2 1.8-.6.6-1.1.9-1.8 1.2-.7.3-1.4.5-2.5.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5-.7-.3-1.2-.6-1.8-1.2-.6-.6-.9-1.1-1.2-1.8-.3-.7-.5-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.5.3-.7.6-1.2 1.2-1.8.6-.6 1.1-.9 1.8-1.2.7-.3 1.4-.5 2.5-.5C8.9 2 9.3 2 12 2Zm0 1.8c-2.6 0-3 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.4-.1 4s0 3 .1 4c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.7.3 1 .1 1.4.1 4 .1s3 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.7.1-1 .1-1.4.1-4s0-3-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.7-.3-1-.1-1.4-.1-4-.1Zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm4.9-2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z",
  },
  {
    nom: "YouTube",
    href: "https://youtube.com/@germecameroun",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12l-6.2 3.5Z",
  },
  {
    nom: "LinkedIn",
    href: "https://linkedin.com/company/germecameroun",
    path: "M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM7 20.4H3.6V9H7v11.4Z",
  },
];

export default function Footer() {
  return (
    <footer id="contact-footer" className="bg-germe-blue text-white">
      <div className="h-1 w-full bg-gradient-to-r from-germe-blue to-germe-green" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-lg font-semibold">GERME Cameroun</p>
          <p className="mt-3 max-w-xs text-sm text-white/75">
            ONG, Association, SARL et Centre de Formation Professionnelle au
            service de l'agriculture et de l'élevage au Cameroun.
          </p>
          <div className="mt-5 flex gap-3">
            {RESEAUX.map((r) => (
              <a
                key={r.nom}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={r.nom}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-germe-green"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d={r.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-germe-wheat">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>contact@germecameroun.org</li>
            <li>Yaoundé, Cameroun</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-germe-wheat">
            Plateforme de formation
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>
              <a href="/signup" className="hover:text-white">
                Créer un compte
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-white">
                Se connecter
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} GERME Cameroun. Tous droits réservés.
      </div>
    </footer>
  );
}
