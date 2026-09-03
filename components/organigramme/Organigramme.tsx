"use client";

import { useState } from "react";
import Reveal from "@/components/vitrine/Reveal";

type Poste = { role: string; mission: string };
type Noeud = {
  id: string;
  nom: string;
  responsable: string;
  actif?: boolean;
  equipe?: Poste[];
};

const SOMMET = {
  nom: "Assemblée Générale / Conseil d'Administration",
  sousTitre: "GERME Cameroun",
};
const DIRECTION = {
  nom: "Directeur Général / Coordonnateur Général",
  sousTitre: "GERME Cameroun",
};

const BRANCHES: Noeud[] = [
  {
    id: "secretariat",
    nom: "Secrétariat Général",
    responsable: "Assistant(e) de Direction",
    equipe: [
      {
        role: "Assistant(e) de Direction / Secrétariat Général",
        mission:
          "Appui administratif à la Direction Générale et coordination des instances.",
      },
    ],
  },
  {
    id: "supports",
    nom: "Services Supports Mutualisés",
    responsable: "Directeur Administratif et Financier",
    equipe: [
      {
        role: "Directeur Administratif et Financier (DAF)",
        mission:
          "Supervision financière consolidée et contrôle de gestion des 4 entités.",
      },
      {
        role: "Responsable des Ressources Humaines",
        mission: "Gestion du personnel, recrutement et politique RH commune.",
      },
      {
        role: "Responsable Communication & Partenariats",
        mission:
          "Image institutionnelle, communication externe et veille partenariale.",
      },
      {
        role: "Responsable Logistique & Systèmes d'Information",
        mission: "Moyens généraux, parc informatique et outils numériques.",
      },
    ],
  },
  {
    id: "ong",
    nom: "ONG GERME",
    responsable: "Directeur de l'ONG",
    actif: false,
    equipe: [
      {
        role: "Chef de Programmes & Projets",
        mission:
          "Conception, planification et mise en œuvre des programmes de développement.",
      },
      {
        role: "Chargé(e) de Suivi-Évaluation",
        mission: "Suivi des indicateurs, évaluation d'impact et reporting.",
      },
      {
        role: "Chargé(e) des Relations Bailleurs & Mobilisation de Ressources",
        mission:
          "Recherche de financements et gestion des relations avec les bailleurs.",
      },
    ],
  },
  {
    id: "association",
    nom: "Association GERME",
    responsable: "Secrétaire Général de l'Association",
    equipe: [
      {
        role: "Chargé(e) de la Vie Associative & Adhésions",
        mission: "Gestion des membres, cotisations et registre des adhérents.",
      },
      {
        role: "Chargé(e) des Activités & Animation des Membres",
        mission:
          "Organisation des activités et animation de la vie associative.",
      },
      {
        role: "Chargé(e) du Plaidoyer & Représentation",
        mission:
          "Actions de plaidoyer et représentation auprès des parties prenantes.",
      },
    ],
  },
  {
    id: "sarl",
    nom: "SARL GERME",
    responsable: "Gérant / Directeur Général",
    equipe: [
      {
        role: "Responsable Commercial & Développement",
        mission: "Développement commercial et prospection de nouveaux marchés.",
      },
      {
        role: "Responsable des Opérations & Prestations",
        mission: "Exécution et qualité des prestations livrées aux clients.",
      },
      {
        role: "Chef Comptable SARL (normes OHADA)",
        mission:
          "Comptabilité et fiscalité de la SARL conformément aux normes OHADA.",
      },
    ],
  },
  {
    id: "centre",
    nom: "Centre de Formation Professionnelle",
    responsable: "Directeur du Centre",
    equipe: [
      {
        role: "Responsable Pédagogique",
        mission:
          "Conception des curricula et qualité pédagogique des formations.",
      },
      {
        role: "Responsable des Admissions & Vie des Apprenants",
        mission: "Inscriptions, suivi et accompagnement des apprenants.",
      },
      {
        role: "Coordonnateur du Corps des Formateurs",
        mission: "Recrutement, planning et supervision des formateurs.",
      },
      {
        role: "Responsable Certification & Partenariats Académiques",
        mission:
          "Délivrance des certifications et partenariats avec établissements.",
      },
    ],
  },
];

function classesBranche(actif: boolean) {
  return actif
    ? "group flex w-full flex-col items-center rounded-lg border-2 border-germe-green/40 bg-germe-greenLight px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-germe-green hover:shadow-md"
    : "group flex w-full flex-col items-center rounded-lg border-2 border-dashed border-germe-ink/25 bg-germe-ink/5 px-2 py-3 text-center opacity-80 transition hover:-translate-y-0.5 hover:opacity-100 hover:shadow-md";
}

