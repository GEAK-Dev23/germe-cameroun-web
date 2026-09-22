"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  certificatsApi,
  formationsApi,
  ApiError,
  type Certificat,
  type Formation,
} from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function MesCertificatsPage() {
  const [certificats, setCertificats] = useState<Certificat[]>([]);
  const [formations, setFormations] = useState<Record<string, Formation>>({});
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    certificatsApi
      .mesCertificats()
      .then(async (certs) => {
        setCertificats(certs);
        const entries = await Promise.all(
          certs.map(
            async (c) =>
              [
                c.formationId,
                await formationsApi.obtenirUne(c.formationId),
              ] as const,
          ),
        );
        setFormations(Object.fromEntries(entries));
      })
      .catch((err) =>
        setErreur(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger vos certificats.",
        ),
      )
      .finally(() => setChargement(false));
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 md:px-6">
      <PageHeader
        icone="🎓"
        titre="Mes certificats"
        sousTitre="Téléchargez vos certificats de réussite, vérifiables publiquement via leur QR code."
      />

      {chargement && (
        <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>
      )}
      {erreur && <p className="mt-8 text-sm text-red-600">{erreur}</p>}

      {!chargement && certificats.length === 0 && !erreur && (
        <div className="mt-10">
          <EmptyState
            icone="🎓"
            titre="Aucun certificat pour le moment"
            message="Réussissez l'examen final d'une formation pour obtenir votre première attestation."
          />
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {certificats.map((c) => (
          <div
            key={c.id}
            className="overflow-hidden rounded-2xl border border-germe-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="h-1.5 bg-gradient-to-r from-germe-blue to-germe-green" />
            <div className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-germe-wheat/30 text-lg">
                🏆
              </span>
              <h2 className="mt-3 font-display text-lg font-semibold text-germe-ink">
                {formations[c.formationId]?.titre ?? "Formation"}
              </h2>
              <p className="mt-1 text-xs text-germe-ink/50">
                Délivré le{" "}
                {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                  new Date(c.delivreLe),
                )}
              </p>
              <p className="mt-1 text-xs text-germe-ink/40">
                Code : {c.codeVerification}
              </p>
              <a
                href={certificatsApi.urlTelechargement(c.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
              >
                Télécharger le PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/plateforme"
        className="mt-8 inline-block text-sm text-germe-ink/60 hover:text-germe-ink"
      >
        ← Retour au catalogue
      </Link>
    </main>
  );
}
