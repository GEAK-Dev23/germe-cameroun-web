"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  messageriePriveeApi,
  ApiError,
  type ConversationPrivee,
  type ContactsMessagerie,
} from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function initiales(nom: string): string {
  return nom.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase();
}

function tempsEcoule(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const heures = Math.floor(diffMs / 3_600_000);
  if (heures < 1) return "à l'instant";
  if (heures < 24) return `il y a ${heures} h`;
  return `il y a ${Math.floor(heures / 24)} j`;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationPrivee[]>([]);
  const [contacts, setContacts] = useState<ContactsMessagerie | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nonEligible, setNonEligible] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([messageriePriveeApi.conversations(), messageriePriveeApi.mesContacts()])
      .then(([c, contacts]) => {
        setConversations(c);
        setContacts(contacts);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 403) {
          setNonEligible(err.message);
        } else {
          setErreur(err instanceof ApiError ? err.message : "Erreur de chargement.");
        }
      })
      .finally(() => setChargement(false));
  }, []);

  if (!chargement && nonEligible) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-germe-wheat/40 text-2xl">
          🔒
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-germe-ink">
          Pas encore disponible
        </h1>
        <p className="mt-2 text-sm text-germe-ink/60">{nonEligible}</p>
        <Link href="/plateforme" className="mt-6 inline-block text-sm text-germe-blue hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  const idsConversations = new Set(conversations.map((c) => c.utilisateurId));
  const parFormationSansConversation =
    contacts?.parFormation
      .map((f) => ({ ...f, formateurs: f.formateurs.filter((u) => !idsConversations.has(u.id)) }))
      .filter((f) => f.formateurs.length > 0) ?? [];
  const administrationSansConversation =
    contacts?.administration.filter((a) => !idsConversations.has(a.id)) ?? [];
  const aucunContact =
    conversations.length === 0 &&
    parFormationSansConversation.length === 0 &&
    administrationSansConversation.length === 0;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 md:px-6">
      <PageHeader
        icone="✉️"
        titre="Messages"
        sousTitre="Échangez avec les formateurs de vos formations ou l'équipe administrative."
      />

      {erreur && <p className="mt-6 text-sm text-red-600">{erreur}</p>}
      {chargement && (
        <p className="mt-6 text-sm text-germe-ink/50">Chargement...</p>
      )}

      {!chargement && (
        <>
          {conversations.length > 0 && (
            <div className="mt-6 space-y-2">
              {conversations.map((c) => (
                <Link
                  key={c.utilisateurId}
                  href={`/plateforme/messages/${c.utilisateurId}`}
                  className="flex items-center gap-3 rounded-2xl border border-germe-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-germe-blue/30 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-germe-blue to-germe-green text-xs font-semibold text-white">
                    {initiales(c.nom)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-germe-ink">{c.nom}</p>
                    <p className="mt-0.5 truncate text-xs text-germe-ink/50">
                      {c.dernierMessage}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[11px] text-germe-ink/40">
                      {tempsEcoule(c.dernierMessageLe)}
                    </span>
                    {c.nonLus > 0 && (
                      <span className="rounded-full bg-germe-green px-2 py-0.5 text-[11px] font-semibold text-white">
                        {c.nonLus}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {parFormationSansConversation.map((f) => (
            <div key={f.formationId} className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-germe-ink/40">
                {f.formationTitre}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {f.formateurs.map((u) => (
                  <Link
                    key={u.id}
                    href={`/plateforme/messages/${u.id}`}
                    className="rounded-full border border-germe-ink/15 bg-white px-4 py-2 text-xs font-medium text-germe-ink/70 shadow-sm transition hover:border-germe-blue hover:text-germe-blue"
                  >
                    {u.fullName} · Formateur
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {administrationSansConversation.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-germe-ink/40">
                Administration
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {administrationSansConversation.map((a) => (
                  <Link
                    key={a.id}
                    href={`/plateforme/messages/${a.id}`}
                    className="rounded-full border border-germe-ink/15 bg-white px-4 py-2 text-xs font-medium text-germe-ink/70 shadow-sm transition hover:border-germe-blue hover:text-germe-blue"
                  >
                    {a.fullName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {aucunContact && (
            <div className="mt-8">
              <EmptyState icone="✉️" titre="Aucun message pour le moment" />
            </div>
          )}
        </>
      )}
    </main>
  );
}
