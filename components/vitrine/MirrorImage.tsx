/**
 * Affiche une image avec un léger reflet miroir en bas — entièrement
 * confiné à l'intérieur de la boîte de l'image (jamais de débordement),
 * donc utilisable partout (grilles, cartes, avatars) sans jamais casser
 * une mise en page. Repose sur `mask-image`, supporté par tous les
 * navigateurs modernes (préfixe -webkit- inclus pour Safari).
 */
export default function MirrorImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  intensite = 0.3,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  intensite?: number;
}) {
  const maskStyle = {
    maskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
    WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
  } as React.CSSProperties;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={src}
          alt=""
          className="absolute inset-x-0 bottom-0 h-full w-full object-cover [transform:scaleY(-1)]"
          style={{ opacity: intensite, ...maskStyle }}
        />
      </div>
    </div>
  );
}
