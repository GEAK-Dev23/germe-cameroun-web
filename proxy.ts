import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const NOM_COOKIE = "germe_token";

// Doit être IDENTIQUE au secret utilisé par l'API NestJS (JWT_SECRET).
// jose tourne sur l'Edge Runtime de Next.js : on vérifie la signature
// et l'expiration du token nous-mêmes, sans appeler l'API à chaque requête.
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-moi-en-production",
);

type PayloadToken = {
  sub: string;
  email: string;
  role: "super_admin" | "admin" | "formateur" | "apprenant";
};

async function lireRole(
  token: string | undefined,
): Promise<PayloadToken["role"] | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload as unknown as PayloadToken).role ?? null;
  } catch {
    // Token absent, expiré, ou signature invalide.
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(NOM_COOKIE)?.value;
  const role = await lireRole(token);

  const estConnecte = role !== null;
  const estAdmin = role === "super_admin" || role === "admin";

  if (
    !estConnecte &&
    (path.startsWith("/plateforme") || path.startsWith("/admin"))
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("suite", path);
    return NextResponse.redirect(url);
  }

  if (estConnecte && path.startsWith("/admin") && !estAdmin) {
    return NextResponse.redirect(new URL("/plateforme", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/plateforme/:path*", "/admin/:path*"],
};
