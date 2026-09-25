import Reveal from "@/components/vitrine/Reveal";

type Item = { titre: string };

const CONSEIL_ADMINISTRATION: Item[] = [
  { titre: "Président du Conseil d'Administration" },
  { titre: "Secrétaire Général" },
  { titre: "Secrétaire Général Adjoint" },
  { titre: "Trésorière" },
  { titre: "Commissaire aux Comptes" },
];

const SERVICES: Item[] = [
  { titre: "Service Administratif, Financier et Audit" },
  { titre: "Service Ressources Humaines" },
  { titre: "Service Juridique et Contentieux" },
  { titre: "Service Logistique et Achats" },
  { titre: "Service Communication et Relations Publiques" },
  { titre: "Secrétariat et Archives" },
];

const DEPARTEMENTS: Item[] = [
  { titre: "Département Formation et Renforcement de Capacités" },
  { titre: "Département Entrepreneuriat et Accompagnement/Coaching d'Entreprises" },
  { titre: "Département Planification et Projets" },
  { titre: "Département Suivi-Évaluation, Redevabilité et Contrôle Qualité" },
  { titre: "Département Environnement, Climat et Genre" },
  { titre: "Département Partenariats et Mobilisation" },
];

function Puce({ numero, titre }: { numero: number; titre: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white px-4 py-3 text-left shadow-sm">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-germe-blue text-xs font-semibold text-white">
        {numero}
      </span>
      <p className="text-sm text-germe-ink">{titre}</p>
    </div>
  );
}

export default function Organigramme() {
  return (
    <div>
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-germe-green">
          Gouvernance
        </p>
        <h3 className="mt-2 text-center font-display text-2xl font-semibold text-germe-ink md:text-3xl">
          Organigramme de GERME Cameroun
        </h3>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        {/* Sommet hiérarchique */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-sm rounded-lg bg-germe-blueDark px-5 py-3 text-center text-white shadow">
            <p className="text-sm font-semibold">ASSEMBLÉE GÉNÉRALE</p>
          </div>
          <div className="h-6 w-px bg-germe-ink/30" />
          <div className="w-full max-w-sm rounded-lg bg-germe-green px-5 py-3 text-center text-white shadow">
            <p className="text-sm font-semibold">CONSEIL D'ADMINISTRATION</p>
          </div>
          {/* Postes clés du Conseil d'Administration */}
          <div className="mt-2 grid w-full max-w-sm grid-cols-1 gap-2 rounded-xl bg-germe-greenLight/60 p-3 sm:grid-cols-2">
            {CONSEIL_ADMINISTRATION.map((c, i) => (
              <Puce key={c.titre} numero={i + 1} titre={c.titre} />
            ))}
          </div>
          <div className="h-6 w-px bg-germe-ink/30" />
          <div className="w-full max-w-sm rounded-lg bg-germe-blue px-5 py-3 text-center text-white shadow">
            <p className="text-sm font-semibold">DIRECTION EXÉCUTIVE</p>
          </div>
          <div className="h-6 w-px bg-germe-ink/30" />
        </div>

        {/* Deux branches : Secrétariat Général / Direction Technique */}
        <div className="relative">
          <div className="absolute left-1/4 right-1/4 top-0 h-px bg-germe-ink/30" />
          <div className="grid gap-8 pt-0 md:grid-cols-2 md:gap-10">
            {/* Secrétariat Général */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-germe-ink/30" />
              <div className="w-full rounded-lg bg-germe-green px-5 py-3 text-center text-white shadow">
                <p className="text-sm font-semibold">SECRÉTARIAT GÉNÉRAL</p>
              </div>
              <div className="mt-4 w-full space-y-2 rounded-xl bg-germe-greenLight/60 p-3">
                {SERVICES.map((s, i) => (
                  <Puce key={s.titre} numero={i + 1} titre={s.titre} />
                ))}
              </div>
            </div>

            {/* Direction Technique */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-germe-ink/30" />
              <div className="w-full rounded-lg bg-germe-blueDark px-5 py-3 text-center text-white shadow">
                <p className="text-sm font-semibold">DIRECTION TECHNIQUE</p>
              </div>
              <div className="mt-4 w-full space-y-2 rounded-xl bg-germe-blueLight/60 p-3">
                {DEPARTEMENTS.map((d, i) => (
                  <Puce key={d.titre} numero={i + 1} titre={d.titre} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <p className="mt-10 text-center text-xs text-germe-ink/50">
        GERME Cameroun — Organigramme — Version mise à jour 2024
      </p>
    </div>
  );
}
