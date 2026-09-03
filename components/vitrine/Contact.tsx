import Reveal from "@/components/vitrine/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-6 md:py-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Nous contacter
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Une question sur nos formations ?
          </h2>
          <p className="mt-3 max-w-md text-sm text-germe-ink/70">
            Écrivez-nous : notre équipe pédagogique vous répond sous 48h, que
            vous soyez déjà agriculteur ou en train de démarrer.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <img
              src="/images/contact/formation-terrain.jpg"
              alt="Session de formation sur le terrain"
              className="aspect-square rounded-xl object-cover transition duration-700 hover:scale-105"
            />
            <img
              src="/images/contact/recolte-mains.jpg"
              alt="Mains tenant une récolte"
              className="mt-6 aspect-square rounded-xl object-cover transition duration-700 hover:scale-105"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form className="rounded-2xl bg-germe-cream p-6 md:p-8">
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
                  className="mt-1 w-full rounded-lg border border-germe-ink/20 bg-white px-4 py-2.5 transition focus:border-germe-blue focus:outline-none focus:ring-2 focus:ring-germe-blue/20"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-germe-green px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-lg"
              >
                Envoyer
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
