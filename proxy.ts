import { NextResponse, type NextRequest } from "next/server";

const NOM_COOKIE = "germe_token";
// Appel serveur-à-serveur direct vers l'API (jamais via le rewrite /api,
// qui n'existe que pour les requêtes du navigateur) : le cookie est lu ici
// depuis request.cookies puis renvoyé manuellement en en-tête Cookie, donc
// aucune histoire de domaine ne se pose pour cet appel-ci.
const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:3001/api";

type Role = "super_admin" | "admin" | "formateur" | "apprenant";

// Demande à l'API elle-même qui est l'utilisateur derrière ce cookie,
// plutôt que de revérifier la signature du JWT ici avec un second secret
// (JWT_SECRET) dupliqué côté frontend. Cette duplication était la cause
// d'un bug récurrent et difficile à diagnostiquer : dès que le secret de
// apps/web/.env.local et celui de apps/api/.env divergeaient (ex : l'un
// des deux fichiers recréé depuis .env.example sans reporter le vrai
// secret), une connexion pourtant réussie côté API était rejetée en
// silence par ce middleware, qui renvoyait alors vers /login sans aucun
// message d'erreur. Interroger l'API supprime cette classe de bug : il
// n'existe plus qu'une seule source de vérité (JWT_SECRET dans
// apps/api/.env), le frontend n'a plus besoin de le connaître.
async function obtenirRole(token: string | undefined): Promise<Role | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Cookie: `${NOM_COOKIE}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.utilisateur?.role ?? null;
  } catch {
    // API injoignable : on considère prudemment que la session n'est pas
    // valide plutôt que de laisser passer une requête non vérifiée.
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(NOM_COOKIE)?.value;
  const role = await obtenirRole(token);

  const estConnecte = role !== null;
  // L'espace admin est ouvert à toute l'équipe pédagogique. Les routes
  // sensibles (ex : changer le rôle d'un utilisateur) restent en plus
  // protégées côté API pour le seul super_admin — voir users.controller.ts.
  const estPersonnelAdmin =
    role === "super_admin" || role === "admin" || role === "formateur";

  if (
    !estConnecte &&
    (path.startsWith("/plateforme") || path.startsWith("/admin"))
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("suite", path);
    return NextResponse.redirect(url);
  }

  if (estConnecte && path.startsWith("/admin") && !estPersonnelAdmin) {
    return NextResponse.redirect(new URL("/plateforme", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/plateforme/:path*", "/admin/:path*"],
};
