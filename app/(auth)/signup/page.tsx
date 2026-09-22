"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import ChampMotDePasse from "@/components/auth/ChampMotDePasse";
import { authApi, ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [nomComplet, setNomComplet] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      await authApi.signup({
        fullName: nomComplet,
        email,
        password: motDePasse,
      });
      router.push("/plateforme");
      router.refresh();
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de créer le compte pour le moment.",
      );
    } finally {
      setChargement(false);
    }
  }

  return (
    <AuthShell
      titre="Créer un compte"
      sousTitre="Commencez gratuitement, certifiez-vous à votre rythme."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-germe-ink/70" htmlFor="nom">
            Nom complet
          </label>
          <input
            id="nom"
            type="text"
            required
            value={nomComplet}
            onChange={(e) => setNomComplet(e.target.value)}
            className="mt-1 w-full rounded-lg border border-germe-ink/20 bg-white px-4 py-2.5 transition focus:border-germe-blue focus:outline-none focus:ring-2 focus:ring-germe-blue/20"
          />
        </div>
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
        <ChampMotDePasse
          id="mot-de-passe"
          value={motDePasse}
          onChange={setMotDePasse}
          minLength={6}
          autoComplete="new-password"
        />

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded-full bg-gradient-to-r from-germe-blue to-germe-green px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
        >
          {chargement ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-germe-ink/70">
        Déjà inscrit ?{" "}
        <Link
          href="/login"
          className="font-medium text-germe-green hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
