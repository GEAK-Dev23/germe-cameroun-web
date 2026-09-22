"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  planAffaireApi,
  formationsApi,
  ApiError,
  type ContenuNarratifPlanAffaire,
  type EntreesPlanAffaire,
  type ResultatsPlanAffaire,
  type ProduitPlanAffaire,
  type LigneInvestissement,
  type LigneFraisGeneraux,
  type LigneMasseSalariale,
  type RisqueIdentifie,
  type Formation,
} from "@/lib/api";

const DELAI_SAUVEGARDE_MS = 1500;

const ENTREES_VIDES: EntreesPlanAffaire = {
  produits: [],
  investissements: [],
  fraisGeneraux: [],
  masseSalariale: [],
  financement: {
    apportPersonnelPct: 1,
    subventionPct: 0,
    creditPct: 0,
    tauxInteretAnnuel: 0.15,
    dureeCreditMois: 12,
    moisDeDeblocageCredit: 1,
  },
  hypotheses: {
    tauxCroissanceAnnuelActivite: 0.15,
    tauxCroissanceFraisGeneraux: 0.1,
    tauxChargesSociales: 0.1295,
    tauxImpotSurLesSocietes: 0.195,
  },
};

function fcfa(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
}

const ONGLETS = [
  { id: "promoteur", label: "Promoteur & SWOT" },
  { id: "marche", label: "Marché & Marketing" },
  { id: "operations", label: "Opérations, RH & Risques" },
  { id: "financier", label: "Données financières" },
  { id: "apercu", label: "Aperçu & téléchargement" },
] as const;
type OngletId = (typeof ONGLETS)[number]["id"];

export default function PlanAffairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [titreProjet, setTitreProjet] = useState("");
  const [contenu, setContenu] = useState<ContenuNarratifPlanAffaire | null>(null);
  const [entrees, setEntrees] = useState<EntreesPlanAffaire>(ENTREES_VIDES);
  const [onglet, setOnglet] = useState<OngletId>("promoteur");
  const [chargement, setChargement] = useState(true);
  const [nonEligible, setNonEligible] = useState<string | null>(null);
  const [statutSauvegarde, setStatutSauvegarde] = useState<"inactif" | "en_attente" | "enregistre" | "erreur">("inactif");
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const premierChargement = useRef(true);

  useEffect(() => {
    Promise.all([formationsApi.obtenirUne(id), planAffaireApi.obtenir(id)])
      .then(([f, plan]) => {
        setFormation(f);
        setTitreProjet(plan.titreProjet);
        setContenu(plan.contenuNarratif);
        if (plan.entreesFinancieres) setEntrees(plan.entreesFinancieres);
        premierChargement.current = false;
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 403) {
          setNonEligible(err.message);
        } else {
          setNonEligible("Impossible de charger votre plan d'affaire pour le moment.");
        }
      })
      .finally(() => setChargement(false));
  }, [id]);

  function planifierSauvegarde() {
    if (premierChargement.current) return;
    setStatutSauvegarde("en_attente");
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(async () => {
      try {
        await planAffaireApi.enregistrer(id, {
          titreProjet,
          contenuNarratif: contenu ?? undefined,
          entreesFinancieres: entrees,
        });
        setStatutSauvegarde("enregistre");
      } catch {
        setStatutSauvegarde("erreur");
      }
    }, DELAI_SAUVEGARDE_MS);
  }

  // Sauvegarde déclenchée à chaque changement de contenu/entrées.
  useEffect(planifierSauvegarde, [titreProjet, contenu, entrees]); // eslint-disable-line react-hooks/exhaustive-deps

  function majChamp<K extends keyof ContenuNarratifPlanAffaire>(champ: K, valeur: ContenuNarratifPlanAffaire[K]) {
    setContenu((c) => (c ? { ...c, [champ]: valeur } : c));
  }

  if (chargement) {
    return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-germe-ink/50">Chargement...</div>;
  }

  if (nonEligible) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat/40 text-2xl">
          🔒
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink">
          Pas encore disponible
        </h1>
        <p className="mt-2 text-sm text-germe-ink/60">{nonEligible}</p>
        <Link href={`/plateforme/formations/${id}`} className="mt-6 inline-block text-sm text-germe-blue hover:underline">
          ← Retour à la formation
        </Link>
      </div>
    );
  }

  if (!contenu) return null;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <Link href={`/plateforme/formations/${id}`} className="text-sm text-germe-ink/60 hover:text-germe-ink">
        ← Retour à la formation
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-germe-ink">
            📊 Mon plan d'affaire
          </h1>
          <p className="mt-1 text-sm text-germe-ink/60">
            Formation : {formation?.titre}
          </p>
        </div>
        <p className="text-xs text-germe-ink/40">
          {statutSauvegarde === "en_attente" && "Enregistrement..."}
          {statutSauvegarde === "enregistre" && "✓ Enregistré"}
          {statutSauvegarde === "erreur" && <span className="text-red-600">Échec de l'enregistrement</span>}
        </p>
      </div>

      <input
        value={titreProjet}
        onChange={(e) => setTitreProjet(e.target.value)}
        placeholder="Nom de votre projet (ex : Shawarma Express)"
        className="mt-4 w-full rounded-lg border border-germe-ink/20 bg-white px-4 py-2.5 text-sm font-medium focus:border-germe-blue focus:outline-none"
      />

      <div className="mt-6 flex flex-wrap gap-1 rounded-xl bg-white p-1.5 shadow-sm">
        {ONGLETS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOnglet(o.id)}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium transition sm:text-sm ${
              onglet === o.id ? "bg-germe-green text-white" : "text-germe-ink/60 hover:bg-germe-cream"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {onglet === "promoteur" && <OngletPromoteur contenu={contenu} majChamp={majChamp} />}
        {onglet === "marche" && <OngletMarche contenu={contenu} majChamp={majChamp} />}
        {onglet === "operations" && <OngletOperations contenu={contenu} majChamp={majChamp} />}
        {onglet === "financier" && <OngletFinancier entrees={entrees} setEntrees={setEntrees} />}
        {onglet === "apercu" && (
          <OngletApercu id={id} titreProjet={titreProjet} entrees={entrees} />
        )}
      </div>

      <NavigationOnglets ongletActif={onglet} onChanger={setOnglet} />
    </main>
  );
}

