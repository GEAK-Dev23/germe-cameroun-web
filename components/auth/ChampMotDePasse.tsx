"use client";

import { useState } from "react";

function IconeOeil() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

function IconeOeilBarre() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.7 10.7 0 0 1 12 5c7 0 10.5 7 10.5 7a13.5 13.5 0 0 1-3.1 3.9M6.3 6.5C3.4 8.4 1.5 12 1.5 12s3.5 7 10.5 7a10.4 10.4 0 0 0 4.6-1.1" />
      <path d="M9.5 10a3.2 3.2 0 0 0 4.5 4.5" />
    </svg>
  );
}

/**
 * Champ mot de passe avec bascule afficher/masquer (icône œil), utilisé
 * sur les pages de connexion et d'inscription.
 */
export default function ChampMotDePasse({
  id,
  label = "Mot de passe",
  value,
  onChange,
  minLength,
  autoComplete,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  minLength?: number;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="text-sm text-germe-ink/70" htmlFor={id}>
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-germe-ink/20 bg-white px-4 py-2.5 pr-11 transition focus:border-germe-blue focus:outline-none focus:ring-2 focus:ring-germe-blue/20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-germe-ink/40 transition hover:text-germe-blue"
        >
          {visible ? <IconeOeilBarre /> : <IconeOeil />}
        </button>
      </div>
    </div>
  );
}
