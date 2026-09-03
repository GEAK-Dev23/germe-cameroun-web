import Reveal from "@/components/vitrine/Reveal";

export default function CtaBanner() {
  return (
    <section
      id="formations"
      className="relative isolate overflow-hidden bg-germe-green py-20 text-center"
    >
      <Reveal className="mx-auto max-w-2xl px-5 md:px-6">
        <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
          Offrez à votre exploitation les compétences qui la feront grandir
        </h2>
        <p className="mt-3 text-sm text-white/85 md:text-base">
          Des cours gratuits pour démarrer, des parcours certifiants pour aller
          plus loin.
        </p>
        <a
          href="/signup"
          className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-germe-green transition hover:-translate-y-0.5 hover:bg-germe-cream hover:shadow-lg"
        >
          Découvrir les formations
        </a>
      </Reveal>
    </section>
  );
}
