"use client";

import { useRef, useState } from "react";
import { uploadsApi, ApiError } from "@/lib/api";

export default function ChampMedia({
  value,
  onChange,
  placeholder,
  accept = "image/*,video/*",
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder: string;
  accept?: string;
}) {
  const inputFichier = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function surSelectionFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    e.target.value = ""; // permet de re-sélectionner le même fichier plus tard
    if (!fichier) return;

    setEnvoi(true);
    setErreur(null);
    try {
      const { url } = await uploadsApi.televerser(fichier);
      onChange(url);
    } catch (err) {
      setErreur(
        err instanceof ApiError ? err.message : "Échec du téléversement.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="flex-1">
      <div className="flex gap-2">
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-germe-ink/20 px-3 py-1.5 text-xs focus:border-germe-blue focus:outline-none"
        />
        <button
          type="button"
          onClick={() => inputFichier.current?.click()}
          disabled={envoi}
          className="shrink-0 rounded-lg border border-germe-ink/20 px-3 py-1.5 text-xs font-medium text-germe-ink/70 transition hover:border-germe-blue hover:text-germe-blue disabled:opacity-50"
        >
          {envoi ? "Envoi..." : "📤 Téléverser"}
        </button>
        <input
          ref={inputFichier}
          type="file"
          accept={accept}
          onChange={surSelectionFichier}
          className="hidden"
        />
      </div>
      {erreur && <p className="mt-1 text-[11px] text-red-600">{erreur}</p>}
    </div>
  );
}
