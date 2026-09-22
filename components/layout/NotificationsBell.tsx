"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { notificationsApi, type NotificationItem } from "@/lib/api";

function tempsEcoule(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const heures = Math.floor(diffMs / 3_600_000);
  if (heures < 1) return "à l'instant";
  if (heures < 24) return `il y a ${heures} h`;
  return `il y a ${Math.floor(heures / 24)} j`;
}

export default function NotificationsBell({ sombre = false }: { sombre?: boolean }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [nonLues, setNonLues] = useState(0);
  const conteneur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function rafraichirCompteur() {
      notificationsApi
        .compterNonLues()
        .then(({ total }) => setNonLues(total))
        .catch(() => {});
    }
    rafraichirCompteur();
    const intervalle = setInterval(rafraichirCompteur, 30_000);
    return () => clearInterval(intervalle);
  }, []);

  useEffect(() => {
    function surClicExterieur(e: MouseEvent) {
      if (conteneur.current && !conteneur.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }
    document.addEventListener("mousedown", surClicExterieur);
    return () => document.removeEventListener("mousedown", surClicExterieur);
  }, []);

  function basculer() {
    const prochainEtat = !ouvert;
    setOuvert(prochainEtat);
    if (prochainEtat) {
      notificationsApi
        .lister()
        .then(setNotifications)
        .catch(() => {});
    }
  }

  async function surClicNotification(n: NotificationItem) {
    if (!n.lu) {
      await notificationsApi.marquerLue(n.id);
      setNonLues((v) => Math.max(0, v - 1));
    }
    setOuvert(false);
    if (n.lien) router.push(n.lien);
  }

  async function toutMarquerLu() {
    await notificationsApi.marquerToutesLues();
    setNotifications((liste) => liste.map((n) => ({ ...n, lu: true })));
    setNonLues(0);
  }

  return (
    <div ref={conteneur} className="relative">
      <button
        type="button"
        onClick={basculer}
        aria-label="Notifications"
        className={`relative flex h-9 w-9 items-center justify-center rounded-full transition ${
          sombre
            ? "text-white/80 hover:bg-white/10"
            : "text-germe-ink/70 hover:bg-germe-cream"
        }`}
      >
        🔔
        {nonLues > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-germe-green px-1 text-[10px] font-semibold text-white">
            {nonLues > 9 ? "9+" : nonLues}
          </span>
        )}
      </button>

      {ouvert && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-xl border border-germe-ink/10 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-germe-ink/10 px-4 py-2.5">
            <p className="text-sm font-semibold text-germe-ink">Notifications</p>
            {nonLues > 0 && (
              <button
                type="button"
                onClick={toutMarquerLu}
                className="text-xs font-medium text-germe-blue hover:underline"
              >
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-germe-ink/40">
                Aucune notification.
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => surClicNotification(n)}
                  className={`block w-full border-b border-germe-ink/5 px-4 py-3 text-left transition hover:bg-germe-cream/60 ${
                    n.lu ? "" : "bg-germe-blueLight/40"
                  }`}
                >
                  <p className="text-sm font-medium text-germe-ink">{n.titre}</p>
                  <p className="mt-0.5 text-xs text-germe-ink/60">{n.contenu}</p>
                  <p className="mt-1 text-[11px] text-germe-ink/35">
                    {tempsEcoule(n.createdAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
