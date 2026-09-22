"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { reseauApi, ApiError, type MembreReseau } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function initiales(nom: string): string {
  return nom
    .split(" ")
    .map((m) => m[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ReseauPage() {
  const [membres, setMembres] = useState<MembreReseau[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nonEligible, setNonEligible] = useState<string | null>(null);

  useEffect(() => {
    reseauApi
      .lister()
      .then(setMembres)
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 403) {
          setNonEligible(err.message);
        } else {
          setErreur(err instanceof ApiError ? err.message : "Erreur de chargement.");
        }
      })
      .finally(() => setChargement(false));
  }, []);

  if (!chargement && nonEligible) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat/40 text-2xl">
          🔒
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink">
          Pas encore disponible
        </h1>
        <p className="mt-2 text-sm text-germe-ink/60">{nonEligible}</p>
        <Link href="/plateforme" className="mt-6 inline-block text-sm text-germe-blue hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 md:px-6">
      <PageHeader
        icone="🌍"
        titre="Réseau d'entrepreneurs"
        sousTitre="Découvrez d'autres entrepreneurs de la communauté GERME Cameroun."
        action={
          <Link
            href="/plateforme/profil"
            className="rounded-full border border-germe-ink/15 bg-white px-4 py-2 text-xs font-medium text-germe-ink/70 shadow-sm transition hover:border-germe-blue hover:text-germe-blue"
          >
            Gérer ma visibilité
          </Link>
        }
      />

      <p className="mt-4 rounded-xl bg-germe-blueLight/60 px-4 py-2.5 text-xs text-germe-ink/70">
        Vos coordonnées de contact ne sont jamais visibles ici. Pour entrer en
        contact avec un membre, l'équipe pédagogique se charge de la mise en
        relation.
      </p>

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && (
        <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>
      )}

      {!chargement && membres.length === 0 && !erreur && (
        <div className="mt-8">
          <EmptyState
            icone="🌍"
            titre="Personne n'est encore visible dans le réseau"
            message="Soyez le premier — activez votre visibilité via « Gérer ma visibilité »."
          />
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {membres.map((m) => (
          <CarteMembre key={m.id} membre={m} />
        ))}
      </div>
    </main>
  );
}

function CarteMembre({ membre }: { membre: MembreReseau }) {
  const [statut, setStatut] = useState<"inactif" | "envoi" | "envoye" | "erreur">("inactif");

  async function contacter() {
    setStatut("envoi");
    try {
      await reseauApi.contacter(membre.id);
      setStatut("envoye");
    } catch {
      setStatut("erreur");
    }
  }

  return (
    <div className="rounded-2xl border border-germe-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-germe-blue to-germe-green text-sm font-semibold text-white">
          {initiales(membre.fullName)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-germe-ink">{membre.fullName}</p>
          {membre.secteur && (
            <span className="inline-block rounded-full bg-germe-cream px-2.5 py-0.5 text-[11px] font-medium text-germe-ink/60">
              {membre.secteur}
            </span>
          )}
        </div>
      </div>
      {membre.bio && <p className="mt-3 text-xs text-germe-ink/60">{membre.bio}</p>}

      {statut === "envoye" ? (
        <p className="mt-4 text-xs font-medium text-germe-green">
          ✓ Demande transmise à l'équipe pédagogique
        </p>
      ) : (
        <button
          type="button"
          onClick={contacter}
          disabled={statut === "envoi"}
          className="mt-4 rounded-full bg-germe-green/10 px-4 py-1.5 text-xs font-semibold text-germe-green transition hover:bg-germe-green hover:text-white disabled:opacity-50"
        >
          {statut === "envoi" ? "Envoi..." : "Contacter"}
        </button>
      )}
      {statut === "erreur" && (
        <p className="mt-1 text-[11px] text-red-600">Échec de l'envoi, réessayez.</p>
      )}
    </div>
  );
}
