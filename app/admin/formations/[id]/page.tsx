"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  formationsApi,
  testsModuleApi,
  testsChapitreApi,
  examenFinalApi,
  usersApi,
  ApiError,
  type FormationAvecCurriculum,
  type Formation,
  type ModulePedagogique,
  type Chapitre,
  type Lecon,
  type BlocContenu,
  type UtilisateurAdmin,
} from "@/lib/api";
import QcmBuilder from "@/components/admin/QcmBuilder";
import TestManager from "@/components/admin/TestManager";
import EditeurTexteEnrichi from "@/components/admin/EditeurTexteEnrichi";
import ChampMedia from "@/components/admin/ChampMedia";
import EditeurBlocs from "@/components/admin/EditeurBlocs";
import RichText from "@/components/plateforme/RichText";

// Conversion entre une date ISO (UTC, telle que renvoyée par l'API) et le
// format attendu par <input type="datetime-local"> (heure locale, sans
// fuseau) — et inversement à l'envoi.
function versInputDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const decalage = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - decalage).toISOString().slice(0, 16);
}

function depuisInputDate(valeur: string): string | null {
  if (!valeur) return null;
  return new Date(valeur).toISOString();
}

// ---------- Formulaire de présentation réutilisable (module/chapitre) ----------

function FormulairePresentation({
  image,
  setImage,
  video,
  setVideo,
  texte1,
  setTexte1,
  labelTexte1,
  texte2,
  setTexte2,
  labelTexte2,
}: {
  image: string;
  setImage: (v: string) => void;
  video: string;
  setVideo: (v: string) => void;
  texte1: string;
  setTexte1: (v: string) => void;
  labelTexte1: string;
  texte2?: string;
  setTexte2?: (v: string) => void;
  labelTexte2?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <ChampMedia
          value={image}
          onChange={setImage}
          placeholder="Image de présentation (facultatif)"
        />
        <ChampMedia
          value={video}
          onChange={setVideo}
          placeholder="Vidéo de présentation (facultatif)"
        />
      </div>
      <div>
        <p className="mb-1 text-[11px] font-medium text-germe-ink/50">
          {labelTexte1}
        </p>
        <EditeurTexteEnrichi value={texte1} onChange={setTexte1} rows={3} />
      </div>
      {setTexte2 && (
        <div>
          <p className="mb-1 text-[11px] font-medium text-germe-ink/50">
            {labelTexte2}
          </p>
          <EditeurTexteEnrichi value={texte2 ?? ""} onChange={setTexte2} rows={2} />
        </div>
      )}
    </div>
  );
}

// ---------- Réglages de la formation (payant/gratuit, prix, etc.) ----------

