"use client";

import { useState } from "react";
import Link from "next/link";
import { paiementsApi, ApiError, type Formation, type AccesFormation } from "@/lib/api";

function formaterDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function CarteInformative({
  icone,
  titre,
  motif,
}: {
  icone: string;
  titre: string;
  motif?: string;
}) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-germe-ink/10 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat/40 text-2xl">
        {icone}
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-germe-ink">
        {titre}
      </h2>
      {motif && <p className="mt-2 text-sm text-germe-ink/60">{motif}</p>}
    </div>
  );
}

export default function MurPaiement({
  formation,
  acces,
}: {
  formation: Formation;
  acces: AccesFormation;
}) {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function rejoindre() {
    setChargement(true);
    setErreur(null);
    try {
      const res = await paiementsApi.inscrireOuPayer(formation.id);
      if (res.paiementUrl) {
        window.location.href = res.paiementUrl;
      } else {
        window.location.reload();
      }
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de finaliser l'inscription pour le moment.",
      );
      setChargement(false);
    }
  }

  // Bloqué par un prérequis pédagogique (formation à terminer d'abord) :
  // il n'y a rien à payer, juste une autre formation à aller finir.
  if (acces.type === "prerequis") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-germe-ink/10 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat/40 text-2xl">
          📘
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-germe-ink">
          Formation prérequise
        </h2>
        <p className="mt-2 text-sm text-germe-ink/60">{acces.motif}</p>

        {acces.formationPrerequiseId && (
          <Link
            href={`/plateforme/formations/${acces.formationPrerequiseId}`}
            className="mt-6 inline-block w-full rounded-full bg-gradient-to-r from-germe-blue to-germe-green px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Voir « {acces.formationPrerequiseTitre ?? "la formation prérequise"} »
          </Link>
        )}
      </div>
    );
  }

  // Formation programmée : fenêtre d'inscription pas encore ouverte.
  if (acces.type === "inscriptions_pas_ouvertes") {
    return (
      <CarteInformative
        icone="🕓"
        titre="Inscriptions pas encore ouvertes"
        motif={acces.motif ?? `Ouverture le ${formaterDate(acces.dateReference)}.`}
      />
    );
  }

  // Formation programmée : fenêtre d'inscription refermée.
  if (acces.type === "inscriptions_fermees") {
    return (
      <CarteInformative
        icone="⛔"
        titre="Inscriptions closes"
        motif={acces.motif}
      />
    );
  }

  // Formation programmée : inscrit ou non, mais la session n'a pas encore démarré.
  if (acces.type === "pas_commencee") {
    return (
      <CarteInformative
        icone="📅"
        titre="La formation n'a pas encore commencé"
        motif={acces.motif ?? `Début le ${formaterDate(acces.dateReference)}.`}
      />
    );
  }

  // Formation programmée : la session est terminée.
  if (acces.type === "formation_terminee") {
    return (
      <CarteInformative
        icone="🏁"
        titre="Cette session est terminée"
        motif={acces.motif}
      />
    );
  }

  // Formation programmée et gratuite : fenêtre d'inscription ouverte,
  // mais l'apprenant n'a pas encore rejoint la session.
  if (acces.type === "inscription_requise") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-germe-ink/10 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-greenLight text-2xl">
          🎟️
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-germe-ink">
          Rejoindre cette session
        </h2>
        <p className="mt-2 text-sm text-germe-ink/60">{acces.motif}</p>

        {erreur && <p className="mt-3 text-sm text-red-600">{erreur}</p>}

        <button
          type="button"
          onClick={rejoindre}
          disabled={chargement}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-germe-blue to-germe-green px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
        >
          {chargement ? "Inscription..." : "Rejoindre la session"}
        </button>
      </div>
    );
  }

  // Par défaut : formation payante (programmée ou non).
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-germe-ink/10 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-blueLight text-2xl">
        🔒
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-germe-ink">
        Formation payante
      </h2>
      <p className="mt-2 text-sm text-germe-ink/60">
        Débloquez l'accès complet à "{formation.titre}" pour{" "}
        <strong>{formation.prixFcfa.toLocaleString("fr-FR")} FCFA</strong>.
      </p>
      <p className="mt-2 text-xs text-germe-ink/45">
        Paiement sécurisé par Orange Money, MTN Mobile Money ou carte bancaire.
      </p>

      {erreur && <p className="mt-3 text-sm text-red-600">{erreur}</p>}

      <button
        type="button"
        onClick={rejoindre}
        disabled={chargement}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-germe-blue to-germe-green px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
      >
        {chargement
          ? "Redirection..."
          : `Payer ${formation.prixFcfa.toLocaleString("fr-FR")} FCFA`}
      </button>
    </div>
  );
}
