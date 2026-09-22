"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  authApi,
  certificatsApi,
  formationsApi,
  progressionApi,
  ApiError,
  type Certificat,
  type Formation,
} from "@/lib/api";

export default function AttestationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [eligible, setEligible] = useState(false);
  const [certificat, setCertificat] = useState<Certificat | null>(null);
  const [nomComplet, setNomComplet] = useState("");
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      formationsApi.obtenirUne(id),
      progressionApi.obtenirEtat(id),
      certificatsApi.mesCertificats(),
      authApi.me().catch(() => null),
    ])
      .then(([f, etat, certs, moi]) => {
        setFormation(f);
        setEligible(etat.attestationDebloquee);
        const existant = certs.find((c) => c.formationId === id);
        if (existant) setCertificat(existant);
        else if (moi) setNomComplet(moi.utilisateur.fullName);
      })
      .catch((err) =>
        setErreur(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger cette page.",
        ),
      )
      .finally(() => setChargement(false));
  }, [id]);

  async function genererCertificat(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    if (nomComplet.trim().length < 2) {
      setErreur("Merci de renseigner votre nom complet.");
      return;
    }
    setEnvoi(true);
    try {
      const cert = await certificatsApi.creer(id, nomComplet.trim());
      setCertificat(cert);
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de générer l'attestation.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center text-germe-ink/50">
        Chargement...
      </div>
    );
  }

  if (erreur && !certificat) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-sm text-red-600">{erreur}</p>
        <Link
          href={`/plateforme/formations/${id}`}
          className="mt-4 inline-block text-sm text-germe-blue hover:underline"
        >
          ← Retour à la formation
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-14 sm:px-5 sm:py-16 md:px-6">
      <Link
        href={`/plateforme/formations/${id}`}
        className="text-sm text-germe-ink/60 hover:text-germe-ink"
      >
        ← Retour à la formation
      </Link>

      {certificat ? (
        <div className="mt-6 rounded-2xl border border-germe-green/30 bg-germe-greenLight p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-germe-green/20 text-3xl">
            🎓
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink sm:text-2xl">
            Votre attestation est prête !
          </h1>
          <p className="mt-2 text-sm text-germe-ink/70">
            Délivrée au nom de <strong>{certificat.nomComplet}</strong> pour la
            formation <strong>{formation?.titre}</strong>.
          </p>
          <p className="mt-1 text-xs text-germe-ink/50">
            Code de vérification : {certificat.codeVerification}
          </p>
          <a
            href={certificatsApi.urlTelechargement(certificat.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-germe-green px-7 py-3 text-sm font-semibold text-white transition hover:bg-germe-greenDark"
          >
            Télécharger le PDF
          </a>
          <p className="mt-4 text-xs text-germe-ink/50">
            <Link
              href={`/verifier/${certificat.codeVerification}`}
              className="text-germe-blue hover:underline"
            >
              Voir la page de vérification publique
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-germe-wheat bg-white p-5 text-left">
            <p className="text-sm font-semibold text-germe-ink">
              🧮 Et maintenant ? Testez la rentabilité de votre projet
            </p>
            <p className="mt-1 text-xs text-germe-ink/60">
              Utilisez nos simulateurs financiers pour estimer le seuil de
              rentabilité et le retour sur investissement de votre activité.
            </p>
            <Link
              href="/plateforme/outils/simulateur-rentabilite"
              className="mt-3 inline-block rounded-full bg-germe-blue px-5 py-2 text-xs font-semibold text-white transition hover:bg-germe-blueDark"
            >
              Ouvrir les simulateurs financiers
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-germe-green/30 bg-germe-greenLight p-5 text-left">
            <p className="text-sm font-semibold text-germe-ink">
              📊 Générez votre plan d'affaire complet
            </p>
            <p className="mt-1 text-xs text-germe-ink/60">
              Un document professionnel, prêt à présenter à un partenaire ou une
              banque — texte rédigé et tableaux financiers calculés automatiquement.
            </p>
            <Link
              href={`/plateforme/formations/${id}/plan-affaire`}
              className="mt-3 inline-block rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white transition hover:bg-germe-greenDark"
            >
              Créer mon plan d'affaire
            </Link>
          </div>
        </div>
      ) : eligible ? (
        <div className="mt-6 rounded-2xl border border-germe-ink/10 bg-white p-8 shadow-sm">
          <h1 className="font-display text-xl font-semibold text-germe-ink sm:text-2xl">
            Générer votre attestation
          </h1>
          <p className="mt-2 text-sm text-germe-ink/60">
            Félicitations, vous avez validé <strong>{formation?.titre}</strong>{" "}
            ! Indiquez le nom complet à faire apparaître sur votre
            attestation — il ne pourra plus être modifié ensuite.
          </p>

          <form onSubmit={genererCertificat} className="mt-6 space-y-3">
            <div>
              <label
                htmlFor="nom-complet"
                className="text-sm text-germe-ink/70"
              >
                Nom complet
              </label>
              <input
                id="nom-complet"
                required
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                placeholder="Ex : Jean-Baptiste Mballa"
                className="mt-1 w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
              />
            </div>

            {erreur && <p className="text-sm text-red-600">{erreur}</p>}

            <button
              type="submit"
              disabled={envoi}
              className="w-full rounded-full bg-germe-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-60"
            >
              {envoi ? "Génération..." : "Générer mon attestation"}
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-germe-ink/10 bg-white p-8 text-center">
          <p className="text-sm text-germe-ink/70">
            Votre attestation n'est pas encore débloquée : validez d'abord
            tous les QCM de chapitre et tests de module de cette formation.
          </p>
          <Link
            href={`/plateforme/formations/${id}`}
            className="mt-4 inline-block text-sm font-medium text-germe-blue hover:underline"
          >
            Reprendre la formation
          </Link>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-germe-ink/40">
        Une question sur votre attestation ?{" "}
        <a href="mailto:info.germecam@gmail.com" className="text-germe-blue hover:underline">
          info.germecam@gmail.com
        </a>{" "}
        ·{" "}
        <a href="tel:+237690308378" className="text-germe-blue hover:underline">
          +237 690 308 378
        </a>
      </p>
    </main>
  );
}
