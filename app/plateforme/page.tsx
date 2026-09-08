import Reveal from "@/components/vitrine/Reveal";
import CatalogueFormations from "@/components/plateforme/CatalogueFormations";

export default function PlateformePage() {
  return (
    <main>
      {/* En-tête, même signature visuelle (dégradé + badge doré) que le hero de la vitrine */}
      <section className="bg-gradient-to-r from-germe-blueDark via-germe-blue to-germe-green">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-6">
          <Reveal>
            <span className="inline-block rounded-full bg-germe-wheat px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-germe-ink shadow">
              Votre espace apprenant
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-white md:text-3xl">
              Bonjour 👋 — voici vos formations
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Reprenez là où vous vous êtes arrêté, ou découvrez une nouvelle
              formation.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 md:px-6">
        <CatalogueFormations />
      </div>
    </main>
  );
}
