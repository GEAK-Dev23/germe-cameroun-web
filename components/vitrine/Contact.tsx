"use client";

import { useState } from "react";
import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";
import { contactApi, ApiError } from "@/lib/api";

export default function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [statut, setStatut] = useState<"inactif" | "succes" | "erreur">("inactif");
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setStatut("inactif");
    setErreur(null);
    try {
      await contactApi.envoyer({ nom, email, message });
      setStatut("succes");
      setNom("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatut("erreur");
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible d'envoyer votre message pour le moment.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <section id="contact" className="bg-germe-blueLight">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-6 md:py-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Nous contacter
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Une question sur nos formations ?
          </h2>
          <p className="mt-3 max-w-md text-sm text-germe-ink/70">
            Écrivez-nous : notre équipe pédagogique vous répond sous 48h.
          </p>

          <div className="mt-6 space-y-2.5 text-sm text-germe-ink">
            <a
              href="mailto:info.germecam@gmail.com"
              className="flex items-center gap-2.5 hover:text-germe-blue"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-germe-blue">
                ✉️
              </span>
              info.germecam@gmail.com
            </a>
            <a
              href="tel:+237690308378"
              className="flex items-center gap-2.5 hover:text-germe-blue"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-germe-blue">
                📞
              </span>
              +237 690 308 378
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MirrorImage
              src="/images/contact/formation-terrain.jpg"
              alt="Session de formation sur le terrain"
              className="aspect-square rounded-xl"
              imgClassName="transition duration-700 hover:scale-105"
            />
            <MirrorImage
              src="/images/contact/recolte-mains.jpg"
              alt="Mains tenant une récolte"
              className="mt-6 aspect-square rounded-xl"
              imgClassName="transition duration-700 hover:scale-105"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={envoyer} className="rounded-2xl bg-germe-cream p-6 md:p-8">
            <h3 className="font-display text-lg font-semibold text-germe-ink">
              Contactez-nous
            </h3>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm text-germe-ink/70" htmlFor="nom">
                  Nom
                </label>
                <input
                  id="nom"
                  type="text"
                  required
                  minLength={2}
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
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
              <div>
                <label className="text-sm text-germe-ink/70" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  minLength={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-germe-ink/20 bg-white px-4 py-2.5 transition focus:border-germe-blue focus:outline-none focus:ring-2 focus:ring-germe-blue/20"
                />
              </div>

              {statut === "succes" && (
                <p className="rounded-lg bg-germe-green/10 px-4 py-2.5 text-sm text-germe-green">
                  ✓ Message envoyé — nous vous répondons sous 48h.
                </p>
              )}
              {statut === "erreur" && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {erreur}
                </p>
              )}

              <button
                type="submit"
                disabled={envoi}
                className="w-full rounded-full bg-gradient-to-r from-germe-blue to-germe-green px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {envoi ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
