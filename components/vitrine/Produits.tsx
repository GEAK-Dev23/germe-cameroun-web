import Link from "next/link";
import Reveal from "@/components/vitrine/Reveal";
import MirrorImage from "@/components/vitrine/MirrorImage";

const PHOTOS = [
  {
    src: "/images/produits/maraichage.jpg",
    alt: "Récolte de légumes frais",
    className: "col-span-2 row-span-2",
  },
  {
    src: "/images/produits/cacao.jpg",
    alt: "Cabosses de cacao",
    className: "",
  },
  {
    src: "/images/produits/manioc.jpg",
    alt: "Récolte de manioc",
    className: "",
  },
  { src: "/images/produits/mais.jpg", alt: "Champ de maïs", className: "" },
  {
    src: "/images/produits/betail.jpg",
    alt: "Bétail au pâturage",
    className: "",
  },
];

export default function Produits() {
  return (
    <section className="bg-germe-greenDark">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-6">
        <div className="grid gap-10 md:grid-cols-3 md:items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wide text-germe-wheat">
              Nos filières
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
              Des filières concrètes, ancrées dans le terrain
            </h2>
            <p className="mt-3 text-sm text-white/75">
              Maraîchage, cultures vivrières, cacao et élevage : nos formations
              couvrent les filières qui font vivre les exploitations
              camerounaises.
            </p>
            <Link
              href="/plateforme"
              className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-germe-greenDark transition hover:-translate-y-0.5 hover:bg-germe-wheat hover:shadow-lg"
            >
              Commencer
            </Link>
          </Reveal>

          <Reveal
            delay={120}
            className="grid grid-cols-2 grid-rows-2 gap-3 md:col-span-2"
          >
            {PHOTOS.map((p) => (
              <MirrorImage
                key={p.src}
                src={p.src}
                alt={p.alt}
                className={`rounded-xl ${p.className}`}
                imgClassName="min-h-[110px] transition duration-700 hover:scale-105"
                intensite={0.22}
              />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
