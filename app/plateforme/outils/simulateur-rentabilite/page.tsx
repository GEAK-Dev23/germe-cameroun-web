"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { progressionApi } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

function formaterFcfa(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
}

export default function SimulateurRentabilitePage() {
  const [onglet, setOnglet] = useState<"seuil" | "investissement">("seuil");
  const [chargement, setChargement] = useState(true);
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    progressionApi
      .eligibiliteFonctionnalites()
      .then(({ eligible }) => setEligible(eligible))
      .catch(() => setEligible(false))
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-germe-ink/50">Chargement...</div>;
  }

  if (!eligible) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat/40 text-2xl">
          🔒
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink">
          Pas encore disponible
        </h1>
        <p className="mt-2 text-sm text-germe-ink/60">
          Le simulateur devient accessible dès que vous avez commencé au moins une formation.
        </p>
        <Link href="/plateforme" className="mt-6 inline-block text-sm text-germe-blue hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <Link href="/plateforme" className="text-sm text-germe-ink/60 hover:text-germe-ink">
        ← Retour à la plateforme
      </Link>
      <div className="mt-3">
        <PageHeader
          icone="🧮"
          titre="Simulateur rapide"
          sousTitre="Un calcul immédiat pour estimer la viabilité financière de votre idée."
        />
      </div>
      <p className="mt-4 rounded-xl bg-germe-blueLight/60 px-4 py-2.5 text-xs text-germe-ink/70">
        Besoin d'un document complet à présenter à un partenaire ? Terminez une
        formation pour générer votre{" "}
        <span className="font-medium text-germe-blue">plan d'affaire détaillé</span>{" "}
        depuis sa page d'attestation.
      </p>


      <div className="mt-6 flex gap-1 rounded-lg bg-germe-cream p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setOnglet("seuil")}
          className={`flex-1 rounded-md py-2 transition ${
            onglet === "seuil" ? "bg-white text-germe-green shadow-sm" : "text-germe-ink/50"
          }`}
        >
          Seuil de rentabilité
        </button>
        <button
          type="button"
          onClick={() => setOnglet("investissement")}
          className={`flex-1 rounded-md py-2 transition ${
            onglet === "investissement"
              ? "bg-white text-germe-green shadow-sm"
              : "text-germe-ink/50"
          }`}
        >
          Retour sur investissement
        </button>
      </div>

      {onglet === "seuil" ? <SimulateurSeuil /> : <SimulateurInvestissement />}
    </main>
  );
}

function ChampNombre({
  label,
  suffixe,
  value,
  onChange,
}: {
  label: string;
  suffixe: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-sm text-germe-ink/70">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-germe-ink/20 px-4 py-2.5 focus:border-germe-blue focus:outline-none"
        />
        <span className="shrink-0 text-xs text-germe-ink/40">{suffixe}</span>
      </div>
    </div>
  );
}

