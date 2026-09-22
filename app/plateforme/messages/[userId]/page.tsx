"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  messageriePriveeApi,
  authApi,
  ApiError,
  type FilMessagesPrives,
} from "@/lib/api";

const LIBELLES_ROLES: Record<string, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  formateur: "Formateur",
  apprenant: "Apprenant",
};

export default function FilMessagesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [fil, setFil] = useState<FilMessagesPrives | null>(null);
  const [moiId, setMoiId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const finDuFil = useRef<HTMLDivElement>(null);

  function recharger() {
    Promise.all([messageriePriveeApi.fil(userId), authApi.me()])
      .then(([f, { utilisateur }]) => {
        setFil(f);
        setMoiId(utilisateur.id);
      })
      .catch((err) =>
        setErreur(
          err instanceof ApiError ? err.message : "Erreur de chargement.",
        ),
      )
      .finally(() => setChargement(false));
  }

  useEffect(recharger, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    finDuFil.current?.scrollIntoView({ behavior: "smooth" });
  }, [fil]);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setEnvoi(true);
    try {
      await messageriePriveeApi.envoyer(userId, message);
      setMessage("");
      recharger();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Impossible d'envoyer le message.");
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center text-germe-ink/50">
        Chargement...
      </div>
    );
  }

  if (erreur || !fil) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-sm text-red-600">{erreur ?? "Conversation introuvable."}</p>
        <Link href="/plateforme/messages" className="mt-4 inline-block text-sm text-germe-blue hover:underline">
          ← Retour aux messages
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col px-5 py-6 md:px-6">
      <Link href="/plateforme/messages" className="text-sm text-germe-ink/60 hover:text-germe-ink">
        ← Retour aux messages
      </Link>
      <div className="mt-2 border-b border-germe-ink/10 pb-3">
        <p className="font-display text-lg font-semibold text-germe-ink">
          {fil.correspondant.nom}
        </p>
        <p className="text-xs text-germe-ink/50">
          {LIBELLES_ROLES[fil.correspondant.role] ?? fil.correspondant.role}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {fil.messages.length === 0 && (
          <p className="py-10 text-center text-sm text-germe-ink/40">
            Aucun message — dites bonjour !
          </p>
        )}
        {fil.messages.map((m) => {
          const estMoi = m.expediteurId === moiId;
          return (
            <div key={m.id} className={`flex ${estMoi ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  estMoi
                    ? "bg-germe-green text-white"
                    : "bg-germe-cream text-germe-ink"
                }`}
              >
                <p className="whitespace-pre-line break-words">{m.contenu}</p>
              </div>
            </div>
          );
        })}
        <div ref={finDuFil} />
      </div>

      <form onSubmit={envoyer} className="flex gap-2 border-t border-germe-ink/10 pt-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message..."
          className="flex-1 rounded-full border border-germe-ink/20 px-4 py-2.5 text-sm focus:border-germe-blue focus:outline-none"
        />
        <button
          type="submit"
          disabled={!message.trim() || envoi}
          className="shrink-0 rounded-full bg-germe-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-germe-greenDark disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </main>
  );
}
