"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  suiviApi,
  planAffaireApi,
  ApiError,
  type ApprenantSuivi,
  type UtilisateurAdmin,
  type PlanAffaireResume,
} from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

export default function AdminApprenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [apprenant, setApprenant] = useState<UtilisateurAdmin | null>(null);
  const [suivi, setSuivi] = useState<ApprenantSuivi[]>([]);
  const [plansAffaire, setPlansAffaire] = useState<PlanAffaireResume[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [telechargementEnCours, setTelechargementEnCours] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([suiviApi.apprenants(), suiviApi.suivi(id), planAffaireApi.listerPourApprenant(id)])
      .then(([liste, s, plans]) => {
        setApprenant(liste.find((a) => a.id === id) ?? null);
        setSuivi(s);
        setPlansAffaire(plans);
      })
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }, [id]);

  async function telecharger(formationId: string, titreProjet: string) {
    setTelechargementEnCours(formationId);
    try {
      await planAffaireApi.telechargerDocumentAdmin(
        id,
        formationId,
        `Plan-affaire-${titreProjet || "projet"}.docx`,
      );
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Impossible de générer le document.");
    } finally {
      setTelechargementEnCours(null);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center text-germe-ink/50">
        Chargement...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <Link href="/admin/apprenants" className="text-sm text-germe-ink/60 hover:text-germe-ink">
        ← Retour aux apprenants
      </Link>

      <div className="mt-3">
        <PageHeader
          icone="👤"
          titre={apprenant?.fullName ?? "Apprenant"}
          sousTitre={apprenant?.email}
          action={
            <Link
              href={`/plateforme/messages/${id}`}
              className="rounded-full bg-germe-green px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-germe-greenDark"
            >
              💬 Contacter
            </Link>
          }
        />
      </div>

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}

      {!erreur && suivi.length === 0 && (
        <p className="mt-8 rounded-2xl border border-germe-ink/10 bg-white p-8 text-center text-sm text-germe-ink/50">
          Cet apprenant n'a encore d'activité sur aucune formation.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {suivi.map((s) => {
          const totalChapitres = s.etat.modules.reduce(
            (acc, m) => acc + m.chapitres.length,
            0,
          );
          const chapitresReussis = s.etat.modules.reduce(
            (acc, m) => acc + m.chapitres.filter((c) => c.testReussi).length,
            0,
          );
          const modulesReussis = s.etat.modules.filter((m) => m.testModuleReussi).length;

          return (
            <div key={s.formationId} className="rounded-2xl border border-germe-ink/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display font-semibold text-germe-ink">
                  {s.formationTitre}
                </p>
                {s.etat.attestationDebloquee && (
                  <span className="rounded-full bg-germe-green/15 px-3 py-1 text-xs font-medium text-germe-green">
                    🎓 Attestation obtenue
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-germe-cream p-3">
                  <p className="text-lg font-bold text-germe-ink">
                    {chapitresReussis}/{totalChapitres}
                  </p>
                  <p className="text-[11px] text-germe-ink/50">Chapitres validés</p>
                </div>
                <div className="rounded-lg bg-germe-cream p-3">
                  <p className="text-lg font-bold text-germe-ink">
                    {modulesReussis}/{s.etat.modules.length}
                  </p>
                  <p className="text-[11px] text-germe-ink/50">Modules validés</p>
                </div>
                <div className="rounded-lg bg-germe-cream p-3">
                  <p className="text-lg font-bold text-germe-ink">
                    {s.etat.examenFinal.reussi ? "✓" : s.etat.examenFinal.debloque ? "…" : "🔒"}
                  </p>
                  <p className="text-[11px] text-germe-ink/50">Examen final</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {plansAffaire.length > 0 && (
        <>
          <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-germe-ink/40">
            📊 Plans d'affaire
          </h2>
          <div className="mt-3 space-y-2">
            {plansAffaire.map((p) => (
              <div
                key={p.formationId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-germe-green/20 bg-germe-greenLight/40 p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-germe-ink">
                    {p.titreProjet || "Projet sans titre"}
                  </p>
                  <p className="mt-0.5 text-xs text-germe-ink/50">
                    Mis à jour le{" "}
                    {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                      new Date(p.updatedAt),
                    )}
                    {!p.aDesDonneesFinancieres && " · Données financières incomplètes"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!p.aDesDonneesFinancieres || telechargementEnCours === p.formationId}
                  onClick={() => telecharger(p.formationId, p.titreProjet)}
                  className="shrink-0 rounded-full bg-germe-green px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-germe-greenDark disabled:opacity-50"
                >
                  {telechargementEnCours === p.formationId ? "Génération..." : "Télécharger"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
