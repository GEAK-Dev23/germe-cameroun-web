"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { authApi, ApiError } from "@/lib/api";

function FormulaireLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      await authApi.login({ email, password: motDePasse });
      const suite = searchParams.get("suite");
      router.push(suite && suite.startsWith("/") ? suite : "/plateforme");
      router.refresh();
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de se connecter pour le moment.",
      );
    } finally {
      setChargement(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-germe-ink/70" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-germe-ink/20 bg-white px-4 py-2.5 transition focus:border-germe-blue focus:outline-none focus:ring-2 focus:ring-germe-blue/20"
        />
      </div>
      <div>
        <label className="text-sm text-germe-ink/70" htmlFor="mot-de-passe">
          Mot de passe
        </label>
        <input
          id="mot-de-passe"
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="mt-1 w-full rounded-lg border border-germe-ink/20 bg-white px-4 py-2.5 transition focus:border-germe-blue focus:outline-none focus:ring-2 focus:ring-germe-blue/20"
        />
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={chargement}
        className="w-full rounded-full bg-gradient-to-r from-germe-blue to-germe-green px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
      >
        {chargement ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      titre="Se connecter"
      sousTitre="Accédez à vos formations et à votre progression."
    >
      <Suspense fallback={null}>
        <FormulaireLogin />
      </Suspense>

      <p className="mt-6 text-center text-sm text-germe-ink/70">
        Pas encore de compte ?{" "}
        <Link
          href="/signup"
          className="font-medium text-germe-green hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
