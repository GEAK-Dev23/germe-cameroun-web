import Reveal from "@/components/vitrine/Reveal";

export default function CtaBanner() {
  return (
    <section
      id="formations"
      className="relative isolate overflow-hidden bg-gradient-to-r from-germe-blue to-germe-green py-20 text-center"
    >
      <Reveal className="mx-auto max-w-2xl px-5 md:px-6">
        <div className="relative inline-block">
          <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
            Offrez à votre exploitation les compétences qui la feront grandir
          </h2>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-full select-none font-display text-2xl font-semibold text-white [transform:scaleY(-1)] md:text-3xl"
            style={{
              opacity: 0.12,
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
            }}
          >
            Offrez à votre exploitation les compétences qui la feront grandir
          </span>
        </div>
        <p className="mt-3 text-sm text-white/85 md:text-base">
          Des cours gratuits pour démarrer, des parcours certifiants pour aller
          plus loin.
        </p>
        <a
          href="/signup"
          className="mt-7 inline-block rounded-full bg-germe-wheat px-7 py-3 text-sm font-semibold text-germe-ink transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
        >
          Découvrir les formations
        </a>
      </Reveal>
    </section>
  );
}