function SimulateurSeuil() {
  const [chargesFixes, setChargesFixes] = useState(0);
  const [prixVente, setPrixVente] = useState(0);
  const [coutVariable, setCoutVariable] = useState(0);
  const [caActuel, setCaActuel] = useState(0);

  const margeUnitaire = prixVente - coutVariable;
  const tauxMarge = prixVente > 0 ? margeUnitaire / prixVente : 0;
  const seuilCa = tauxMarge > 0 ? chargesFixes / tauxMarge : NaN;
  const seuilUnites = margeUnitaire > 0 ? chargesFixes / margeUnitaire : NaN;
  const progression = seuilCa > 0 ? Math.min(100, (caActuel / seuilCa) * 100) : 0;

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-germe-ink/10 bg-white p-6">
        <p className="text-sm font-semibold text-germe-ink">Vos chiffres</p>
        <ChampNombre
          label="Charges fixes mensuelles"
          suffixe="FCFA / mois ou cycle"
          value={chargesFixes}
          onChange={setChargesFixes}
        />
        <ChampNombre
          label="Prix de vente unitaire"
          suffixe="FCFA / unité"
          value={prixVente}
          onChange={setPrixVente}
        />
        <ChampNombre
          label="Coût variable unitaire"
          suffixe="FCFA / unité"
          value={coutVariable}
          onChange={setCoutVariable}
        />
        <ChampNombre
          label="Chiffre d'affaires actuel (facultatif)"
          suffixe="FCFA / mois ou cycle"
          value={caActuel}
          onChange={setCaActuel}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-germe-green/20 bg-germe-greenLight p-6">
        <p className="text-sm font-semibold text-germe-ink">Résultats</p>

        {margeUnitaire <= 0 && prixVente > 0 ? (
          <p className="text-sm text-red-600">
            Votre prix de vente ne couvre pas votre coût variable — aucune
            rentabilité possible avec ces chiffres.
          </p>
        ) : (
          <>
            <div>
              <p className="text-xs text-germe-ink/50">Marge sur coût variable</p>
              <p className="text-lg font-semibold text-germe-ink">
                {formaterFcfa(margeUnitaire)} / unité (
                {(tauxMarge * 100).toFixed(1)}%)
              </p>
            </div>
            <div>
              <p className="text-xs text-germe-ink/50">
                Seuil de rentabilité (chiffre d'affaires)
              </p>
              <p className="text-xl font-bold text-germe-green">
                {formaterFcfa(seuilCa)} / mois ou cycle
              </p>
            </div>
            <div>
              <p className="text-xs text-germe-ink/50">
                Seuil de rentabilité (quantité)
              </p>
              <p className="text-lg font-semibold text-germe-ink">
                {Number.isFinite(seuilUnites)
                  ? `${Math.ceil(seuilUnites).toLocaleString("fr-FR")} unités / mois ou cycle`
                  : "—"}
              </p>
            </div>

            {caActuel > 0 && Number.isFinite(seuilCa) && (
              <div>
                <div className="mb-1 flex justify-between text-xs text-germe-ink/60">
                  <span>Progression vers le seuil</span>
                  <span>{progression.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-germe-green transition-all"
                    style={{ width: `${progression}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-germe-ink/50">
                  {caActuel >= seuilCa
                    ? "Vous avez dépassé votre seuil de rentabilité !"
                    : `Il vous manque ${formaterFcfa(seuilCa - caActuel)} pour atteindre le seuil.`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SimulateurInvestissement() {
  const [investissement, setInvestissement] = useState(0);
  const [beneficeAnnuel, setBeneficeAnnuel] = useState(0);

  const roi = investissement > 0 ? (beneficeAnnuel / investissement) * 100 : NaN;
  const dureeRetourMois =
    beneficeAnnuel > 0 ? (investissement / beneficeAnnuel) * 12 : NaN;

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-germe-ink/10 bg-white p-6">
        <p className="text-sm font-semibold text-germe-ink">Votre investissement</p>
        <ChampNombre
          label="Investissement initial"
          suffixe="FCFA"
          value={investissement}
          onChange={setInvestissement}
        />
        <ChampNombre
          label="Bénéfice net annuel estimé"
          suffixe="FCFA / an"
          value={beneficeAnnuel}
          onChange={setBeneficeAnnuel}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-germe-blue/20 bg-germe-blueLight p-6">
        <p className="text-sm font-semibold text-germe-ink">Résultats</p>
        <div>
          <p className="text-xs text-germe-ink/50">Retour sur investissement (ROI)</p>
          <p className="text-xl font-bold text-germe-blue">
            {Number.isFinite(roi) ? `${roi.toFixed(1)}% / an` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-germe-ink/50">
            Durée estimée pour récupérer l'investissement
          </p>
          <p className="text-lg font-semibold text-germe-ink">
            {Number.isFinite(dureeRetourMois)
              ? `${dureeRetourMois.toFixed(1)} mois (≈ ${(dureeRetourMois / 12).toFixed(1)} ans)`
              : "—"}
          </p>
        </div>
        <p className="text-xs text-germe-ink/40">
          Estimation simplifiée, à affiner avec un vrai plan de trésorerie
          avant toute décision d'investissement.
        </p>
      </div>
    </div>
  );
}