export default function Organigramme() {
  const [ouvert, setOuvert] = useState<Noeud | null>(null);

  return (
    <div>
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-germe-green">
          Gouvernance
        </p>
        <h3 className="mt-2 text-center font-display text-2xl font-semibold text-germe-ink md:text-3xl">
          Organigramme de GERME Cameroun
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-germe-ink/70">
          Cliquez sur une entité pour découvrir son équipe et ses missions.
        </p>
      </Reveal>

      {/* ---------- Version arbre (desktop) ---------- */}
      <Reveal delay={100} className="mt-14 hidden md:block">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl rounded-lg bg-germe-blueDark px-5 py-3 text-center text-white shadow">
            <p className="text-sm font-semibold">{SOMMET.nom}</p>
            <p className="text-xs text-white/70">{SOMMET.sousTitre}</p>
          </div>
          <div className="h-6 w-px bg-germe-ink/30" />
          <div className="w-full max-w-md rounded-lg bg-germe-blue px-5 py-3 text-center text-white shadow">
            <p className="text-sm font-semibold">{DIRECTION.nom}</p>
            <p className="text-xs text-white/70">{DIRECTION.sousTitre}</p>
          </div>
          <div className="h-6 w-px bg-germe-ink/30" />
        </div>

        <div className="relative">
          <div className="absolute left-[8.333%] right-[8.333%] top-0 h-px bg-germe-ink/30" />
          <div className="grid grid-cols-6 gap-3 pt-0">
            {BRANCHES.map((b) => {
              const actif = b.actif !== false;
              return (
                <div key={b.id} className="flex flex-col items-center">
                  <div className="h-6 w-px bg-germe-ink/30" />
                  <button
                    type="button"
                    onClick={() => setOuvert(b)}
                    className={classesBranche(actif)}
                  >
                    <p className="text-xs font-semibold leading-tight text-germe-ink">
                      {b.nom}
                    </p>
                    <p className="mt-1 text-[10px] text-germe-ink/60">
                      {b.responsable}
                    </p>
                    {!actif && (
                      <span className="mt-2 rounded-full bg-germe-ink/10 px-2 py-0.5 text-[9px] font-medium text-germe-ink/60">
                        Bientôt opérationnelle
                      </span>
                    )}
                    <span className="mt-2 text-[10px] font-medium text-germe-green opacity-0 transition group-hover:opacity-100">
                      Voir l'équipe →
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ---------- Version liste (mobile) ---------- */}
      <Reveal delay={100} className="mt-10 space-y-3 md:hidden">
        <div className="rounded-lg bg-germe-blueDark px-4 py-3 text-white">
          <p className="text-sm font-semibold">{SOMMET.nom}</p>
          <p className="text-xs text-white/70">{SOMMET.sousTitre}</p>
        </div>
        <div className="rounded-lg bg-germe-blue px-4 py-3 text-white">
          <p className="text-sm font-semibold">{DIRECTION.nom}</p>
        </div>
        {BRANCHES.map((b) => {
          const actif = b.actif !== false;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setOuvert(b)}
              className={
                actif
                  ? "flex w-full items-center justify-between rounded-lg border-2 border-germe-green/40 bg-germe-greenLight px-4 py-3 text-left"
                  : "flex w-full items-center justify-between rounded-lg border-2 border-dashed border-germe-ink/25 bg-germe-ink/5 px-4 py-3 text-left"
              }
            >
              <span>
                <span className="block text-sm font-semibold text-germe-ink">
                  {b.nom}
                </span>
                <span className="block text-xs text-germe-ink/60">
                  {b.responsable}
                </span>
                {!actif && (
                  <span className="mt-1 inline-block rounded-full bg-germe-ink/10 px-2 py-0.5 text-[10px] font-medium text-germe-ink/60">
                    Bientôt opérationnelle
                  </span>
                )}
              </span>
              <span
                className={actif ? "text-germe-green" : "text-germe-ink/40"}
              >
                →
              </span>
            </button>
          );
        })}
      </Reveal>

      {/* ---------- Panneau de détails ---------- */}
      {ouvert && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-germe-ink/50 p-0 md:items-center md:p-6"
          onClick={() => setOuvert(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl md:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
                  {ouvert.responsable}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-germe-ink">
                  {ouvert.nom}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOuvert(null)}
                aria-label="Fermer"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-germe-ink/5 text-germe-ink hover:bg-germe-ink/10"
              >
                ✕
              </button>
            </div>

            {ouvert.actif === false && (
              <p className="mt-3 rounded-lg bg-germe-ink/5 px-3 py-2 text-xs text-germe-ink/70">
                Cette entité n'est pas encore opérationnelle. L'équipe présentée
                ci-dessous correspond au schéma organisationnel prévu.
              </p>
            )}

            <ul className="mt-5 space-y-4 border-t border-germe-ink/10 pt-4">
              {(ouvert.equipe ?? []).map((p) => (
                <li key={p.role}>
                  <p className="text-sm font-medium text-germe-ink">{p.role}</p>
                  <p className="mt-0.5 text-xs text-germe-ink/60">
                    {p.mission}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