function ReglagesFormation({
  formation,
  onRecharger,
}: {
  formation: FormationAvecCurriculum;
  onRecharger: () => void;
}) {
  const [edition, setEdition] = useState(false);
  const [titre, setTitre] = useState(formation.titre);
  const [description, setDescription] = useState(formation.description ?? "");
  const [categorie, setCategorie] = useState(formation.categorie);
  const [imageCouverture, setImageCouverture] = useState(
    formation.imageCouverture ?? "",
  );
  const [estPayant, setEstPayant] = useState(formation.estPayant);
  const [prixFcfa, setPrixFcfa] = useState(formation.prixFcfa);
  const [formationPrerequiseId, setFormationPrerequiseId] = useState(
    formation.formationPrerequiseId ?? "",
  );
  const [dateOuvertureInscriptions, setDateOuvertureInscriptions] = useState(
    versInputDate(formation.dateOuvertureInscriptions),
  );
  const [dateFermetureInscriptions, setDateFermetureInscriptions] = useState(
    versInputDate(formation.dateFermetureInscriptions),
  );
  const [dateDebut, setDateDebut] = useState(versInputDate(formation.dateDebut));
  const [dateFin, setDateFin] = useState(versInputDate(formation.dateFin));
  const [formateurIdsSelectionnes, setFormateurIdsSelectionnes] = useState<string[]>(
    formation.formateurs?.map((f) => f.id) ?? [],
  );
  const [formateursDisponibles, setFormateursDisponibles] = useState<UtilisateurAdmin[]>([]);
  const [autresFormations, setAutresFormations] = useState<Formation[]>([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    formationsApi
      .listerToutes()
      .then((liste) => setAutresFormations(liste.filter((f) => f.id !== formation.id)))
      .catch(() => {});
    usersApi
      .lister()
      .then((liste) => setFormateursDisponibles(liste.filter((u) => u.role === "formateur")))
      .catch(() => {});
  }, [formation.id]);

  function basculerFormateur(id: string) {
    setFormateurIdsSelectionnes((liste) =>
      liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id],
    );
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      await formationsApi.modifier(formation.id, {
        titre,
        description,
        categorie,
        imageCouverture: imageCouverture || null,
        estPayant,
        prixFcfa: estPayant ? prixFcfa : 0,
        formationPrerequiseId: formationPrerequiseId || null,
        dateOuvertureInscriptions: depuisInputDate(dateOuvertureInscriptions),
        dateFermetureInscriptions: depuisInputDate(dateFermetureInscriptions),
        dateDebut: depuisInputDate(dateDebut),
        dateFin: depuisInputDate(dateFin),
        formateurIds: formateurIdsSelectionnes,
      });
      setEdition(false);
      onRecharger();
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible d'enregistrer les réglages.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (!edition) {
    return (
      <button
        type="button"
        onClick={() => setEdition(true)}
        className="mt-2 text-xs font-medium text-germe-blue hover:underline"
      >
        ✎ Modifier le titre, la description, l'image, la catégorie ou le tarif
      </button>
    );
  }

  return (
    <form
      onSubmit={enregistrer}
      className="mt-3 space-y-2 rounded-xl border border-germe-ink/10 bg-white p-4"
    >
      <p className="text-sm font-semibold text-germe-ink">
        Réglages de la formation
      </p>
      <input
        required
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre"
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      />
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      />

      <div>
        <p className="mb-1 text-[11px] font-medium text-germe-ink/50">
          Image de couverture
        </p>
        <div className="flex items-start gap-3">
          {imageCouverture && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageCouverture}
              alt=""
              className="h-16 w-24 shrink-0 rounded-lg object-cover"
            />
          )}
          <ChampMedia
            value={imageCouverture}
            onChange={setImageCouverture}
            placeholder="URL de l'image (ou téléversez un fichier)"
          />
        </div>
      </div>

      <select
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      >
        <option>Agriculture</option>
        <option>Élevage</option>
        <option>Gestion</option>
        <option>Équipement</option>
      </select>

      <div>
        <p className="mb-1 text-[11px] font-medium text-germe-ink/50">
          Formation prérequise (facultatif — parcours progressif)
        </p>
        <select
          value={formationPrerequiseId}
          onChange={(e) => setFormationPrerequiseId(e.target.value)}
          className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
        >
          <option value="">Aucune — accessible directement</option>
          {autresFormations.map((f) => (
            <option key={f.id} value={f.id}>
              {f.titre}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-germe-ink/40">
          L'apprenant devra obtenir l'attestation de cette formation avant de
          pouvoir accéder à celle-ci.
        </p>
      </div>

      <div>
        <p className="mb-1 text-[11px] font-medium text-germe-ink/50">
          Formateurs assignés (facultatif)
        </p>
        {formateursDisponibles.length === 0 ? (
          <p className="text-xs text-germe-ink/40">Aucun compte formateur pour le moment.</p>
        ) : (
          <div className="space-y-1.5 rounded-lg border border-germe-ink/15 p-2.5">
            {formateursDisponibles.map((f) => (
              <label key={f.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formateurIdsSelectionnes.includes(f.id)}
                  onChange={() => basculerFormateur(f.id)}
                  className="rounded border-germe-ink/30"
                />
                {f.fullName}
              </label>
            ))}
          </div>
        )}
        <p className="mt-1 text-[11px] text-germe-ink/40">
          Affichés dans l'espace d'échange de la formation ; les apprenants
          pourront les contacter directement en message privé.
        </p>
      </div>

      <div className="rounded-lg border border-germe-ink/10 p-3">
        <p className="text-xs font-semibold text-germe-ink">
          Programmation en session (facultatif)
        </p>
        <p className="mt-0.5 text-[11px] text-germe-ink/45">
          Laissez ces champs vides pour une formation en libre accès. Dès
          qu'une date est renseignée, la formation devient une session
          programmée : les inscriptions et le déroulé suivent ces dates.
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">
              Ouverture des inscriptions
            </span>
            <input
              type="datetime-local"
              value={dateOuvertureInscriptions}
              onChange={(e) => setDateOuvertureInscriptions(e.target.value)}
              className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">
              Fermeture des inscriptions
            </span>
            <input
              type="datetime-local"
              value={dateFermetureInscriptions}
              onChange={(e) => setDateFermetureInscriptions(e.target.value)}
              className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">
              Début de la formation
            </span>
            <input
              type="datetime-local"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-germe-ink/50">
              Fin de la formation
            </span>
            <input
              type="datetime-local"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-germe-cream/60 p-3">
        <label className="flex items-center gap-2 text-sm text-germe-ink">
          <input
            type="checkbox"
            checked={estPayant}
            onChange={(e) => setEstPayant(e.target.checked)}
            className="h-4 w-4 rounded border-germe-ink/30"
          />
          Formation payante
        </label>
        {estPayant && (
          <label className="flex items-center gap-2 text-sm text-germe-ink/70">
            Prix (FCFA)
            <input
              type="number"
              min={0}
              value={prixFcfa}
              onChange={(e) => setPrixFcfa(Number(e.target.value))}
              className="w-28 rounded-lg border border-germe-ink/20 px-2 py-1 text-sm focus:border-germe-blue focus:outline-none"
            />
          </label>
        )}
        {!estPayant && (
          <span className="text-xs text-germe-ink/50">
            L'accès sera gratuit pour tous les apprenants.
          </span>
        )}
      </div>

      {erreur && <p className="text-xs text-red-600">{erreur}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEdition(false)}
          className="rounded-full px-4 py-1.5 text-xs font-medium text-germe-ink/60 hover:text-germe-ink"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-germe-blue px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {envoi ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

// ---------- Page principale ----------

export default function GererFormationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [formation, setFormation] = useState<FormationAvecCurriculum | null>(
    null,
  );
  const [erreur, setErreur] = useState<string | null>(null);
  const [moduleOuvert, setModuleOuvert] = useState<string | null>(null);
  const [ajoutModuleOuvert, setAjoutModuleOuvert] = useState(false);
  const [examenFinalOuvert, setExamenFinalOuvert] = useState(false);

  function recharger() {
    formationsApi
      .obtenirUne(id)
      .then(setFormation)
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      );
  }

  useEffect(recharger, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function ajouterModule(data: {
    titre: string;
    imagePresentation?: string;
    videoPresentation?: string;
    programme?: string;
    description?: string;
  }) {
    const cree = await formationsApi.ajouterModule(id, data);
    setAjoutModuleOuvert(false);
    recharger();
    setModuleOuvert(cree.id);
  }

  async function supprimerModule(moduleId: string) {
    if (!confirm("Supprimer ce module et tout son contenu ?")) return;
    await formationsApi.supprimerModule(moduleId);
    if (moduleOuvert === moduleId) setModuleOuvert(null);
    recharger();
  }

  if (erreur) {
    return (
      <p className="mx-auto max-w-4xl px-5 py-12 text-sm text-red-600">
        {erreur}
      </p>
    );
  }

  if (!formation) {
    return (
      <p className="mx-auto max-w-4xl px-5 py-12 text-sm text-germe-ink/50">
        Chargement...
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-12 md:px-6">
      <Link
        href="/admin/formations"
        className="text-sm text-germe-ink/60 hover:text-germe-ink"
      >
        ← Retour aux formations
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {formation.imageCouverture && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={formation.imageCouverture}
            alt=""
            className="h-12 w-20 shrink-0 rounded-lg object-cover"
          />
        )}
        <h1 className="font-display text-xl font-semibold text-germe-ink sm:text-2xl">
          {formation.titre}
        </h1>
        <span
          className={
            formation.publie
              ? "rounded-full bg-germe-green/15 px-2.5 py-0.5 text-xs font-medium text-germe-green"
              : "rounded-full bg-germe-ink/10 px-2.5 py-0.5 text-xs font-medium text-germe-ink/60"
          }
        >
          {formation.publie ? "Publiée" : "Brouillon"}
        </span>
        <span
          className={
            formation.estPayant
              ? "rounded-full bg-germe-wheat/40 px-2.5 py-0.5 text-xs font-medium text-germe-ink/70"
              : "rounded-full bg-germe-blueLight px-2.5 py-0.5 text-xs font-medium text-germe-blue"
          }
        >
          {formation.estPayant ? `${formation.prixFcfa} FCFA` : "Gratuite"}
        </span>
        {(formation.dateOuvertureInscriptions ||
          formation.dateFermetureInscriptions ||
          formation.dateDebut ||
          formation.dateFin) && (
          <span
            title={[
              formation.dateDebut &&
                `Début : ${new Date(formation.dateDebut).toLocaleString("fr-FR")}`,
              formation.dateFin &&
                `Fin : ${new Date(formation.dateFin).toLocaleString("fr-FR")}`,
              formation.dateOuvertureInscriptions &&
                `Ouverture inscriptions : ${new Date(formation.dateOuvertureInscriptions).toLocaleString("fr-FR")}`,
              formation.dateFermetureInscriptions &&
                `Fermeture inscriptions : ${new Date(formation.dateFermetureInscriptions).toLocaleString("fr-FR")}`,
            ]
              .filter(Boolean)
              .join(" · ")}
            className="rounded-full bg-germe-green/15 px-2.5 py-0.5 text-xs font-medium text-germe-green"
          >
            📅 Session programmée
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-germe-ink/60">{formation.description}</p>

      <ReglagesFormation formation={formation} onRecharger={recharger} />

      <div className="mt-4 rounded-xl border-2 border-germe-wheat bg-white p-4">
        <button
          type="button"
          onClick={() => setExamenFinalOuvert(!examenFinalOuvert)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <p className="text-sm font-semibold text-germe-ink">
              🎓 Examen final de la formation
            </p>
            <p className="text-xs text-germe-ink/50">
              Obligatoire — dernier test avant que l'apprenant puisse
              générer son attestation, débloqué une fois tous les modules
              réussis.
            </p>
          </div>
          <span className="shrink-0 text-germe-ink/40">
            {examenFinalOuvert ? "▾" : "▸"}
          </span>
        </button>
        {examenFinalOuvert && (
          <div className="mt-3">
            <TestManager
              titre="Questions de l'examen final de la formation"
              couleur="germe-green"
              obtenirTest={() => examenFinalApi.obtenirPourAdmin(id)}
              ajouterQuestion={(q, o) =>
                examenFinalApi.ajouterQuestion(id, { question: q, options: o })
              }
              modifierQuestion={(qid, q, o) =>
                examenFinalApi.modifierQuestion(qid, { question: q, options: o })
              }
              supprimerQuestion={(qid) => examenFinalApi.supprimerQuestion(qid)}
            />
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-germe-ink/40">
        {formation.modules.length} module{formation.modules.length !== 1 ? "s" : ""}{" "}
        — cliquez sur un module pour l'ouvrir. Un seul module (et un seul
        chapitre) est développé à la fois pour garder une vue claire.
      </p>

      {/* Liste des modules (accordéon) */}
      <div className="mt-4 space-y-3">
        {formation.modules.map((m) => (
          <ModuleCard
            key={m.id}
            module={m}
            ouvert={moduleOuvert === m.id}
            onToggleOuvert={() =>
              setModuleOuvert(moduleOuvert === m.id ? null : m.id)
            }
            onSupprimer={() => supprimerModule(m.id)}
            onRecharger={recharger}
          />
        ))}
      </div>

      {/* Ajout d'un module */}
      <div className="mt-6">
        {ajoutModuleOuvert ? (
          <FormulaireAjoutModule
            onAnnuler={() => setAjoutModuleOuvert(false)}
            onValider={ajouterModule}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAjoutModuleOuvert(true)}
            className="w-full rounded-xl border-2 border-dashed border-germe-ink/20 py-4 text-sm font-medium text-germe-ink/60 transition hover:border-germe-green hover:text-germe-green"
          >
            + Ajouter un module
          </button>
        )}
      </div>
    </main>
  );
}

function FormulaireAjoutModule({
  onAnnuler,
  onValider,
}: {
  onAnnuler: () => void;
  onValider: (data: {
    titre: string;
    imagePresentation?: string;
    videoPresentation?: string;
    programme?: string;
    description?: string;
  }) => Promise<void>;
}) {
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [programme, setProgramme] = useState("");
  const [description, setDescription] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await onValider({
        titre,
        imagePresentation: image || undefined,
        videoPresentation: video || undefined,
        programme: programme || undefined,
        description: description || undefined,
      });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form
      onSubmit={soumettre}
      className="space-y-3 rounded-xl border border-germe-ink/10 bg-white p-4"
    >
      <p className="text-sm font-semibold text-germe-ink">Nouveau module</p>
      <input
        autoFocus
        required
        placeholder="Titre du module"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-4 py-2 text-sm focus:border-germe-blue focus:outline-none"
      />
      <FormulairePresentation
        image={image}
        setImage={setImage}
        video={video}
        setVideo={setVideo}
        texte1={description}
        setTexte1={setDescription}
        labelTexte1="Description du module (facultatif)"
        texte2={programme}
        setTexte2={setProgramme}
        labelTexte2="Programme du module — toujours consultable par l'apprenant, même en formation payante"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onAnnuler}
          className="rounded-full px-4 py-2 text-sm font-medium text-germe-ink/60 hover:text-germe-ink"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-germe-green px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {envoi ? "Création..." : "Créer le module"}
        </button>
      </div>
    </form>
  );
}

// ---------- Carte module ----------

function ModuleCard({
  module: m,
  ouvert,
  onToggleOuvert,
  onSupprimer,
  onRecharger,
}: {
  module: ModulePedagogique;
  ouvert: boolean;
  onToggleOuvert: () => void;
  onSupprimer: () => void;
  onRecharger: () => void;
}) {
  const [onglet, setOnglet] = useState<"presentation" | "chapitres" | "test">(
    "chapitres",
  );
  const [chapitreOuvert, setChapitreOuvert] = useState<string | null>(null);
  const [ajoutChapitreOuvert, setAjoutChapitreOuvert] = useState(false);

  async function ajouterChapitre(data: {
    titre: string;
    imagePresentation?: string;
    videoPresentation?: string;
    description?: string;
  }) {
    const cree = await formationsApi.ajouterChapitre(m.id, data);
    setAjoutChapitreOuvert(false);
    onRecharger();
    setChapitreOuvert(cree.id);
  }

  async function supprimerChapitre(chapitreId: string) {
    if (!confirm("Supprimer ce chapitre et tout son contenu ?")) return;
    await formationsApi.supprimerChapitre(chapitreId);
    if (chapitreOuvert === chapitreId) setChapitreOuvert(null);
    onRecharger();
  }

  return (
    <div className="rounded-xl border border-germe-ink/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggleOuvert}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
      >
        <div className="min-w-0">
          <p className="font-display font-semibold text-germe-blue">
            {m.titre}
          </p>
          <p className="text-xs text-germe-ink/40">
            {m.chapitres.length} chapitre{m.chapitres.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="shrink-0 text-germe-ink/40">{ouvert ? "▾" : "▸"}</span>
      </button>

      {ouvert && (
        <div className="border-t border-germe-ink/10 px-4 pb-4 pt-3 sm:px-5">
          {/* Onglets */}
          <div className="mb-3 flex flex-wrap gap-1 rounded-lg bg-germe-cream p-1 text-xs font-medium">
            {(
              [
                ["presentation", "Présentation"],
                ["chapitres", `Chapitres (${m.chapitres.length})`],
                ["test", "Test du module"],
              ] as const
            ).map(([cle, label]) => (
              <button
                key={cle}
                type="button"
                onClick={() => setOnglet(cle)}
                className={`rounded-md px-3 py-1.5 transition ${
                  onglet === cle
                    ? "bg-white text-germe-blue shadow-sm"
                    : "text-germe-ink/50 hover:text-germe-ink"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={onSupprimer}
              className="ml-auto rounded-md px-3 py-1.5 text-red-500 hover:bg-red-50"
            >
              Supprimer le module
            </button>
          </div>

          {onglet === "presentation" && (
            <ModulePresentation module={m} onRecharger={onRecharger} />
          )}

          {onglet === "chapitres" && (
            <div className="space-y-2">
              {m.chapitres.map((c) => (
                <ChapitreCard
                  key={c.id}
                  chapitre={c}
                  ouvert={chapitreOuvert === c.id}
                  onToggleOuvert={() =>
                    setChapitreOuvert(chapitreOuvert === c.id ? null : c.id)
                  }
                  onSupprimer={() => supprimerChapitre(c.id)}
                  onRecharger={onRecharger}
                />
              ))}

              {ajoutChapitreOuvert ? (
                <FormulaireAjoutChapitre
                  onAnnuler={() => setAjoutChapitreOuvert(false)}
                  onValider={ajouterChapitre}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAjoutChapitreOuvert(true)}
                  className="w-full rounded-lg border-2 border-dashed border-germe-ink/15 py-2.5 text-xs font-medium text-germe-ink/50 hover:border-germe-blue hover:text-germe-blue"
                >
                  + Ajouter un chapitre
                </button>
              )}
            </div>
          )}

          {onglet === "test" && (
            <TestManager
              titre="Questions du test obligatoire de fin de module"
              couleur="germe-green"
              obtenirTest={() => testsModuleApi.obtenirPourAdmin(m.id)}
              ajouterQuestion={(q, o) =>
                testsModuleApi.ajouterQuestion(m.id, { question: q, options: o })
              }
              modifierQuestion={(qid, q, o) =>
                testsModuleApi.modifierQuestion(qid, { question: q, options: o })
              }
              supprimerQuestion={(qid) => testsModuleApi.supprimerQuestion(qid)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ModulePresentation({
  module: m,
  onRecharger,
}: {
  module: ModulePedagogique;
  onRecharger: () => void;
}) {
  const [edition, setEdition] = useState(false);
  const [titre, setTitre] = useState(m.titre);
  const [image, setImage] = useState(m.imagePresentation ?? "");
  const [video, setVideo] = useState(m.videoPresentation ?? "");
  const [description, setDescription] = useState(m.description ?? "");
  const [programme, setProgramme] = useState(m.programme ?? "");
  const [envoi, setEnvoi] = useState(false);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await formationsApi.modifierModule(m.id, {
        titre,
        imagePresentation: image || undefined,
        videoPresentation: video || undefined,
        description: description || undefined,
        programme: programme || undefined,
      });
      setEdition(false);
      onRecharger();
    } finally {
      setEnvoi(false);
    }
  }

  if (!edition) {
    const rien = !m.description && !m.programme && !m.imagePresentation && !m.videoPresentation;
    return (
      <div className="space-y-3">
        {rien ? (
          <p className="text-xs text-germe-ink/40">Aucune présentation renseignée.</p>
        ) : (
          <>
            {m.videoPresentation && (
              <video src={m.videoPresentation} controls className="aspect-video w-full max-w-sm rounded-lg" />
            )}
            {!m.videoPresentation && m.imagePresentation && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.imagePresentation} alt="" className="aspect-video w-full max-w-sm rounded-lg object-cover" />
            )}
            {m.description && (
              <div>
                <p className="text-[11px] font-medium text-germe-ink/40">Description</p>
                <RichText texte={m.description} className="text-sm text-germe-ink/80" />
              </div>
            )}
            {m.programme && (
              <div>
                <p className="text-[11px] font-medium text-germe-ink/40">Programme</p>
                <RichText texte={m.programme} className="text-sm text-germe-ink/80" />
              </div>
            )}
          </>
        )}
        <button
          type="button"
          onClick={() => setEdition(true)}
          className="text-xs font-medium text-germe-blue hover:underline"
        >
          ✎ Modifier
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enregistrer} className="space-y-2">
      <input
        required
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre du module"
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      />
      <FormulairePresentation
        image={image}
        setImage={setImage}
        video={video}
        setVideo={setVideo}
        texte1={description}
        setTexte1={setDescription}
        labelTexte1="Description du module"
        texte2={programme}
        setTexte2={setProgramme}
        labelTexte2="Programme du module"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEdition(false)}
          className="rounded-full px-4 py-1.5 text-xs font-medium text-germe-ink/60 hover:text-germe-ink"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-germe-blue px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {envoi ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function FormulaireAjoutChapitre({
  onAnnuler,
  onValider,
}: {
  onAnnuler: () => void;
  onValider: (data: {
    titre: string;
    imagePresentation?: string;
    videoPresentation?: string;
    description?: string;
  }) => Promise<void>;
}) {
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await onValider({
        titre,
        imagePresentation: image || undefined,
        videoPresentation: video || undefined,
        description: description || undefined,
      });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form
      onSubmit={soumettre}
      className="space-y-2 rounded-lg border border-germe-ink/10 bg-germe-cream/40 p-3"
    >
      <input
        autoFocus
        required
        placeholder="Titre du chapitre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      />
      <FormulairePresentation
        image={image}
        setImage={setImage}
        video={video}
        setVideo={setVideo}
        texte1={description}
        setTexte1={setDescription}
        labelTexte1="Description du chapitre (facultatif)"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onAnnuler}
          className="rounded-full px-4 py-1.5 text-xs font-medium text-germe-ink/60 hover:text-germe-ink"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-germe-blue px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {envoi ? "Création..." : "Créer le chapitre"}
        </button>
      </div>
    </form>
  );
}

// ---------- Carte chapitre ----------

function ChapitreCard({
  chapitre: c,
  ouvert,
  onToggleOuvert,
  onSupprimer,
  onRecharger,
}: {
  chapitre: Chapitre;
  ouvert: boolean;
  onToggleOuvert: () => void;
  onSupprimer: () => void;
  onRecharger: () => void;
}) {
  const [onglet, setOnglet] = useState<"presentation" | "lecons" | "test">(
    "lecons",
  );
  const [leconOuverte, setLeconOuverte] = useState<string | null>(null);
  const [ajoutLeconOuvert, setAjoutLeconOuvert] = useState(false);

  async function ajouterLecon(data: {
    titre: string;
    dureeMin?: number;
    videoUrl?: string;
    blocs?: BlocContenu[];
  }) {
    const cree = await formationsApi.ajouterLecon(c.id, data);
    setAjoutLeconOuvert(false);
    onRecharger();
    setLeconOuverte(cree.id);
  }

  async function supprimerLecon(leconId: string) {
    if (!confirm("Supprimer cette leçon ?")) return;
    await formationsApi.supprimerLecon(leconId);
    if (leconOuverte === leconId) setLeconOuverte(null);
    onRecharger();
  }

  return (
    <div className="rounded-lg border border-germe-ink/10 bg-germe-cream/30">
      <button
        type="button"
        onClick={onToggleOuvert}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-germe-ink">{c.titre}</p>
          <p className="text-[11px] text-germe-ink/40">
            {c.lecons.length} leçon{c.lecons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="shrink-0 text-xs text-germe-ink/40">{ouvert ? "▾" : "▸"}</span>
      </button>

      {ouvert && (
        <div className="border-t border-germe-ink/10 px-3 pb-3 pt-2">
          <div className="mb-2 flex flex-wrap gap-1 rounded-lg bg-white p-1 text-[11px] font-medium">
            {(
              [
                ["presentation", "Présentation"],
                ["lecons", `Leçons (${c.lecons.length})`],
                ["test", "QCM obligatoire"],
              ] as const
            ).map(([cle, label]) => (
              <button
                key={cle}
                type="button"
                onClick={() => setOnglet(cle)}
                className={`rounded-md px-2.5 py-1 transition ${
                  onglet === cle
                    ? "bg-germe-blueLight text-germe-blue"
                    : "text-germe-ink/50 hover:text-germe-ink"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={onSupprimer}
              className="ml-auto rounded-md px-2.5 py-1 text-red-500 hover:bg-red-50"
            >
              Supprimer
            </button>
          </div>

          {onglet === "presentation" && (
            <ChapitrePresentation chapitre={c} onRecharger={onRecharger} />
          )}

          {onglet === "lecons" && (
            <div className="space-y-1.5">
              {c.lecons.map((l) => (
                <LeconRow
                  key={l.id}
                  lecon={l}
                  ouverte={leconOuverte === l.id}
                  onToggleOuverte={() =>
                    setLeconOuverte(leconOuverte === l.id ? null : l.id)
                  }
                  onSupprimer={() => supprimerLecon(l.id)}
                  onRecharger={onRecharger}
                />
              ))}

              {ajoutLeconOuvert ? (
                <FormulaireAjoutLecon
                  onAnnuler={() => setAjoutLeconOuvert(false)}
                  onValider={ajouterLecon}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAjoutLeconOuvert(true)}
                  className="w-full rounded-lg border-2 border-dashed border-germe-ink/15 py-2 text-xs font-medium text-germe-ink/50 hover:border-germe-green hover:text-germe-green"
                >
                  + Ajouter une leçon
                </button>
              )}
            </div>
          )}

          {onglet === "test" && (
            <TestManager
              titre="Questions du QCM de fin de chapitre (obligatoire)"
              couleur="germe-blue"
              obtenirTest={() => testsChapitreApi.obtenirPourAdmin(c.id)}
              ajouterQuestion={(q, o) =>
                testsChapitreApi.ajouterQuestion(c.id, { question: q, options: o })
              }
              modifierQuestion={(qid, q, o) =>
                testsChapitreApi.modifierQuestion(qid, { question: q, options: o })
              }
              supprimerQuestion={(qid) => testsChapitreApi.supprimerQuestion(qid)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ChapitrePresentation({
  chapitre: c,
  onRecharger,
}: {
  chapitre: Chapitre;
  onRecharger: () => void;
}) {
  const [edition, setEdition] = useState(false);
  const [titre, setTitre] = useState(c.titre);
  const [image, setImage] = useState(c.imagePresentation ?? "");
  const [video, setVideo] = useState(c.videoPresentation ?? "");
  const [description, setDescription] = useState(c.description ?? "");
  const [dateLimite, setDateLimite] = useState(versInputDate(c.dateLimite));
  const [envoi, setEnvoi] = useState(false);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await formationsApi.modifierChapitre(c.id, {
        titre,
        imagePresentation: image || undefined,
        videoPresentation: video || undefined,
        description: description || undefined,
        dateLimite: depuisInputDate(dateLimite),
      });
      setEdition(false);
      onRecharger();
    } finally {
      setEnvoi(false);
    }
  }

  if (!edition) {
    const rien = !c.description && !c.imagePresentation && !c.videoPresentation;
    return (
      <div className="space-y-2">
        {c.dateLimite && (
          <p
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              new Date(c.dateLimite) < new Date()
                ? "bg-red-100 text-red-700"
                : "bg-germe-wheat/40 text-germe-ink/70"
            }`}
          >
            ⏰ {new Date(c.dateLimite) < new Date() ? "Fermé depuis le" : "Accessible jusqu'au"}{" "}
            {new Date(c.dateLimite).toLocaleString("fr-FR")}
          </p>
        )}
        {rien ? (
          <p className="text-xs text-germe-ink/40">Aucune présentation renseignée.</p>
        ) : (
          <>
            {c.videoPresentation && (
              <video src={c.videoPresentation} controls className="aspect-video w-full max-w-sm rounded-lg" />
            )}
            {!c.videoPresentation && c.imagePresentation && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.imagePresentation} alt="" className="aspect-video w-full max-w-sm rounded-lg object-cover" />
            )}
            {c.description && <RichText texte={c.description} className="text-sm text-germe-ink/80" />}
          </>
        )}
        <button
          type="button"
          onClick={() => setEdition(true)}
          className="text-xs font-medium text-germe-blue hover:underline"
        >
          ✎ Modifier
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enregistrer} className="space-y-2">
      <input
        required
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      />
      <FormulairePresentation
        image={image}
        setImage={setImage}
        video={video}
        setVideo={setVideo}
        texte1={description}
        setTexte1={setDescription}
        labelTexte1="Description du chapitre"
      />
      <label className="block">
        <span className="text-[11px] font-medium text-germe-ink/50">
          Échéance (facultatif) — passée cette date/heure, le chapitre cesse
          d'être accessible
        </span>
        <input
          type="datetime-local"
          value={dateLimite}
          onChange={(e) => setDateLimite(e.target.value)}
          className="mt-0.5 w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
        />
      </label>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEdition(false)}
          className="rounded-full px-4 py-1.5 text-xs font-medium text-germe-ink/60 hover:text-germe-ink"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-germe-blue px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {envoi ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function FormulaireAjoutLecon({
  onAnnuler,
  onValider,
}: {
  onAnnuler: () => void;
  onValider: (data: {
    titre: string;
    dureeMin?: number;
    videoUrl?: string;
    blocs?: BlocContenu[];
  }) => Promise<void>;
}) {
  const [titre, setTitre] = useState("");
  const [duree, setDuree] = useState(10);
  const [blocs, setBlocs] = useState<BlocContenu[]>([]);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await onValider({ titre, dureeMin: duree || undefined, blocs });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form
      onSubmit={soumettre}
      className="space-y-2 rounded-lg border border-germe-ink/10 bg-white p-3"
    >
      <div className="flex gap-2">
        <input
          autoFocus
          required
          placeholder="Titre de la leçon"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
        />
        <input
          type="number"
          min={1}
          value={duree}
          onChange={(e) => setDuree(Number(e.target.value))}
          className="w-24 shrink-0 rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
        />
      </div>
      <EditeurBlocs blocs={blocs} setBlocs={setBlocs} />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onAnnuler}
          className="rounded-full px-4 py-1.5 text-xs font-medium text-germe-ink/60 hover:text-germe-ink"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-germe-green px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {envoi ? "Création..." : "Créer la leçon"}
        </button>
      </div>
    </form>
  );
}

// ---------- Ligne leçon ----------

function LeconRow({
  lecon: l,
  ouverte,
  onToggleOuverte,
  onSupprimer,
  onRecharger,
}: {
  lecon: Lecon;
  ouverte: boolean;
  onToggleOuverte: () => void;
  onSupprimer: () => void;
  onRecharger: () => void;
}) {
  const [titre, setTitre] = useState(l.titre);
  const [duree, setDuree] = useState(l.dureeMin);
  const [blocs, setBlocs] = useState<BlocContenu[]>(l.blocs ?? []);
  const [envoi, setEnvoi] = useState(false);
  const [exerciceOuvert, setExerciceOuvert] = useState(false);
  const [typeExercice, setTypeExercice] = useState<"qcm" | "texte_libre">("qcm");

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await formationsApi.modifierLecon(l.id, {
        titre,
        dureeMin: duree,
        blocs,
      });
      onRecharger();
    } finally {
      setEnvoi(false);
    }
  }

  async function ajouterExercice(
    question: string,
    options: { id: string; texte: string; correcte: boolean }[],
  ) {
    await formationsApi.ajouterExercice(l.id, { question, type: "qcm", options });
    setExerciceOuvert(false);
    onRecharger();
  }

  async function ajouterExerciceLibre(consigne: string) {
    await formationsApi.ajouterExercice(l.id, {
      question: consigne,
      type: "texte_libre",
    });
    setExerciceOuvert(false);
    onRecharger();
  }

  async function supprimerExercice(exerciceId: string) {
    await formationsApi.supprimerExercice(exerciceId);
    onRecharger();
  }

  if (!ouverte) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2">
        <button
          type="button"
          onClick={onToggleOuverte}
          className="min-w-0 flex-1 text-left"
        >
          <p className="truncate text-sm text-germe-ink">{l.titre}</p>
          <p className="text-[11px] text-germe-ink/40">
            {l.dureeMin} min · {(l.blocs?.length ?? 0)} bloc
            {(l.blocs?.length ?? 0) !== 1 ? "s" : ""} · {l.exercices.length} QCM
          </p>
        </button>
        <button
          type="button"
          onClick={onSupprimer}
          className="shrink-0 text-[11px] font-medium text-red-500 hover:underline"
        >
          Suppr.
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-germe-ink/10 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleOuverte}
          className="text-xs font-medium text-germe-ink/50 hover:text-germe-ink"
        >
          ▾ Replier
        </button>
        <button
          type="button"
          onClick={onSupprimer}
          className="text-[11px] font-medium text-red-500 hover:underline"
        >
          Supprimer la leçon
        </button>
      </div>

      <form onSubmit={enregistrer} className="space-y-2">
        <div className="flex gap-2">
          <input
            required
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
          />
          <input
            type="number"
            min={1}
            value={duree}
            onChange={(e) => setDuree(Number(e.target.value))}
            className="w-24 shrink-0 rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
          />
        </div>
        <EditeurBlocs blocs={blocs} setBlocs={setBlocs} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={envoi}
            className="rounded-full bg-germe-blue px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {envoi ? "Enregistrement..." : "Enregistrer la leçon"}
          </button>
        </div>
      </form>

      <div className="mt-3 border-t border-germe-ink/10 pt-2">
        <p className="text-[11px] font-medium text-germe-ink/50">
          Exercice facultatif de fin de leçon
        </p>
        {l.exercices.length > 0 && (
          <ul className="mt-1 space-y-1">
            {l.exercices.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center justify-between gap-2 rounded-md bg-germe-cream px-2 py-1 text-xs text-germe-ink/70"
              >
                <span>
                  {ex.question}{" "}
                  {ex.type === "texte_libre" && (
                    <span className="text-germe-ink/40">(réponse libre)</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => supprimerExercice(ex.id)}
                  className="shrink-0 text-germe-ink/40 hover:text-red-600"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        {exerciceOuvert ? (
          <div className="mt-2 space-y-2">
            <div className="flex gap-1 rounded-lg bg-germe-cream p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTypeExercice("qcm")}
                className={`flex-1 rounded-md py-1.5 transition ${typeExercice === "qcm" ? "bg-white text-germe-green shadow-sm" : "text-germe-ink/50"}`}
              >
                QCM
              </button>
              <button
                type="button"
                onClick={() => setTypeExercice("texte_libre")}
                className={`flex-1 rounded-md py-1.5 transition ${typeExercice === "texte_libre" ? "bg-white text-germe-green shadow-sm" : "text-germe-ink/50"}`}
              >
                Réponse libre (rédaction)
              </button>
            </div>

            {typeExercice === "qcm" ? (
              <QcmBuilder
                boutonLabel="Ajouter le QCM"
                onAjouter={ajouterExercice}
                onAnnuler={() => setExerciceOuvert(false)}
              />
            ) : (
              <FormulaireExerciceLibre
                onAjouter={ajouterExerciceLibre}
                onAnnuler={() => setExerciceOuvert(false)}
              />
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setExerciceOuvert(true)}
            className="mt-1 text-xs font-medium text-germe-green hover:underline"
          >
            + Ajouter un exercice de fin de leçon
          </button>
        )}
      </div>
    </div>
  );
}

function FormulaireExerciceLibre({
  onAjouter,
  onAnnuler,
}: {
  onAjouter: (consigne: string) => Promise<void>;
  onAnnuler: () => void;
}) {
  const [consigne, setConsigne] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await onAjouter(consigne);
      setConsigne("");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form
      onSubmit={soumettre}
      className="space-y-2 rounded-lg border border-dashed border-germe-ink/20 p-3"
    >
      <textarea
        required
        rows={2}
        placeholder="Consigne (ex : Rédigez un extrait de votre business plan pour ce secteur)"
        value={consigne}
        onChange={(e) => setConsigne(e.target.value)}
        className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-sm focus:border-germe-blue focus:outline-none"
      />
      <p className="text-[11px] text-germe-ink/45">
        L'apprenant rédigera une réponse libre, que vous corrigerez ensuite
        depuis « Corrections » dans le menu admin.
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onAnnuler}
          className="text-xs font-medium text-germe-ink/50 hover:text-germe-ink"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={envoi}
          className="rounded-lg bg-germe-green px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {envoi ? "Ajout..." : "Ajouter l'exercice"}
        </button>
      </div>
    </form>
  );
}
