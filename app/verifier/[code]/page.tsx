"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { certificatsApi } from "@/lib/api";

type Resultat =
  | {
      valide: true;
      apprenantNom: string;
      formationTitre: string;
      delivreLe: string;
    }
  | { valide: false }
  | null;

export default function VerifierCertificatPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [resultat, setResultat] = useState<Resultat>(null);

  useEffect(() => {
    certificatsApi
      .verifier(code)
      .then(setResultat)
      .catch(() => setResultat({ valide: false }));
  }, [code]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-germe-cream px-6">
      <div className="w-full max-w-md rounded-2xl border border-germe-ink/10 bg-white p-8 text-center shadow-sm">
        <Link
          href="/"
          className="font-display text-lg font-semibold text-germe-blue"
        >
          GERME <span className="text-germe-green">Cameroun</span>
        </Link>

        {resultat === null && (
          <p className="mt-8 text-sm text-germe-ink/50">Vérification...</p>
        )}

        {resultat?.valide === true && (
          <>
            <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-germe-green/15 text-2xl">
              ✓
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink">
              Certificat authentique
            </h1>
            <p className="mt-4 text-sm text-germe-ink/70">
              <strong>{resultat.apprenantNom}</strong> a suivi et réussi la
              formation
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-germe-blue">
              {resultat.formationTitre}
            </p>
            <p className="mt-3 text-xs text-germe-ink/50">
              Délivré le{" "}
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                new Date(resultat.delivreLe),
              )}
            </p>
          </>
        )}

        {resultat?.valide === false && (
          <>
            <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              ✕
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink">
              Code de vérification invalide
            </h1>
            <p className="mt-2 text-sm text-germe-ink/60">
              Ce code ne correspond à aucun certificat délivré par GERME
              Cameroun.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
