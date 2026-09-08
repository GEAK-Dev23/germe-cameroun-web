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
