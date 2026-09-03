export default function FarmScene() {
  return (
    <svg
      viewBox="0 0 1200 420"
      className="h-full w-full"
      role="img"
      aria-label="Illustration d'une ferme : moulin à vent, grange, tracteur et champs cultivés"
    >
      {/* Ciel */}
      <rect x="0" y="0" width="1200" height="420" fill="#8FD3E8" />

      {/* Soleil */}
      <circle cx="1080" cy="70" r="42" fill="#F6D673" className="animate-bounce-soft" />

      {/* Nuages */}
      <g className="animate-drift-cloud-1">
        <ellipse cx="180" cy="80" rx="46" ry="20" fill="#FFFFFF" />
        <ellipse cx="215" cy="70" rx="34" ry="18" fill="#FFFFFF" />
        <ellipse cx="145" cy="72" rx="30" ry="16" fill="#FFFFFF" />
      </g>
      <g className="animate-drift-cloud-2">
        <ellipse cx="620" cy="55" rx="40" ry="17" fill="#FFFFFF" />
        <ellipse cx="650" cy="48" rx="28" ry="14" fill="#FFFFFF" />
      </g>
      <g className="animate-drift-cloud-1">
        <ellipse cx="900" cy="100" rx="34" ry="15" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Collines lointaines */}
      <path d="M0,220 C200,180 350,240 600,210 C850,180 1000,230 1200,200 L1200,420 L0,420 Z" fill="#6BAE4F" />
      {/* Champ de blé */}
      <path d="M0,280 C250,250 450,310 700,270 C900,240 1050,290 1200,260 L1200,420 L0,420 Z" fill="#F2DBA0" />

      {/* Rangs du champ (sillons) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <path
          key={i}
          d={`M ${60 + i * 45},340 C ${90 + i * 45},370 ${40 + i * 45},390 ${70 + i * 45},420`}
          stroke="#E3C077"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
      ))}

      {/* Clôture */}
      <g>
        {Array.from({ length: 26 }).map((_, i) => (
          <rect key={i} x={10 + i * 46} y="298" width="6" height="26" fill="#2B2118" />
        ))}
        <rect x="0" y="302" width="1200" height="4" fill="#2B2118" />
        <rect x="0" y="314" width="1200" height="4" fill="#2B2118" />
      </g>

      {/* Arbres */}
      <g className="animate-sway" style={{ transformOrigin: "110px 300px" }}>
        <rect x="105" y="260" width="10" height="45" fill="#5C4326" />
        <circle cx="110" cy="248" r="30" fill="#357A38" />
      </g>
      <g className="animate-sway" style={{ transformOrigin: "150px 300px", animationDelay: "0.6s" }}>
        <rect x="146" y="270" width="8" height="35" fill="#5C4326" />
        <circle cx="150" cy="260" r="22" fill="#4C9A4A" />
      </g>

      {/* Moulin */}
      <g>
        <rect x="205" y="190" width="26" height="110" fill="#B3462F" />
        <polygon points="205,190 231,190 218,160" fill="#7A2E1D" />
        {/* Pales — pivotent autour du centre du moulin */}
        <g className="animate-spin-slow" style={{ transformOrigin: "218px 175px" }}>
          <rect x="215" y="120" width="6" height="55" fill="#2B2118" />
          <rect x="215" y="175" width="6" height="55" fill="#2B2118" />
          <rect x="190" y="172" width="55" height="6" fill="#2B2118" />
          <rect x="245" y="172" width="55" height="6" fill="#2B2118" />
        </g>
        <circle cx="218" cy="175" r="6" fill="#2B2118" />
      </g>

      {/* Grange + silo */}
      <g>
        <rect x="245" y="230" width="70" height="70" fill="#B3462F" />
        <polygon points="245,230 315,230 280,200" fill="#7A2E1D" />
        <rect x="270" y="265" width="20" height="35" fill="#5C4326" />
        <circle cx="330" cy="255" r="18" fill="#C9C9C9" />
        <rect x="312" y="255" width="36" height="45" fill="#C9C9C9" />
      </g>

      {/* Tracteur + remorque de foin — entre en scène puis reste en place */}
      <g className="animate-drive-in" style={{ transformOrigin: "center" }}>
        {/* Remorque */}
        <g transform="translate(830,0)">
          <rect x="0" y="255" width="90" height="30" rx="3" fill="#2B2118" />
          <ellipse cx="30" cy="258" rx="35" ry="16" fill="#E3C077" />
          <ellipse cx="60" cy="255" rx="30" ry="14" fill="#F2DBA0" />
          <circle cx="18" cy="288" r="14" fill="#2B2118" />
          <circle cx="72" cy="288" r="14" fill="#2B2118" />
          <circle cx="18" cy="288" r="5" fill="#8A8A8A" />
          <circle cx="72" cy="288" r="5" fill="#8A8A8A" />
        </g>

        {/* Tracteur */}
        <g transform="translate(730,0)">
          <rect x="0" y="245" width="70" height="30" rx="4" fill="#C22A1E" />
          <rect x="8" y="205" width="34" height="42" rx="4" fill="#2E8B57" />
          <rect x="13" y="210" width="24" height="18" rx="2" fill="#C9EEF7" />
          <circle cx="20" cy="288" r="20" fill="#2B2118" />
          <circle cx="20" cy="288" r="8" fill="#8A8A8A" />
          <circle cx="62" cy="290" r="13" fill="#2B2118" />
          <circle cx="62" cy="290" r="5" fill="#8A8A8A" />
          <rect x="66" y="255" width="18" height="8" fill="#2B2118" />
        </g>
      </g>

      {/* Herbe au premier plan */}
      <rect x="0" y="316" width="1200" height="104" fill="#5C9E43" />
    </svg>
  );
}