// ---------- Navigation entre onglets (précédent / suivant) ----------

function NavigationOnglets({
  ongletActif,
  onChanger,
}: {
  ongletActif: OngletId;
  onChanger: (o: OngletId) => void;
}) {
  const index = ONGLETS.findIndex((o) => o.id === ongletActif);
  const precedent = index > 0 ? ONGLETS[index - 1] : null;
  const suivant = index < ONGLETS.length - 1 ? ONGLETS[index + 1] : null;

  function allerA(o: (typeof ONGLETS)[number]) {
    onChanger(o.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!precedent && !suivant) return null;

  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-germe-ink/10 pt-6">
      {precedent ? (
        <button
          type="button"
          onClick={() => allerA(precedent)}
          className="flex items-center gap-1.5 rounded-full border border-germe-ink/15 bg-white px-5 py-2.5 text-sm font-medium text-germe-ink/70 shadow-sm transition hover:-translate-y-0.5 hover:border-germe-blue hover:text-germe-blue hover:shadow-md"
        >
          ← {precedent.label}
        </button>
      ) : (
        <span />
      )}

      {suivant ? (
        <button
          type="button"
          onClick={() => allerA(suivant)}
          className="flex items-center gap-1.5 rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-md"
        >
          {suivant.label} →
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

// ---------- Composants de champ réutilisables ----------

function ChampTexte({
  label,
  valeur,
  onChange,
  lignes = 3,
  placeholder,
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  lignes?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-germe-ink">{label}</label>
      <textarea
        rows={lignes}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Rédigez ici..."}
        className="mt-1 w-full rounded-lg border border-germe-ink/20 bg-white px-3 py-2 text-sm leading-relaxed focus:border-germe-blue focus:outline-none"
      />
    </div>
  );
}

function CarteSection({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border border-germe-ink/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-base font-semibold text-germe-ink">{titre}</h2>
      {children}
    </div>
  );
}

// ---------- Onglet 1 : Promoteur & SWOT ----------

function OngletPromoteur({
  contenu,
  majChamp,
}: {
  contenu: ContenuNarratifPlanAffaire;
  majChamp: <K extends keyof ContenuNarratifPlanAffaire>(champ: K, valeur: ContenuNarratifPlanAffaire[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <CarteSection titre="1. Présentation du promoteur et de l'entreprise">
        <ChampTexte
          label="Qui êtes-vous ? (parcours, formation, expérience)"
          valeur={contenu.promoteur}
          onChange={(v) => majChamp("promoteur", v)}
          lignes={4}
        />
        <ChampTexte
          label="Historique du projet"
          valeur={contenu.entrepriseHistorique}
          onChange={(v) => majChamp("entrepriseHistorique", v)}
        />
        <ChampTexte
          label="Vision"
          valeur={contenu.entrepriseVision}
          onChange={(v) => majChamp("entrepriseVision", v)}
          lignes={2}
        />
        <ChampTexte
          label="Mission"
          valeur={contenu.entrepriseMission}
          onChange={(v) => majChamp("entrepriseMission", v)}
          lignes={2}
        />
        <ChampTexte
          label="Activités de l'entreprise"
          valeur={contenu.entrepriseActivites}
          onChange={(v) => majChamp("entrepriseActivites", v)}
        />
        <ChampTexte
          label="Objectifs"
          valeur={contenu.entrepriseObjectifs}
          onChange={(v) => majChamp("entrepriseObjectifs", v)}
        />
      </CarteSection>

      <CarteSection titre="Analyse SWOT — Vous (le promoteur)">
        <EditeurSwot
          swot={contenu.swotPromoteur}
          onChange={(v) => majChamp("swotPromoteur", v)}
        />
      </CarteSection>

      <CarteSection titre="Analyse SWOT — L'entreprise">
        <EditeurSwot
          swot={contenu.swotEntreprise}
          onChange={(v) => majChamp("swotEntreprise", v)}
        />
      </CarteSection>
    </div>
  );
}

function EditeurSwot({
  swot,
  onChange,
}: {
  swot: ContenuNarratifPlanAffaire["swotPromoteur"];
  onChange: (v: ContenuNarratifPlanAffaire["swotPromoteur"]) => void;
}) {
  const CATEGORIES: { cle: keyof typeof swot; label: string; couleur: string }[] = [
    { cle: "forces", label: "Forces", couleur: "border-germe-green/30 bg-germe-greenLight" },
    { cle: "faiblesses", label: "Faiblesses", couleur: "border-red-200 bg-red-50" },
    { cle: "opportunites", label: "Opportunités", couleur: "border-germe-blue/30 bg-germe-blueLight" },
    { cle: "menaces", label: "Menaces", couleur: "border-germe-wheat bg-germe-cream" },
  ];

  function majListe(cle: keyof typeof swot, texte: string) {
    onChange({ ...swot, [cle]: texte.split("\n") });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CATEGORIES.map((c) => (
        <div key={c.cle} className={`rounded-lg border p-3 ${c.couleur}`}>
          <p className="text-xs font-semibold text-germe-ink">{c.label}</p>
          <textarea
            rows={4}
            value={swot[c.cle].join("\n")}
            onChange={(e) => majListe(c.cle, e.target.value)}
            placeholder="Un élément par ligne"
            className="mt-1 w-full rounded-lg border border-germe-ink/15 bg-white px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}

// ---------- Onglet 2 : Marché & Marketing ----------

function OngletMarche({
  contenu,
  majChamp,
}: {
  contenu: ContenuNarratifPlanAffaire;
  majChamp: <K extends keyof ContenuNarratifPlanAffaire>(champ: K, valeur: ContenuNarratifPlanAffaire[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <CarteSection titre="2. Le marché cible de mon entreprise">
        <ChampTexte
          label="Présentation des produits et services"
          valeur={contenu.presentationProduitsServices}
          onChange={(v) => majChamp("presentationProduitsServices", v)}
        />
        <ChampTexte
          label="Le marché cible (clientèle, concurrence, taille du marché)"
          valeur={contenu.marcheCible}
          onChange={(v) => majChamp("marcheCible", v)}
          lignes={4}
        />
      </CarteSection>

      <CarteSection titre="3. Plan marketing (les 4P)">
        <ChampTexte label="Produit" valeur={contenu.marketingProduit} onChange={(v) => majChamp("marketingProduit", v)} lignes={2} />
        <ChampTexte label="Prix" valeur={contenu.marketingPrix} onChange={(v) => majChamp("marketingPrix", v)} lignes={2} />
        <ChampTexte label="Promotion" valeur={contenu.marketingPromotion} onChange={(v) => majChamp("marketingPromotion", v)} lignes={2} />
        <ChampTexte label="Distribution (Place)" valeur={contenu.marketingDistribution} onChange={(v) => majChamp("marketingDistribution", v)} lignes={2} />
      </CarteSection>
    </div>
  );
}

// ---------- Onglet 3 : Opérations, RH, Formalisation, Risques ----------

function OngletOperations({
  contenu,
  majChamp,
}: {
  contenu: ContenuNarratifPlanAffaire;
  majChamp: <K extends keyof ContenuNarratifPlanAffaire>(champ: K, valeur: ContenuNarratifPlanAffaire[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <CarteSection titre="4. Plan des opérations">
        <ChampTexte label="Processus de production" valeur={contenu.operationsProcessus} onChange={(v) => majChamp("operationsProcessus", v)} />
        <ChampTexte label="Approvisionnement" valeur={contenu.operationsApprovisionnement} onChange={(v) => majChamp("operationsApprovisionnement", v)} />
        <ChampTexte label="Lieu d'installation et équipements" valeur={contenu.operationsLieuEtEquipements} onChange={(v) => majChamp("operationsLieuEtEquipements", v)} />
      </CarteSection>

      <CarteSection titre="5. Ressources humaines">
        <ChampTexte label="Équipe actuelle" valeur={contenu.ressourcesHumainesEquipe} onChange={(v) => majChamp("ressourcesHumainesEquipe", v)} />
        <ChampTexte label="Création d'emplois prévue" valeur={contenu.ressourcesHumainesCreationEmplois} onChange={(v) => majChamp("ressourcesHumainesCreationEmplois", v)} lignes={2} />
      </CarteSection>

      <CarteSection titre="6. Formalisation de l'entreprise">
        <ChampTexte label="Étapes de formalisation (statut juridique, immatriculation...)" valeur={contenu.formalisationEtapes} onChange={(v) => majChamp("formalisationEtapes", v)} />
      </CarteSection>

      <CarteSection titre="Gestion des risques">
        <EditeurRisques
          risques={contenu.gestionRisques}
          onChange={(v) => majChamp("gestionRisques", v)}
        />
      </CarteSection>
    </div>
  );
}

function EditeurRisques({
  risques,
  onChange,
}: {
  risques: RisqueIdentifie[];
  onChange: (v: RisqueIdentifie[]) => void;
}) {
  function ajouter() {
    onChange([...risques, { risque: "", origine: "", probabilite: "Moyenne", importance: "Moyenne", actionMitigation: "" }]);
  }
  function majLigne(i: number, champ: keyof RisqueIdentifie, valeur: string) {
    onChange(risques.map((r, j) => (i === j ? { ...r, [champ]: valeur } : r)));
  }
  function supprimer(i: number) {
    onChange(risques.filter((_, j) => j !== i));
  }

  return (
    <div className="space-y-3">
      {risques.map((r, i) => (
        <div key={i} className="rounded-lg border border-germe-ink/10 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-germe-ink">Risque {i + 1}</p>
            <button type="button" onClick={() => supprimer(i)} className="text-xs text-red-500 hover:underline">
              Supprimer
            </button>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input placeholder="Risque identifié" value={r.risque} onChange={(e) => majLigne(i, "risque", e.target.value)} className="rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
            <input placeholder="Origine" value={r.origine} onChange={(e) => majLigne(i, "origine", e.target.value)} className="rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
            <select value={r.probabilite} onChange={(e) => majLigne(i, "probabilite", e.target.value)} className="rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none">
              <option>Faible</option><option>Moyenne</option><option>Élevée</option>
            </select>
            <select value={r.importance} onChange={(e) => majLigne(i, "importance", e.target.value)} className="rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none">
              <option>Faible</option><option>Moyenne</option><option>Élevée</option>
            </select>
          </div>
          <input
            placeholder="Action d'atténuation envisagée"
            value={r.actionMitigation}
            onChange={(e) => majLigne(i, "actionMitigation", e.target.value)}
            className="mt-2 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
          />
        </div>
      ))}
      <button type="button" onClick={ajouter} className="text-xs font-medium text-germe-green hover:underline">
        + Ajouter un risque
      </button>
    </div>
  );
}

// ---------- Onglet 4 : Données financières ----------

function OngletFinancier({
  entrees,
  setEntrees,
}: {
  entrees: EntreesPlanAffaire;
  setEntrees: React.Dispatch<React.SetStateAction<EntreesPlanAffaire>>;
}) {
  return (
    <div className="space-y-6">
      <CarteSection titre="Produits / services et leur coût de revient">
        <EditeurProduits
          produits={entrees.produits}
          onChange={(produits) => setEntrees((e) => ({ ...e, produits }))}
        />
      </CarteSection>

      <CarteSection titre="Investissements">
        <EditeurInvestissements
          lignes={entrees.investissements}
          onChange={(investissements) => setEntrees((e) => ({ ...e, investissements }))}
        />
      </CarteSection>

      <CarteSection titre="Frais généraux mensuels">
        <EditeurFraisGeneraux
          lignes={entrees.fraisGeneraux}
          onChange={(fraisGeneraux) => setEntrees((e) => ({ ...e, fraisGeneraux }))}
        />
      </CarteSection>

      <CarteSection titre="Personnel">
        <EditeurMasseSalariale
          lignes={entrees.masseSalariale}
          onChange={(masseSalariale) => setEntrees((e) => ({ ...e, masseSalariale }))}
        />
      </CarteSection>

      <CarteSection titre="Financement et hypothèses">
        <EditeurFinancement entrees={entrees} setEntrees={setEntrees} />
      </CarteSection>
    </div>
  );
}

const PRODUIT_VIDE: ProduitPlanAffaire = {
  nom: "",
  unite: "unité",
  ingredients: [],
  uniteParLot: 1,
  prixVenteUnitaire: 0,
  volumesMensuelsAnnee1: Array(12).fill(0),
  tauxDePerte: 0,
};

function EditeurProduits({
  produits,
  onChange,
}: {
  produits: ProduitPlanAffaire[];
  onChange: (v: ProduitPlanAffaire[]) => void;
}) {
  const [ouvert, setOuvert] = useState<number | null>(null);

  function ajouter() {
    onChange([...produits, { ...PRODUIT_VIDE, volumesMensuelsAnnee1: Array(12).fill(0) }]);
    setOuvert(produits.length);
  }
  function maj(i: number, patch: Partial<ProduitPlanAffaire>) {
    onChange(produits.map((p, j) => (i === j ? { ...p, ...patch } : p)));
  }
  function supprimer(i: number) {
    onChange(produits.filter((_, j) => j !== i));
    setOuvert(null);
  }

  return (
    <div className="space-y-3">
      {produits.map((p, i) => {
        const coutIngredients = p.ingredients.reduce((s, ing) => s + ing.quantite * ing.prixUnitaire, 0);
        const coutUnitaire = p.uniteParLot > 0 ? coutIngredients / p.uniteParLot : 0;
        return (
          <div key={i} className="rounded-lg border border-germe-ink/10">
            <button
              type="button"
              onClick={() => setOuvert(ouvert === i ? null : i)}
              className="flex w-full items-center justify-between gap-2 p-3 text-left"
            >
              <span className="text-sm font-medium text-germe-ink">
                {p.nom || `Produit ${i + 1}`}
                {coutUnitaire > 0 && (
                  <span className="ml-2 text-xs font-normal text-germe-ink/40">
                    coût unitaire ≈ {fcfa(coutUnitaire)}
                  </span>
                )}
              </span>
              <span className="text-germe-ink/40">{ouvert === i ? "▲" : "▼"}</span>
            </button>

            {ouvert === i && (
              <div className="space-y-3 border-t border-germe-ink/10 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input placeholder="Nom du produit" value={p.nom} onChange={(e) => maj(i, { nom: e.target.value })} className="rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
                  <input placeholder="Unité (ex : plat, coupe)" value={p.unite} onChange={(e) => maj(i, { unite: e.target.value })} className="rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
                </div>

                <div>
                  <p className="text-xs font-medium text-germe-ink/60">
                    Recette (ingrédients nécessaires pour produire un lot)
                  </p>
                  <EditeurIngredients
                    ingredients={p.ingredients}
                    onChange={(ingredients) => maj(i, { ingredients })}
                  />
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-[11px] text-germe-ink/50">Unités obtenues par lot</span>
                    <input type="number" min={1} value={p.uniteParLot} onChange={(e) => maj(i, { uniteParLot: Number(e.target.value) })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-[11px] text-germe-ink/50">Prix de vente unitaire (FCFA)</span>
                    <input type="number" min={0} value={p.prixVenteUnitaire} onChange={(e) => maj(i, { prixVenteUnitaire: Number(e.target.value) })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-[11px] text-germe-ink/50">Taux de perte (%)</span>
                    <input type="number" min={0} max={100} value={p.tauxDePerte * 100} onChange={(e) => maj(i, { tauxDePerte: Number(e.target.value) / 100 })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
                  </label>
                </div>

                <div>
                  <p className="text-xs font-medium text-germe-ink/60">
                    Volumes produits par mois — année 1
                  </p>
                  <div className="mt-1 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                    {p.volumesMensuelsAnnee1.map((v, m) => (
                      <label key={m} className="block">
                        <span className="text-[10px] text-germe-ink/40">Mois {m + 1}</span>
                        <input
                          type="number"
                          min={0}
                          value={v}
                          onChange={(e) => {
                            const volumes = [...p.volumesMensuelsAnnee1];
                            volumes[m] = Number(e.target.value);
                            maj(i, { volumesMensuelsAnnee1: volumes });
                          }}
                          className="w-full rounded-lg border border-germe-ink/20 px-2 py-1 text-xs focus:border-germe-blue focus:outline-none"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={() => supprimer(i)} className="text-xs font-medium text-red-500 hover:underline">
                  Supprimer ce produit
                </button>
              </div>
            )}
          </div>
        );
      })}
      <button type="button" onClick={ajouter} className="text-xs font-medium text-germe-green hover:underline">
        + Ajouter un produit ou service
      </button>
    </div>
  );
}

function EditeurIngredients({
  ingredients,
  onChange,
}: {
  ingredients: ProduitPlanAffaire["ingredients"];
  onChange: (v: ProduitPlanAffaire["ingredients"]) => void;
}) {
  function ajouter() {
    onChange([...ingredients, { nom: "", unite: "", quantite: 1, prixUnitaire: 0 }]);
  }
  function maj(i: number, patch: Partial<ProduitPlanAffaire["ingredients"][number]>) {
    onChange(ingredients.map((ing, j) => (i === j ? { ...ing, ...patch } : ing)));
  }
  function supprimer(i: number) {
    onChange(ingredients.filter((_, j) => j !== i));
  }

  return (
    <div className="mt-1 space-y-1.5">
      {ingredients.map((ing, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5">
          <input placeholder="Ingrédient" value={ing.nom} onChange={(e) => maj(i, { nom: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input placeholder="Unité" value={ing.unite} onChange={(e) => maj(i, { unite: e.target.value })} className="w-20 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={0} placeholder="Qté" value={ing.quantite} onChange={(e) => maj(i, { quantite: Number(e.target.value) })} className="w-20 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={0} placeholder="Prix unit." value={ing.prixUnitaire} onChange={(e) => maj(i, { prixUnitaire: Number(e.target.value) })} className="w-24 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <button type="button" onClick={() => supprimer(i)} className="shrink-0 text-germe-ink/30 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={ajouter} className="text-[11px] font-medium text-germe-green hover:underline">
        + Ingrédient
      </button>
    </div>
  );
}

function EditeurInvestissements({
  lignes,
  onChange,
}: {
  lignes: LigneInvestissement[];
  onChange: (v: LigneInvestissement[]) => void;
}) {
  function ajouter() {
    onChange([...lignes, { nom: "", quantite: 1, prixUnitaire: 0, dureeAmortissementAnnees: 5 }]);
  }
  function maj(i: number, patch: Partial<LigneInvestissement>) {
    onChange(lignes.map((l, j) => (i === j ? { ...l, ...patch } : l)));
  }
  function supprimer(i: number) {
    onChange(lignes.filter((_, j) => j !== i));
  }
  const total = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);

  return (
    <div className="space-y-1.5">
      {lignes.map((l, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5">
          <input placeholder="Désignation" value={l.nom} onChange={(e) => maj(i, { nom: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={0} placeholder="Qté" value={l.quantite} onChange={(e) => maj(i, { quantite: Number(e.target.value) })} className="w-16 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={0} placeholder="Prix unit." value={l.prixUnitaire} onChange={(e) => maj(i, { prixUnitaire: Number(e.target.value) })} className="w-28 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={1} placeholder="Durée (ans)" value={l.dureeAmortissementAnnees} onChange={(e) => maj(i, { dureeAmortissementAnnees: Number(e.target.value) })} className="w-24 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <button type="button" onClick={() => supprimer(i)} className="shrink-0 text-germe-ink/30 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={ajouter} className="text-xs font-medium text-germe-green hover:underline">
        + Ajouter un investissement
      </button>
      {lignes.length > 0 && (
        <p className="pt-1 text-xs font-medium text-germe-ink/60">Total : {fcfa(total)}</p>
      )}
    </div>
  );
}

function EditeurFraisGeneraux({
  lignes,
  onChange,
}: {
  lignes: LigneFraisGeneraux[];
  onChange: (v: LigneFraisGeneraux[]) => void;
}) {
  function ajouter() {
    onChange([...lignes, { nom: "", montantMensuel: 0 }]);
  }
  function maj(i: number, patch: Partial<LigneFraisGeneraux>) {
    onChange(lignes.map((l, j) => (i === j ? { ...l, ...patch } : l)));
  }
  function supprimer(i: number) {
    onChange(lignes.filter((_, j) => j !== i));
  }

  return (
    <div className="space-y-1.5">
      {lignes.map((l, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5">
          <input placeholder="Ex : Loyer, électricité..." value={l.nom} onChange={(e) => maj(i, { nom: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={0} placeholder="Montant mensuel" value={l.montantMensuel} onChange={(e) => maj(i, { montantMensuel: Number(e.target.value) })} className="w-32 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <button type="button" onClick={() => supprimer(i)} className="shrink-0 text-germe-ink/30 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={ajouter} className="text-xs font-medium text-germe-green hover:underline">
        + Ajouter une ligne
      </button>
    </div>
  );
}

function EditeurMasseSalariale({
  lignes,
  onChange,
}: {
  lignes: LigneMasseSalariale[];
  onChange: (v: LigneMasseSalariale[]) => void;
}) {
  function ajouter() {
    onChange([...lignes, { poste: "", effectif: 1, salaireMensuel: 0 }]);
  }
  function maj(i: number, patch: Partial<LigneMasseSalariale>) {
    onChange(lignes.map((l, j) => (i === j ? { ...l, ...patch } : l)));
  }
  function supprimer(i: number) {
    onChange(lignes.filter((_, j) => j !== i));
  }

  return (
    <div className="space-y-1.5">
      {lignes.map((l, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5">
          <input placeholder="Poste" value={l.poste} onChange={(e) => maj(i, { poste: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={0} placeholder="Effectif" value={l.effectif} onChange={(e) => maj(i, { effectif: Number(e.target.value) })} className="w-20 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <input type="number" min={0} placeholder="Salaire mensuel" value={l.salaireMensuel} onChange={(e) => maj(i, { salaireMensuel: Number(e.target.value) })} className="w-32 rounded-lg border border-germe-ink/20 px-2.5 py-1.5 text-xs focus:border-germe-blue focus:outline-none" />
          <button type="button" onClick={() => supprimer(i)} className="shrink-0 text-germe-ink/30 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={ajouter} className="text-xs font-medium text-germe-green hover:underline">
        + Ajouter un poste
      </button>
    </div>
  );
}

function EditeurFinancement({
  entrees,
  setEntrees,
}: {
  entrees: EntreesPlanAffaire;
  setEntrees: React.Dispatch<React.SetStateAction<EntreesPlanAffaire>>;
}) {
  const { financement, hypotheses } = entrees;
  const totalPct = financement.apportPersonnelPct + financement.subventionPct + financement.creditPct;

  function majFin(patch: Partial<typeof financement>) {
    setEntrees((e) => ({ ...e, financement: { ...e.financement, ...patch } }));
  }
  function majHyp(patch: Partial<typeof hypotheses>) {
    setEntrees((e) => ({ ...e, hypotheses: { ...e.hypotheses, ...patch } }));
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-germe-ink/60">
          Schéma de financement (doit totaliser 100%)
          {Math.abs(totalPct - 1) > 0.01 && (
            <span className="ml-2 text-red-600">— actuellement {Math.round(totalPct * 100)}%</span>
          )}
        </p>
        <div className="mt-1 grid gap-2 sm:grid-cols-3">
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Apport personnel (%)</span>
            <input type="number" min={0} max={100} value={Math.round(financement.apportPersonnelPct * 100)} onChange={(e) => majFin({ apportPersonnelPct: Number(e.target.value) / 100 })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Subvention (%)</span>
            <input type="number" min={0} max={100} value={Math.round(financement.subventionPct * 100)} onChange={(e) => majFin({ subventionPct: Number(e.target.value) / 100 })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Crédit (%)</span>
            <input type="number" min={0} max={100} value={Math.round(financement.creditPct * 100)} onChange={(e) => majFin({ creditPct: Number(e.target.value) / 100 })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-germe-ink/60">Conditions du crédit</p>
        <div className="mt-1 grid gap-2 sm:grid-cols-3">
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Taux d'intérêt annuel (%)</span>
            <input type="number" min={0} value={financement.tauxInteretAnnuel * 100} onChange={(e) => majFin({ tauxInteretAnnuel: Number(e.target.value) / 100 })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Durée (mois)</span>
            <input type="number" min={1} value={financement.dureeCreditMois} onChange={(e) => majFin({ dureeCreditMois: Number(e.target.value) })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Mois de déblocage (1-12)</span>
            <input type="number" min={1} max={12} value={financement.moisDeDeblocageCredit} onChange={(e) => majFin({ moisDeDeblocageCredit: Number(e.target.value) })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-germe-ink/60">Hypothèses de croissance</p>
        <div className="mt-1 grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Croissance annuelle de l'activité (%)</span>
            <input type="number" min={0} value={hypotheses.tauxCroissanceAnnuelActivite * 100} onChange={(e) => majHyp({ tauxCroissanceAnnuelActivite: Number(e.target.value) / 100 })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">Croissance annuelle des frais généraux (%)</span>
            <input type="number" min={0} value={hypotheses.tauxCroissanceFraisGeneraux * 100} onChange={(e) => majHyp({ tauxCroissanceFraisGeneraux: Number(e.target.value) / 100 })} className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none" />
          </label>
        </div>
      </div>
    </div>
  );
}

// ---------- Onglet 5 : Aperçu & téléchargement ----------

function OngletApercu({
  id,
  titreProjet,
  entrees,
}: {
  id: string;
  titreProjet: string;
  entrees: EntreesPlanAffaire;
}) {
  const [resultats, setResultats] = useState<ResultatsPlanAffaire | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const [telechargement, setTelechargement] = useState(false);

  function calculer() {
    setChargement(true);
    setErreur(null);
    planAffaireApi
      .calculer(entrees)
      .then(setResultats)
      .catch((err) =>
        setErreur(err instanceof ApiError ? err.message : "Impossible de calculer votre plan d'affaire."),
      )
      .finally(() => setChargement(false));
  }

  useEffect(calculer, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function telecharger() {
    setTelechargement(true);
    try {
      await planAffaireApi.telechargerDocument(id, `Plan-affaire-${titreProjet || "projet"}.docx`);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Impossible de générer le document.");
    } finally {
      setTelechargement(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-germe-green/20 bg-germe-greenLight p-5">
        <div>
          <p className="text-sm font-semibold text-germe-ink">Document final</p>
          <p className="mt-0.5 text-xs text-germe-ink/60">
            Génère votre plan d'affaire complet au format Word, avec le texte rédigé et les tableaux calculés ci-dessous.
          </p>
        </div>
        <button
          type="button"
          onClick={telecharger}
          disabled={telechargement}
          className="shrink-0 rounded-full bg-germe-green px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-60"
        >
          {telechargement ? "Génération..." : "📄 Télécharger le document Word"}
        </button>
      </div>

      <button
        type="button"
        onClick={calculer}
        disabled={chargement}
        className="rounded-full border border-germe-ink/15 px-4 py-2 text-xs font-medium text-germe-ink/70 hover:border-germe-blue hover:text-germe-blue disabled:opacity-50"
      >
        {chargement ? "Calcul..." : "🔄 Recalculer l'aperçu"}
      </button>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      {resultats && (
        <>
          <CarteSection titre="Coût unitaire des produits">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-germe-ink/50">
                    <th className="pb-2">Produit</th>
                    <th className="pb-2">Coût unitaire</th>
                    <th className="pb-2">Marge unitaire</th>
                    <th className="pb-2">Taux de marge</th>
                  </tr>
                </thead>
                <tbody>
                  {resultats.coutsUnitaires.map((c) => (
                    <tr key={c.nom} className="border-t border-germe-ink/5">
                      <td className="py-1.5 font-medium text-germe-ink">{c.nom}</td>
                      <td className="py-1.5">{fcfa(c.coutUnitaire)}</td>
                      <td className="py-1.5">{fcfa(c.margeUnitaire)}</td>
                      <td className="py-1.5">{(c.tauxDeMarge * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CarteSection>

          <CarteSection titre="Coût du projet et financement">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCarte label="Investissement" valeur={fcfa(resultats.coutDuProjet.investissement)} />
              <StatCarte label="BFR" valeur={fcfa(resultats.coutDuProjet.bfr)} />
              <StatCarte label="Coût total du projet" valeur={fcfa(resultats.coutDuProjet.coutTotalDuProjet)} accent />
            </div>
          </CarteSection>

          <CarteSection titre="Compte de résultat prévisionnel sur 3 ans">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-germe-ink/50">
                    <th className="pb-2">Rubrique</th>
                    <th className="pb-2">Année 1</th>
                    <th className="pb-2">Année 2</th>
                    <th className="pb-2">Année 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-germe-ink/5">
                    <td className="py-1.5 font-medium text-germe-ink">Chiffre d'affaires</td>
                    {resultats.compteDeResultat.map((l) => <td key={l.annee} className="py-1.5">{fcfa(l.chiffreAffaires)}</td>)}
                  </tr>
                  <tr className="border-t border-germe-ink/5">
                    <td className="py-1.5 font-medium text-germe-ink">Marge brute</td>
                    {resultats.compteDeResultat.map((l) => <td key={l.annee} className="py-1.5">{fcfa(l.margeBrute)}</td>)}
                  </tr>
                  <tr className="border-t border-germe-ink/5">
                    <td className="py-1.5 font-medium text-germe-ink">Résultat net avant impôts</td>
                    {resultats.compteDeResultat.map((l) => <td key={l.annee} className="py-1.5">{fcfa(l.resultatNetAvantImpots)}</td>)}
                  </tr>
                  <tr className="border-t border-germe-ink/5">
                    <td className="py-1.5 font-medium text-germe-ink">Capacité d'autofinancement</td>
                    {resultats.compteDeResultat.map((l) => <td key={l.annee} className="py-1.5 font-medium text-germe-green">{fcfa(l.capaciteAutofinancement)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </CarteSection>
        </>
      )}
    </div>
  );
}

function StatCarte({ label, valeur, accent }: { label: string; valeur: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg p-3 text-center ${accent ? "bg-germe-green/15" : "bg-germe-cream"}`}>
      <p className={`text-sm font-bold ${accent ? "text-germe-green" : "text-germe-ink"}`}>{valeur}</p>
      <p className="mt-0.5 text-[11px] text-germe-ink/50">{label}</p>
    </div>
  );
}
