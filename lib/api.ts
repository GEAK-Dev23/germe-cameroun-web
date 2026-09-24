// Point d'appel unique vers l'API NestJS. Toujours un chemin relatif
// ("/api"), servi par le même domaine que le frontend grâce au rewrite de
// next.config.js — c'est ce qui permet au cookie de connexion posé par
// l'API d'être lu par le middleware (proxy.ts) même quand l'API tourne en
// réalité sur un autre domaine (Render). Ne pointez jamais cette variable
// directement vers le domaine de l'API en production : voir
// API_INTERNAL_URL dans .env.example pour la vraie destination.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

async function appelApi<T>(
  chemin: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${chemin}`, {
    ...options,
    credentials: "include", // indispensable : envoie/reçoit le cookie httpOnly
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message ?? "Une erreur est survenue.", res.status);
  }

  return data as T;
}

export type Utilisateur = {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "admin" | "formateur" | "apprenant";
  bio?: string | null;
  secteur?: string | null;
  visibleReseau?: boolean;
  telephoneReseau?: string | null;
};

export const authApi = {
  signup: (data: { fullName: string; email: string; password: string }) =>
    appelApi<{ utilisateur: Utilisateur }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    appelApi<{ utilisateur: Utilisateur }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => appelApi<{ ok: true }>("/auth/logout", { method: "POST" }),

  me: () => appelApi<{ utilisateur: Utilisateur }>("/auth/me"),
};

export type Formation = {
  id: string;
  titre: string;
  slug: string;
  description: string | null;
  imageCouverture: string | null;
  categorie: string;
  estPayant: boolean;
  prixFcfa: number;
  publie: boolean;
  formationPrerequiseId: string | null;
  // Programmation en session (facultative) — null = formation en libre accès.
  dateOuvertureInscriptions: string | null;
  dateFermetureInscriptions: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  formateurs?: { id: string; fullName: string }[];
  createdAt: string;
};

export type Exercice = {
  id: string;
  question: string;
  type: string;
  options: unknown;
  ordre: number;
};

// Média (photo ou vidéo) inséré à un endroit précis du contenu d'une leçon.
// Conservé pour compatibilité avec les leçons créées avant "BlocContenu".
export type MediaLecon = {
  id: string;
  type: "photo" | "video";
  url: string;
  legende?: string;
};

// Bloc de contenu ordonné d'une leçon : permet d'alterner librement texte
// et médias (texte avant et/ou après chaque photo/vidéo/document). Le
// champ "texte" peut contenir la mise en forme enrichie (lib/richtext).
export type BlocContenu =
  | { id: string; type: "texte"; texte: string }
  | { id: string; type: "photo"; url: string; legende?: string }
  | { id: string; type: "video"; url: string; legende?: string }
  | { id: string; type: "document"; url: string; legende?: string };

export type Lecon = {
  id: string;
  titre: string;
  videoUrl: string | null;
  contenuTexte: string | null;
  dureeMin: number;
  ordre: number;
  medias: MediaLecon[] | null;
  blocs: BlocContenu[] | null;
  exercices: Exercice[];
};

export type Chapitre = {
  id: string;
  titre: string;
  ordre: number;
  imagePresentation: string | null;
  videoPresentation: string | null;
  description: string | null;
  dateLimite: string | null;
  lecons: Lecon[];
};

export type ModulePedagogique = {
  id: string;
  titre: string;
  ordre: number;
  imagePresentation: string | null;
  videoPresentation: string | null;
  programme: string | null;
  description: string | null;
  chapitres: Chapitre[];
};

export type FormationAvecCurriculum = Formation & {
  modules: ModulePedagogique[];
};

type ChampsPresentationModule = {
  imagePresentation?: string;
  videoPresentation?: string;
  programme?: string;
  description?: string;
};

type ChampsPresentationChapitre = {
  imagePresentation?: string;
  videoPresentation?: string;
  description?: string;
  // "null" explicite retire l'échéance existante ; absent = inchangée.
  dateLimite?: string | null;
};

export const formationsApi = {
  listerPubliees: () => appelApi<Formation[]>("/formations"),

  listerToutes: () => appelApi<Formation[]>("/formations/admin/toutes"),

  obtenirUne: (id: string) =>
    appelApi<FormationAvecCurriculum>(`/formations/${id}`),

  creer: (data: {
    titre: string;
    description?: string;
    categorie?: string;
    imageCouverture?: string;
    estPayant?: boolean;
    prixFcfa?: number;
    formationPrerequiseId?: string;
    dateOuvertureInscriptions?: string;
    dateFermetureInscriptions?: string;
    dateDebut?: string;
    dateFin?: string;
    formateurIds?: string[];
  }) =>
    appelApi<Formation>("/formations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifier: (
    id: string,
    data: Partial<Omit<Formation, "formationPrerequiseId" | "formateurs">> & {
      formationPrerequiseId?: string | null;
      formateurIds?: string[];
    },
  ) =>
    appelApi<Formation>(`/formations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimer: (id: string) =>
    appelApi<void>(`/formations/${id}`, { method: "DELETE" }),

  ajouterModule: (
    formationId: string,
    data: { titre: string } & ChampsPresentationModule,
  ) =>
    appelApi<ModulePedagogique>(`/formations/${formationId}/modules`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifierModule: (
    id: string,
    data: { titre: string } & ChampsPresentationModule,
  ) =>
    appelApi<ModulePedagogique>(`/modules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimerModule: (id: string) =>
    appelApi<void>(`/modules/${id}`, { method: "DELETE" }),

  ajouterChapitre: (
    moduleId: string,
    data: { titre: string } & ChampsPresentationChapitre,
  ) =>
    appelApi<Chapitre>(`/modules/${moduleId}/chapitres`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifierChapitre: (
    id: string,
    data: { titre: string } & ChampsPresentationChapitre,
  ) =>
    appelApi<Chapitre>(`/chapitres/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimerChapitre: (id: string) =>
    appelApi<void>(`/chapitres/${id}`, { method: "DELETE" }),

  ajouterLecon: (
    chapitreId: string,
    data: {
      titre: string;
      contenuTexte?: string;
      videoUrl?: string;
      dureeMin?: number;
      medias?: MediaLecon[];
      blocs?: BlocContenu[];
    },
  ) =>
    appelApi<Lecon>(`/chapitres/${chapitreId}/lecons`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifierLecon: (
    id: string,
    data: {
      titre: string;
      contenuTexte?: string;
      videoUrl?: string;
      dureeMin?: number;
      medias?: MediaLecon[];
      blocs?: BlocContenu[];
    },
  ) =>
    appelApi<Lecon>(`/lecons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimerLecon: (id: string) =>
    appelApi<void>(`/lecons/${id}`, { method: "DELETE" }),

  ajouterExercice: (
    leconId: string,
    data: {
      question: string;
      type?: "qcm" | "texte_libre";
      options?: { id: string; texte: string; correcte: boolean }[];
    },
  ) =>
    appelApi<Exercice>(`/lecons/${leconId}/exercices`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  supprimerExercice: (id: string) =>
    appelApi<void>(`/exercices/${id}`, { method: "DELETE" }),
};

// ---------- Fichiers (images/vidéos) ----------

export const uploadsApi = {
  // Envoie un fichier (image ou vidéo) et renvoie son URL publique. Ne
  // passe pas par appelApi() : le corps est un FormData multipart, pas du
  // JSON (le navigateur pose lui-même l'en-tête Content-Type/boundary).
  televerser: async (file: File): Promise<{ url: string }> => {
    const corps = new FormData();
    corps.append("file", file);

    const res = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      credentials: "include",
      body: corps,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new ApiError(
        data?.message ?? "Impossible de téléverser ce fichier.",
        res.status,
      );
    }
    return data as { url: string };
  },
};

// ---------- Progression, tests, certificats ----------

export type Progression = {
  totalExercices: number;
  exercicesReussis: number;
};

export type EtatChapitre = {
  chapitreId: string;
  debloque: boolean;
  expire: boolean;
  accessible: boolean;
  dateLimite: string | null;
  testExiste: boolean;
  testReussi: boolean;
  meilleurScore: number | null;
};

export type EtatModule = {
  moduleId: string;
  debloque: boolean;
  chapitres: EtatChapitre[];
  testModuleExiste: boolean;
  testModuleDebloque: boolean;
  testModuleReussi: boolean;
};

export type EtatExamenFinal = {
  existe: boolean;
  debloque: boolean;
  reussi: boolean;
};

export type EtatFormation = {
  modules: EtatModule[];
  examenFinal: EtatExamenFinal;
  attestationDebloquee: boolean;
};

export type QuestionTestApprenant = {
  id: string;
  question: string;
  options: { id: string; texte: string }[];
};

export type TestApprenant = {
  id: string;
  titre: string;
  questions: QuestionTestApprenant[];
};

export type ResultatSoumission = {
  score: number;
  reussi: boolean;
  seuilRequis: number;
  // Uniquement pertinent pour un test de MODULE : indique que ce module
  // était le dernier maillon manquant et que l'attestation de la formation
  // peut désormais être générée (voir certificatsApi.creer).
  attestationDebloquee?: boolean;
};

export type Certificat = {
  id: string;
  formationId: string;
  nomComplet: string;
  codeVerification: string;
  delivreLe: string;
};

export type SoumissionExercice = {
  id: string;
  apprenantId: string;
  exerciceId: string;
  reussi: boolean;
  reponse: unknown;
  statutCorrection: "auto" | "en_attente" | "corrige";
  commentaireCorrecteur: string | null;
  corrigeLe: string | null;
  valideLe: string;
};

export const progressionApi = {
  repondreExercice: (exerciceId: string, reponse: unknown) =>
    appelApi<{
      reussi: boolean;
      bonneReponse: string | null;
      statutCorrection: "auto" | "en_attente";
    }>(`/exercices/${exerciceId}/repondre`, {
      method: "POST",
      body: JSON.stringify({ reponse }),
    }),

  obtenirMaSoumission: (exerciceId: string) =>
    appelApi<SoumissionExercice | null>(`/exercices/${exerciceId}/ma-soumission`),

  obtenirProgression: (formationId: string) =>
    appelApi<Progression>(`/formations/${formationId}/progression`),

  obtenirEtat: (formationId: string) =>
    appelApi<EtatFormation>(`/formations/${formationId}/etat`),

  // Formations avec lesquelles l'apprenant connecté a une activité
  // enregistrée — alimente la page "Mes formations" du menu.
  mesFormations: () =>
    appelApi<{ formation: FormationAvecCurriculum; etat: EtatFormation }[]>(
      "/mes-formations",
    ),

  // Utilisé pour griser/débloquer Ressources, Simulateur rapide,
  // Webinaires, Réseau et Messages dans le menu et sur leurs pages.
  eligibiliteFonctionnalites: () =>
    appelApi<{ eligible: boolean }>("/eligibilite-fonctionnalites"),
};

// Correction des exercices à réponse libre (rédaction) — équipe pédagogique.
export type SoumissionACorreger = {
  id: string;
  apprenantId: string;
  exerciceId: string;
  question: string;
  reponse: unknown;
  valideLe: string;
  leconTitre: string | null;
  formationId: string | null;
};

export const correctionsApi = {
  lister: () => appelApi<SoumissionACorreger[]>("/admin/exercices-a-corriger"),

  corriger: (soumissionId: string, reussi: boolean, commentaire?: string) =>
    appelApi<SoumissionExercice>(`/admin/exercices/${soumissionId}/corriger`, {
      method: "POST",
      body: JSON.stringify({ reussi, commentaire }),
    }),
};

type OptionQcmAdmin = { id: string; texte: string; correcte: boolean };

export type QuestionTestAdmin = {
  id: string;
  question: string;
  options: OptionQcmAdmin[];
  ordre: number;
};

export type TestAdmin = {
  id: string;
  titre: string;
  seuilReussite: number;
  questions: QuestionTestAdmin[];
};

// Test obligatoire de fin de MODULE.
export const testsModuleApi = {
  obtenirPourAdmin: (moduleId: string) =>
    appelApi<TestAdmin>(`/modules/${moduleId}/test-final/admin`),

  obtenirPourApprenant: (moduleId: string) =>
    appelApi<TestApprenant>(`/modules/${moduleId}/test-final`),

  soumettre: (testId: string, reponses: Record<string, string>) =>
    appelApi<ResultatSoumission>(`/tests-finaux/${testId}/soumettre`, {
      method: "POST",
      body: JSON.stringify({ reponses }),
    }),

  // Réservé à l'équipe pédagogique
  configurer: (moduleId: string, data: { titre?: string; seuilReussite?: number }) =>
    appelApi<unknown>(`/modules/${moduleId}/test-final`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  ajouterQuestion: (
    moduleId: string,
    data: { question: string; options: OptionQcmAdmin[] },
  ) =>
    appelApi<unknown>(`/modules/${moduleId}/test-final/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifierQuestion: (
    id: string,
    data: { question: string; options: OptionQcmAdmin[] },
  ) =>
    appelApi<unknown>(`/questions-test-final/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimerQuestion: (id: string) =>
    appelApi<void>(`/questions-test-final/${id}`, { method: "DELETE" }),
};

// QCM obligatoire de fin de CHAPITRE.
export const testsChapitreApi = {
  obtenirPourAdmin: (chapitreId: string) =>
    appelApi<TestAdmin>(`/chapitres/${chapitreId}/test/admin`),

  obtenirPourApprenant: (chapitreId: string) =>
    appelApi<TestApprenant>(`/chapitres/${chapitreId}/test`),

  soumettre: (testId: string, reponses: Record<string, string>) =>
    appelApi<ResultatSoumission>(`/tests-chapitres/${testId}/soumettre`, {
      method: "POST",
      body: JSON.stringify({ reponses }),
    }),

  // Réservé à l'équipe pédagogique
  configurer: (chapitreId: string, data: { titre?: string; seuilReussite?: number }) =>
    appelApi<unknown>(`/chapitres/${chapitreId}/test`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  ajouterQuestion: (
    chapitreId: string,
    data: { question: string; options: OptionQcmAdmin[] },
  ) =>
    appelApi<unknown>(`/chapitres/${chapitreId}/test/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifierQuestion: (
    id: string,
    data: { question: string; options: OptionQcmAdmin[] },
  ) =>
    appelApi<unknown>(`/questions-test-chapitre/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimerQuestion: (id: string) =>
    appelApi<void>(`/questions-test-chapitre/${id}`, { method: "DELETE" }),
};

// Examen final de la FORMATION ENTIÈRE — distinct du test de fin de
// MODULE (testsModuleApi). Dernier verrou avant l'attestation : ne se
// débloque qu'une fois tous les modules de la formation réussis.
export const examenFinalApi = {
  obtenirPourAdmin: (formationId: string) =>
    appelApi<TestAdmin>(`/formations/${formationId}/test-final/admin`),

  obtenirPourApprenant: (formationId: string) =>
    appelApi<TestApprenant>(`/formations/${formationId}/test-final`),

  soumettre: (testId: string, reponses: Record<string, string>) =>
    appelApi<ResultatSoumission>(`/examens-finaux/${testId}/soumettre`, {
      method: "POST",
      body: JSON.stringify({ reponses }),
    }),

  // Réservé à l'équipe pédagogique
  configurer: (formationId: string, data: { titre?: string; seuilReussite?: number }) =>
    appelApi<unknown>(`/formations/${formationId}/test-final`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  ajouterQuestion: (
    formationId: string,
    data: { question: string; options: OptionQcmAdmin[] },
  ) =>
    appelApi<unknown>(`/formations/${formationId}/test-final/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifierQuestion: (
    id: string,
    data: { question: string; options: OptionQcmAdmin[] },
  ) =>
    appelApi<unknown>(`/questions-examen-final/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimerQuestion: (id: string) =>
    appelApi<void>(`/questions-examen-final/${id}`, { method: "DELETE" }),
};

export const certificatsApi = {
  // Génère (ou récupère, si déjà créé) le certificat de la formation, avec
  // le nom complet choisi par l'apprenant pour y figurer.
  creer: (formationId: string, nomComplet: string) =>
    appelApi<Certificat>(`/formations/${formationId}/certificat`, {
      method: "POST",
      body: JSON.stringify({ nomComplet }),
    }),

  mesCertificats: () => appelApi<Certificat[]>("/certificats/mes-certificats"),

  urlTelechargement: (id: string) => `${API_URL}/certificats/${id}/telecharger`,

  verifier: (code: string) =>
    appelApi<
      | {
          valide: true;
          apprenantNom: string;
          formationTitre: string;
          delivreLe: string;
        }
      | { valide: false }
    >(`/certificats/verifier/${code}`),
};

// ---------- Paiements / inscription ----------

export type AccesFormation = {
  acces: boolean;
  motif?: string;
  type?:
    | "prerequis"
    | "paiement"
    | "inscription_requise"
    | "inscriptions_pas_ouvertes"
    | "inscriptions_fermees"
    | "pas_commencee"
    | "formation_terminee";
  formationPrerequiseId?: string;
  formationPrerequiseTitre?: string;
  dateReference?: string;
};

export const paiementsApi = {
  verifierAcces: (formationId: string) =>
    appelApi<AccesFormation>(`/formations/${formationId}/acces`),

  inscrireOuPayer: (formationId: string) =>
    appelApi<{ dejaInscrit: boolean; paiementUrl: string | null }>(
      `/formations/${formationId}/inscription`,
      { method: "POST" },
    ),
};

// ---------- Messagerie ----------

export type Message = {
  id: string;
  contenu: string;
  createdAt: string;
  auteurId: string;
  auteurNom: string;
  auteurRole: "super_admin" | "admin" | "formateur" | "apprenant";
};

export const messagerieApi = {
  lister: (formationId: string) =>
    appelApi<Message[]>(`/formations/${formationId}/messages`),

  poster: (formationId: string, contenu: string) =>
    appelApi<Message>(`/formations/${formationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ contenu }),
    }),
};

// ---------- Bibliothèque de ressources téléchargeables ----------

export type Ressource = {
  id: string;
  titre: string;
  description: string | null;
  fichierUrl: string;
  categorie: string;
  formations: { id: string; titre: string }[];
  createdAt: string;
};

export const ressourcesApi = {
  // Apprenant : uniquement les ressources des formations qu'il suit ou
  // a suivies (gated — 403 tant qu'aucune formation n'est commencée).
  lister: () => appelApi<Ressource[]>("/ressources"),

  // Admin : toutes les ressources, avec leurs formations.
  listerToutes: () => appelApi<Ressource[]>("/admin/ressources"),

  creer: (data: {
    titre: string;
    description?: string;
    fichierUrl: string;
    categorie?: string;
    formationIds: string[];
  }) =>
    appelApi<Ressource>("/ressources", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifier: (
    id: string,
    data: {
      titre: string;
      description?: string;
      fichierUrl: string;
      categorie?: string;
      formationIds: string[];
    },
  ) =>
    appelApi<Ressource>(`/ressources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimer: (id: string) =>
    appelApi<void>(`/ressources/${id}`, { method: "DELETE" }),
};

// ---------- Forum communautaire ----------

export type RoleUtilisateur = "super_admin" | "admin" | "formateur" | "apprenant";

export type SujetForum = {
  id: string;
  titre: string;
  contenu: string;
  auteurId: string;
  auteurNom: string;
  auteurRole: RoleUtilisateur;
  epingle: boolean;
  createdAt: string;
  nombreReponses: number;
};

export type ReponseForum = {
  id: string;
  sujetId: string;
  contenu: string;
  auteurId: string;
  auteurNom: string;
  auteurRole: RoleUtilisateur;
  createdAt: string;
};

export type SujetForumDetail = SujetForum & { reponses: ReponseForum[] };

export const forumApi = {
  listerSujets: () => appelApi<SujetForum[]>("/forum/sujets"),

  obtenirSujet: (id: string) =>
    appelApi<SujetForumDetail>(`/forum/sujets/${id}`),

  creerSujet: (titre: string, contenu: string) =>
    appelApi<SujetForum>("/forum/sujets", {
      method: "POST",
      body: JSON.stringify({ titre, contenu }),
    }),

  repondre: (sujetId: string, contenu: string) =>
    appelApi<ReponseForum>(`/forum/sujets/${sujetId}/reponses`, {
      method: "POST",
      body: JSON.stringify({ contenu }),
    }),

  basculerEpingle: (sujetId: string) =>
    appelApi<SujetForum>(`/forum/sujets/${sujetId}/epingle`, {
      method: "PATCH",
    }),

  supprimerSujet: (id: string) =>
    appelApi<void>(`/forum/sujets/${id}`, { method: "DELETE" }),

  supprimerReponse: (id: string) =>
    appelApi<void>(`/forum/reponses/${id}`, { method: "DELETE" }),
};

// ---------- Gestion des utilisateurs (admin) ----------

export type UtilisateurAdmin = Utilisateur & { createdAt?: string };

export const usersApi = {
  lister: () => appelApi<UtilisateurAdmin[]>("/users"),

  changerRole: (id: string, role: RoleUtilisateur) =>
    appelApi<UtilisateurAdmin>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};

// ---------- Profil et mise en réseau des entrepreneurs ----------

export type MembreReseau = {
  id: string;
  fullName: string;
  role: RoleUtilisateur;
  bio: string | null;
  secteur: string | null;
};

export const profilApi = {
  mettreAJour: (data: {
    bio?: string;
    secteur?: string;
    visibleReseau?: boolean;
    telephoneReseau?: string;
  }) =>
    appelApi<Utilisateur>("/profil", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Équipe pédagogique contactable (accompagnement personnalisé).
  personnel: () => appelApi<MembreReseau[]>("/personnel"),
};

export const reseauApi = {
  // Annuaire des entrepreneurs visibles — gated (403 tant qu'aucune
  // formation n'est commencée), jamais les coordonnées de contact.
  lister: () => appelApi<MembreReseau[]>("/reseau"),

  // Ne contacte jamais directement un membre : envoie une demande de
  // mise en relation à l'équipe pédagogique.
  contacter: (id: string, message?: string) =>
    appelApi<{ ok: true }>(`/reseau/${id}/contacter`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

// ---------- Messagerie privée (accompagnement personnalisé / mentorat) ----------

export type ConversationPrivee = {
  utilisateurId: string;
  nom: string;
  role: RoleUtilisateur | null;
  dernierMessage: string;
  dernierMessageLe: string;
  nonLus: number;
};

export type MessagePrive = {
  id: string;
  expediteurId: string;
  destinataireId: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
};

export type FilMessagesPrives = {
  correspondant: { id: string; nom: string; role: RoleUtilisateur };
  messages: MessagePrive[];
};

export type ContactsMessagerie = {
  parFormation: {
    formationId: string;
    formationTitre: string;
    formateurs: { id: string; fullName: string }[];
  }[];
  administration: { id: string; fullName: string }[];
};

export const messageriePriveeApi = {
  conversations: () =>
    appelApi<ConversationPrivee[]>("/messagerie-privee/conversations"),

  // Formateurs de mes formations + administration — pour la page
  // Messages, restructurée par formation.
  mesContacts: () =>
    appelApi<ContactsMessagerie>("/messagerie-privee/mes-contacts"),

  fil: (autreId: string) =>
    appelApi<FilMessagesPrives>(`/messagerie-privee/avec/${autreId}`),

  envoyer: (autreId: string, contenu: string) =>
    appelApi<MessagePrive>(`/messagerie-privee/avec/${autreId}`, {
      method: "POST",
      body: JSON.stringify({ contenu }),
    }),
};

// ---------- Suivi individualisé des apprenants (admin) ----------

export type ApprenantSuivi = {
  formationId: string;
  formationTitre: string;
  etat: EtatFormation;
};

export const suiviApi = {
  apprenants: () => appelApi<UtilisateurAdmin[]>("/admin/apprenants"),

  suivi: (apprenantId: string) =>
    appelApi<ApprenantSuivi[]>(`/admin/apprenants/${apprenantId}/suivi`),
};

// ---------- Notifications in-app ----------

export type NotificationItem = {
  id: string;
  titre: string;
  contenu: string;
  lien: string | null;
  lu: boolean;
  createdAt: string;
};

export const notificationsApi = {
  lister: () => appelApi<NotificationItem[]>("/notifications"),

  compterNonLues: () =>
    appelApi<{ total: number }>("/notifications/non-lues/compte"),

  marquerLue: (id: string) =>
    appelApi<{ ok: true }>(`/notifications/${id}/lu`, { method: "PATCH" }),

  marquerToutesLues: () =>
    appelApi<{ ok: true }>("/notifications/tout-lu", { method: "PATCH" }),
};

// ---------- Webinaires / classes virtuelles ----------

export type Webinaire = {
  id: string;
  titre: string;
  description: string | null;
  lienVisio: string;
  dateHeure: string;
  animePar: string | null;
  createdAt: string;
};

export const webinairesApi = {
  lister: () => appelApi<Webinaire[]>("/webinaires"),

  creer: (data: {
    titre: string;
    description?: string;
    lienVisio: string;
    dateHeure: string;
    animePar?: string;
  }) =>
    appelApi<Webinaire>("/webinaires", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifier: (
    id: string,
    data: {
      titre: string;
      description?: string;
      lienVisio: string;
      dateHeure: string;
      animePar?: string;
    },
  ) =>
    appelApi<Webinaire>(`/webinaires/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimer: (id: string) =>
    appelApi<void>(`/webinaires/${id}`, { method: "DELETE" }),
};

// ---------- Vitrine : blog, témoignages, offres partenaires ----------

export type Article = {
  id: string;
  titre: string;
  chapo: string;
  contenu: string;
  imageCouverture: string | null;
  auteurNom: string;
  publie: boolean;
  createdAt: string;
};

export type Temoignage = {
  id: string;
  nom: string;
  fonction: string;
  texte: string;
  photoUrl: string | null;
  publie: boolean;
  createdAt: string;
};

export type OffrePartenaire = {
  id: string;
  nomPartenaire: string;
  logoUrl: string | null;
  description: string;
  lienExterne: string | null;
  publie: boolean;
  createdAt: string;
};

export const vitrineApi = {
  // Public
  articles: () => appelApi<Article[]>("/articles"),
  article: (id: string) => appelApi<Article>(`/articles/${id}`),
  temoignages: () => appelApi<Temoignage[]>("/temoignages"),
  offresPartenaires: () => appelApi<OffrePartenaire[]>("/offres-partenaires"),

  // Admin — articles
  articlesAdmin: () => appelApi<Article[]>("/admin/articles"),
  creerArticle: (data: {
    titre: string;
    chapo: string;
    contenu: string;
    imageCouverture?: string;
    publie?: boolean;
  }) => appelApi<Article>("/articles", { method: "POST", body: JSON.stringify(data) }),
  modifierArticle: (
    id: string,
    data: {
      titre: string;
      chapo: string;
      contenu: string;
      imageCouverture?: string;
      publie?: boolean;
    },
  ) =>
    appelApi<Article>(`/articles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  supprimerArticle: (id: string) =>
    appelApi<void>(`/articles/${id}`, { method: "DELETE" }),

  // Admin — témoignages
  temoignagesAdmin: () => appelApi<Temoignage[]>("/admin/temoignages"),
  creerTemoignage: (data: {
    nom: string;
    fonction: string;
    texte: string;
    photoUrl?: string;
    publie?: boolean;
  }) =>
    appelApi<Temoignage>("/temoignages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  modifierTemoignage: (
    id: string,
    data: { nom: string; fonction: string; texte: string; photoUrl?: string; publie?: boolean },
  ) =>
    appelApi<Temoignage>(`/temoignages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  supprimerTemoignage: (id: string) =>
    appelApi<void>(`/temoignages/${id}`, { method: "DELETE" }),

  // Admin — offres partenaires
  offresAdmin: () => appelApi<OffrePartenaire[]>("/admin/offres-partenaires"),
  creerOffre: (data: {
    nomPartenaire: string;
    logoUrl?: string;
    description: string;
    lienExterne?: string;
    publie?: boolean;
  }) =>
    appelApi<OffrePartenaire>("/offres-partenaires", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  modifierOffre: (
    id: string,
    data: {
      nomPartenaire: string;
      logoUrl?: string;
      description: string;
      lienExterne?: string;
      publie?: boolean;
    },
  ) =>
    appelApi<OffrePartenaire>(`/offres-partenaires/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  supprimerOffre: (id: string) =>
    appelApi<void>(`/offres-partenaires/${id}`, { method: "DELETE" }),
};

// ---------- Statistiques (tableau de bord admin) ----------

export type Statistiques = {
  totalFormations: number;
  formationsPubliees: number;
  totalApprenants: number;
  totalFormateurs: number;
  totalCertificats: number;
  nombrePaiementsValides: number;
  revenuTotalFcfa: number;
  totalSujetsForum: number;
};

export const statistiquesApi = {
  obtenir: () => appelApi<Statistiques>("/admin/statistiques"),
};

// ---------- Bloc-note personnel par formation ----------

export type NoteFormation = {
  contenu: string;
  updatedAt: string | null;
};

export const notesApi = {
  obtenir: (formationId: string) =>
    appelApi<NoteFormation>(`/formations/${formationId}/notes`),

  enregistrer: (formationId: string, contenu: string) =>
    appelApi<NoteFormation>(`/formations/${formationId}/notes`, {
      method: "PUT",
      body: JSON.stringify({ contenu }),
    }),

  supprimer: (formationId: string) =>
    appelApi<{ ok: true }>(`/formations/${formationId}/notes`, {
      method: "DELETE",
    }),
};

// ---------- Plan d'affaire ----------

export type IngredientRecette = {
  nom: string;
  unite: string;
  quantite: number;
  prixUnitaire: number;
};

export type ProduitPlanAffaire = {
  nom: string;
  unite: string;
  ingredients: IngredientRecette[];
  uniteParLot: number;
  prixVenteUnitaire: number;
  volumesMensuelsAnnee1: number[];
  tauxDePerte: number;
};

export type LigneInvestissement = {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  dureeAmortissementAnnees: number;
};

export type LigneFraisGeneraux = { nom: string; montantMensuel: number };

export type LigneMasseSalariale = {
  poste: string;
  effectif: number;
  salaireMensuel: number;
};

export type FinancementPlanAffaire = {
  apportPersonnelPct: number;
  subventionPct: number;
  creditPct: number;
  tauxInteretAnnuel: number;
  dureeCreditMois: number;
  moisDeDeblocageCredit: number;
};

export type HypothesesPlanAffaire = {
  tauxCroissanceAnnuelActivite: number;
  tauxCroissanceFraisGeneraux: number;
  tauxChargesSociales: number;
  tauxImpotSurLesSocietes: number;
};

export type EntreesPlanAffaire = {
  produits: ProduitPlanAffaire[];
  investissements: LigneInvestissement[];
  fraisGeneraux: LigneFraisGeneraux[];
  masseSalariale: LigneMasseSalariale[];
  financement: FinancementPlanAffaire;
  hypotheses: HypothesesPlanAffaire;
};

export type CoutUnitaireProduit = {
  nom: string;
  coutUnitaire: number;
  prixVente: number;
  margeUnitaire: number;
  tauxDeMarge: number;
};

export type ProjectionAnnuelleProduit = {
  nom: string;
  volumesVendus: [number, number, number];
  chiffreAffaires: [number, number, number];
  coutAchat: [number, number, number];
  margeBrute: [number, number, number];
};

export type ResultatInvestissement = {
  lignes: { nom: string; quantite: number; prixUnitaire: number; montant: number }[];
  total: number;
};

export type ResultatCoutDuProjet = {
  investissement: number;
  bfr: number;
  coutTotalDuProjet: number;
  apportPersonnel: number;
  subvention: number;
  credit: number;
};

export type LigneCompteDeResultat = {
  annee: 1 | 2 | 3;
  chiffreAffaires: number;
  achatsMatieres: number;
  margeBrute: number;
  fraisGeneraux: number;
  valeurAjoutee: number;
  chargesPersonnel: number;
  excedentBrutExploitation: number;
  dotationsAmortissements: number;
  resultatExploitation: number;
  fraisFinanciers: number;
  resultatNetAvantImpots: number;
  impotSurLesSocietes: number;
  capaciteAutofinancement: number;
};

export type LigneTresorerieMensuelle = {
  mois: number;
  soldeDebut: number;
  encaissements: number;
  decaissements: number;
  soldeFin: number;
};

export type LignePlanFinancement = {
  annee: 1 | 2 | 3;
  besoins: number;
  ressources: number;
  solde: number;
  soldeCumule: number;
};

export type ResultatsPlanAffaire = {
  coutsUnitaires: CoutUnitaireProduit[];
  projectionAnnuelle: ProjectionAnnuelleProduit[];
  chiffreAffairesTotalParAnnee: [number, number, number];
  coutAchatTotalParAnnee: [number, number, number];
  investissement: ResultatInvestissement;
  dotationAnnuelleAmortissement: number;
  bfr: { besoinEnFondsDeRoulement: number; soldeMensuelCumule: number[] };
  coutDuProjet: ResultatCoutDuProjet;
  credit: { montant: number; totalInterets: number };
  masseSalarialeAnnuelle: number;
  fraisGenerauxParAnnee: [number, number, number];
  compteDeResultat: LigneCompteDeResultat[];
  tresorerieMensuelleAnnee1: LigneTresorerieMensuelle[];
  planFinancement: LignePlanFinancement[];
};

export type ListeSwot = {
  forces: string[];
  faiblesses: string[];
  opportunites: string[];
  menaces: string[];
};

export type RisqueIdentifie = {
  risque: string;
  origine: string;
  probabilite: string;
  importance: string;
  actionMitigation: string;
};

export type ContenuNarratifPlanAffaire = {
  promoteur: string;
  entrepriseHistorique: string;
  entrepriseVision: string;
  entrepriseMission: string;
  entrepriseActivites: string;
  entrepriseObjectifs: string;
  swotPromoteur: ListeSwot;
  swotEntreprise: ListeSwot;
  presentationProduitsServices: string;
  marcheCible: string;
  marketingProduit: string;
  marketingPrix: string;
  marketingPromotion: string;
  marketingDistribution: string;
  operationsProcessus: string;
  operationsApprovisionnement: string;
  operationsLieuEtEquipements: string;
  ressourcesHumainesEquipe: string;
  ressourcesHumainesCreationEmplois: string;
  formalisationEtapes: string;
  gestionRisques: RisqueIdentifie[];
};

export type PlanAffaireEnregistre = {
  titreProjet: string;
  contenuNarratif: ContenuNarratifPlanAffaire;
  entreesFinancieres: EntreesPlanAffaire | null;
  updatedAt: string | null;
};

export const planAffaireApi = {
  // Simulateur autonome — n'exige pas d'avoir terminé la formation.
  calculer: (entrees: EntreesPlanAffaire) =>
    appelApi<ResultatsPlanAffaire>("/outils/plan-affaire/calculer", {
      method: "POST",
      body: JSON.stringify(entrees),
    }),

  obtenir: (formationId: string) =>
    appelApi<PlanAffaireEnregistre>(`/formations/${formationId}/plan-affaire`),

  enregistrer: (
    formationId: string,
    donnees: {
      titreProjet?: string;
      contenuNarratif?: Partial<ContenuNarratifPlanAffaire>;
      entreesFinancieres?: EntreesPlanAffaire;
    },
  ) =>
    appelApi<PlanAffaireEnregistre>(`/formations/${formationId}/plan-affaire`, {
      method: "PUT",
      body: JSON.stringify(donnees),
    }),

  // Téléchargement du document Word final — requiert les cookies de
  // session, donc géré via fetch + lien d'objet plutôt qu'un <a href> nu.
  telechargerDocument: async (formationId: string, nomFichierSuggere: string) => {
    const res = await fetch(
      `${API_URL}/formations/${formationId}/plan-affaire/generer`,
      { method: "POST", credentials: "include" },
    );
    if (!res.ok) {
      const corps = await res.json().catch(() => null);
      throw new ApiError(
        corps?.message ?? "Impossible de générer le document.",
        res.status,
      );
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichierSuggere;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    window.URL.revokeObjectURL(url);
  },

  // ---------- Consultation admin (suivi individualisé) ----------

  listerPourApprenant: (apprenantId: string) =>
    appelApi<PlanAffaireResume[]>(`/admin/apprenants/${apprenantId}/plans-affaire`),

  telechargerDocumentAdmin: async (
    apprenantId: string,
    formationId: string,
    nomFichierSuggere: string,
  ) => {
    const res = await fetch(
      `${API_URL}/admin/apprenants/${apprenantId}/formations/${formationId}/plan-affaire/generer`,
      { method: "POST", credentials: "include" },
    );
    if (!res.ok) {
      const corps = await res.json().catch(() => null);
      throw new ApiError(
        corps?.message ?? "Impossible de générer le document.",
        res.status,
      );
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichierSuggere;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    window.URL.revokeObjectURL(url);
  },
};

export type PlanAffaireResume = {
  formationId: string;
  titreProjet: string;
  aDesDonneesFinancieres: boolean;
  updatedAt: string;
};

// ---------- Formulaire de contact (site vitrine) ----------

export const contactApi = {
  envoyer: (donnees: { nom: string; email: string; message: string }) =>
    appelApi<{ ok: true }>("/contact", {
      method: "POST",
      body: JSON.stringify(donnees),
    }),
};
