import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";

export default function Vision() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-6 md:py-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-germe-green">
            Notre vision
          </p>
          <blockquote className="mt-4 border-l-4 border-germe-green pl-5">
            <p className="font-display text-xl italic leading-relaxed text-germe-ink md:text-2xl">
              « Être une référence africaine, reconnue pour la qualité de ses
              interventions, l'impact durable de ses solutions et sa capacité
              à transformer les potentiels locaux en réussites qui résistent
              au temps, au plus près des réalités urbaines et rurales. »
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={120} className="relative shadow-lg">
          <MirrorImage
            src="/images/vision/exploitation-moderne.jpg"
            alt="Exploitation agricole moderne avec tracteur"
            className="aspect-video w-full rounded-2xl"
            imgClassName="transition duration-700 hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-germe-ink/20">
            <span className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-xl text-germe-blue shadow transition hover:scale-110">
              ▶
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
