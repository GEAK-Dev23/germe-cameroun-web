import Reveal from "@/components/vitrine/Reveal";

export default function Vision() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-6 md:py-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Notre vision
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-germe-ink md:text-3xl">
            Des exploitations modernes et rentables
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-germe-ink/70 md:text-base">
            Nous voulons faire de chaque apprenant un chef d'exploitation
            capable de produire davantage, de mieux vendre, et de faire grandir
            durablement son activité agricole ou d'élevage.
          </p>
          <a
            href="#services"
            className="mt-6 inline-block rounded-full bg-germe-green px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-germe-greenDark hover:shadow-lg"
          >
            Voir nos domaines
          </a>
        </Reveal>

        <Reveal
          delay={120}
          className="relative overflow-hidden rounded-2xl shadow-lg"
        >
          <img
            src="/images/vision/exploitation-moderne.jpg"
            alt="Exploitation agricole moderne avec tracteur"
            className="aspect-video w-full object-cover transition duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-germe-ink/20">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-xl text-germe-blue shadow transition hover:scale-110">
              ▶
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
