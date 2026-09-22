"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { statistiquesApi, type Statistiques } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

function StatCarte({
  icone,
  valeur,
  label,
  accent = false,
}: {
  icone: string;
  valeur: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-germe-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-base ${
          accent ? "bg-germe-green/15" : "bg-germe-blueLight"
        }`}
      >
        {icone}
      </span>
      <p className={`mt-3 text-2xl font-bold ${accent ? "text-germe-green" : "text-germe-ink"}`}>
        {valeur}
      </p>
      <p className="mt-0.5 text-xs text-germe-ink/50">{label}</p>
    </div>
  );
}

function RaccourciCarte({
  href,
  icone,
  titre,
  description,
}: {
  href: string;
  icone: string;
  titre: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-germe-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-germe-blue/30 hover:shadow-lg"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-germe-blue to-germe-green text-lg text-white shadow-sm transition group-hover:scale-105">
        {icone}
      </span>
      <h2 className="mt-4 font-display text-base font-semibold text-germe-ink">{titre}</h2>
      <p className="mt-1 text-sm text-germe-ink/60">{description}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Statistiques | null>(null);

  useEffect(() => {
    statistiquesApi
      .obtenir()
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-6">
      <PageHeader
        icone="🏠"
        titre="Tableau de bord"
        sousTitre="Vue d'ensemble de la plateforme GERME Cameroun."
      />

      {!stats ? (
        <p className="mt-8 text-sm text-germe-ink/50">Chargement...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCarte icone="🎓" valeur={stats.totalFormations} label="Formations au total" />
          <StatCarte icone="✅" valeur={stats.formationsPubliees} label="Formations publiées" accent />
          <StatCarte icone="👤" valeur={stats.totalApprenants} label="Apprenants inscrits" />
          <StatCarte icone="🧑‍🏫" valeur={stats.totalFormateurs} label="Formateurs" />
          <StatCarte icone="🏆" valeur={stats.totalCertificats} label="Attestations délivrées" accent />
          <StatCarte icone="💳" valeur={stats.nombrePaiementsValides} label="Paiements validés" />
          <StatCarte
            icone="💰"
            valeur={`${stats.revenuTotalFcfa.toLocaleString("fr-FR")} FCFA`}
            label="Revenu total"
            accent
          />
          <StatCarte icone="💬" valeur={stats.totalSujetsForum} label="Sujets sur le forum" />
        </div>
      )}

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-germe-ink/40">
        Accès rapide
      </h2>
      <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <RaccourciCarte
          href="/admin/formations"
          icone="🎓"
          titre="Gérer les formations"
          description="Créer, publier et construire le contenu pédagogique."
        />
        <RaccourciCarte
          href="/admin/apprenants"
          icone="👤"
          titre="Suivi des apprenants"
          description="Consulter la progression individuelle de chacun."
        />
        <RaccourciCarte
          href="/admin/utilisateurs"
          icone="⚙️"
          titre="Gérer les utilisateurs"
          description="Voir les comptes et attribuer les rôles."
        />
        <RaccourciCarte
          href="/admin/webinaires"
          icone="📹"
          titre="Webinaires"
          description="Programmer une classe virtuelle en direct."
        />
        <RaccourciCarte
          href="/admin/articles"
          icone="📰"
          titre="Blog & actualités"
          description="Publier des articles sur le site vitrine."
        />
        <RaccourciCarte
          href="/admin/corrections"
          icone="✍️"
          titre="Corrections en attente"
          description="Corriger les exercices à réponse libre."
        />
      </div>
    </main>
  );
}
