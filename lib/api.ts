// Point d'appel unique vers l'API NestJS. En développement, l'API tourne
// sur le port 3001 ; en production, définissez NEXT_PUBLIC_API_URL vers
// votre domaine d'API réel (ex : https://api.germecameroun.org).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

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
  createdAt: string;
};

export type Exercice = {
  id: string;
  question: string;
  type: string;
  options: unknown;
  ordre: number;
};

export type Lecon = {
  id: string;
  titre: string;
  videoUrl: string | null;
  contenuTexte: string | null;
  dureeMin: number;
  ordre: number;
  exercices: Exercice[];
};

export type Chapitre = {
  id: string;
  titre: string;
  ordre: number;
  lecons: Lecon[];
};

export type ModulePedagogique = {
  id: string;
  titre: string;
  ordre: number;
  chapitres: Chapitre[];
};

export type FormationAvecCurriculum = Formation & {
  modules: ModulePedagogique[];
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
    estPayant?: boolean;
    prixFcfa?: number;
  }) =>
    appelApi<Formation>("/formations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  modifier: (id: string, data: Partial<Formation>) =>
    appelApi<Formation>(`/formations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  supprimer: (id: string) =>
    appelApi<void>(`/formations/${id}`, { method: "DELETE" }),

  ajouterModule: (formationId: string, titre: string) =>
    appelApi<ModulePedagogique>(`/formations/${formationId}/modules`, {
      method: "POST",
      body: JSON.stringify({ titre }),
    }),

  ajouterChapitre: (moduleId: string, titre: string) =>
    appelApi<Chapitre>(`/modules/${moduleId}/chapitres`, {
      method: "POST",
      body: JSON.stringify({ titre }),
    }),

  ajouterLecon: (
    chapitreId: string,
    data: {
      titre: string;
      contenuTexte?: string;
      videoUrl?: string;
      dureeMin?: number;
    },
  ) =>
    appelApi<Lecon>(`/chapitres/${chapitreId}/lecons`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  ajouterExercice: (
    leconId: string,
    data: { question: string; options?: unknown },
  ) =>
    appelApi<Exercice>(`/lecons/${leconId}/exercices`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
