"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { messagerieApi, ApiError, type Message } from "@/lib/api";

const LIBELLES_ROLES: Record<Message["auteurRole"], string> = {
  super_admin: "Équipe pédagogique",
  admin: "Équipe pédagogique",
  formateur: "Formateur",
  apprenant: "Apprenant",
};

export default function MessagerieFormation({
  formationId,
  formateurs,
}: {
  formationId: string;
  formateurs?: { id: string; fullName: string }[];
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nouveauMessage, setNouveauMessage] = useState("");
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function recharger() {
    messagerieApi
      .lister(formationId)
      .then(setMessages)
      .catch((err) =>
        setErreur(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les messages.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, [formationId]);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!nouveauMessage.trim()) return;
    setEnvoi(true);
    try {
      await messagerieApi.poster(formationId, nouveauMessage.trim());
      setNouveauMessage("");
      recharger();
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible d'envoyer le message.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="rounded-xl border border-germe-ink/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-germe-ink">
            Forum de la formation
          </h3>
          <p className="mt-1 text-sm text-germe-ink/60">
            Visible par tous les apprenants (actuels et passés) de cette
            formation ainsi que l'équipe pédagogique.
          </p>
        </div>
        {formateurs && formateurs.length > 0 && (
          <div className="flex shrink-0 flex-wrap gap-2">
            {formateurs.map((f) => (
              <Link
                key={f.id}
                href={`/plateforme/messages/${f.id}`}
                className="rounded-full bg-germe-blueLight px-4 py-2 text-xs font-semibold text-germe-blue transition hover:bg-germe-blue hover:text-white"
              >
                💬 Écrire à {f.fullName} en privé
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-lg bg-germe-cream p-4">
        {chargement && (
          <p className="text-sm text-germe-ink/50">Chargement...</p>
        )}

        {!chargement && messages.length === 0 && (
          <p className="text-sm text-germe-ink/50">
            Aucun message pour le moment.
          </p>
        )}

        {messages.map((m) => {
          const estPersonnel = m.auteurRole !== "apprenant";
          return (
            <div
              key={m.id}
              className={
                estPersonnel
                  ? "ml-6 rounded-lg rounded-tr-none bg-germe-blue/10 p-3"
                  : "mr-6 rounded-lg rounded-tl-none bg-white p-3 shadow-sm"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    estPersonnel
                      ? "text-xs font-semibold text-germe-blue"
                      : "text-xs font-semibold text-germe-ink"
                  }
                >
                  {m.auteurNom} · {LIBELLES_ROLES[m.auteurRole]}
                </span>
                <span className="shrink-0 text-[10px] text-germe-ink/40">
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(m.createdAt))}
                </span>
              </div>
              <p className="mt-1 break-words text-sm text-germe-ink/80">{m.contenu}</p>
            </div>
          );
        })}
      </div>

      {erreur && <p className="mt-2 text-xs text-red-600">{erreur}</p>}

      <form onSubmit={envoyer} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Écrire un message au groupe..."
          value={nouveauMessage}
          onChange={(e) => setNouveauMessage(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-germe-ink/20 bg-white px-4 py-2 text-sm focus:border-germe-blue focus:outline-none"
        />
        <button
          type="submit"
          disabled={envoi || !nouveauMessage.trim()}
          className="shrink-0 rounded-full bg-germe-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-germe-blueDark disabled:opacity-50"
        >
          {envoi ? "..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
