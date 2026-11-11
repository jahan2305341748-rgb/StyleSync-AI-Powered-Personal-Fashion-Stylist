// The game character, drawn with SVG. It changes with body type, skin color and clothes.
export default function Character({ bodyType, skin, top, bottom, style }) {
  // body width depends on body type
  const widths = { slim: 44, average: 56, athletic: 68, plus: 82 };
  const w = widths[bodyType] || 56;
  const half = w / 2;

  return (
    <svg viewBox="0 0 200 340" className="character">
      {/* shadow on the ground */}
      <ellipse cx="100" cy="325" rx="60" ry="8" fill="rgba(0,0,0,0.4)" />

      {/* legs (bottom clothes) */}
      <rect x={100 - half * 0.8} y="200" width={half * 0.75} height="110" rx="8" fill={bottom} />
      <rect x={100 + half * 0.05} y="200" width={half * 0.75} height="110" rx="8" fill={bottom} />

      {/* shoes */}
      <rect x={100 - half * 0.9} y="302" width={half * 0.9} height="16" rx="6" fill="#222" />
      <rect x={100} y="302" width={half * 0.9} height="16" rx="6" fill="#222" />

      {/* arms (skin) */}
      <rect x={100 - half - 16} y="108" width="16" height="85" rx="8" fill={skin} />
      <rect x={100 + half} y="108" width="16" height="85" rx="8" fill={skin} />

      {/* sleeves for formal / sporty style */}
      {style !== "casual" && (
        <>
          <rect x={100 - half - 18} y="106" width="20" height="50" rx="8" fill={top} />
          <rect x={100 + half - 2} y="106" width="20" height="50" rx="8" fill={top} />
        </>
      )}

      {/* torso (top clothes) */}
      <rect x={100 - half} y="100" width={w} height="110" rx="14" fill={top} />

      {/* style details */}
      {style === "formal" && <polygon points="100,100 90,125 100,175 110,125" fill="white" opacity="0.9" />}
      {style === "sporty" && <rect x={100 - half} y="150" width={w} height="10" fill="white" opacity="0.8" />}

      {/* neck and head */}
      <rect x="92" y="85" width="16" height="20" fill={skin} />
      <circle cx="100" cy="58" r="30" fill={skin} />

      {/* hair and face */}
      <path d="M70 55 Q100 15 130 55 Q100 40 70 55Z" fill="#2b1b12" />
      <circle cx="90" cy="62" r="3" fill="#222" />
      <circle cx="110" cy="62" r="3" fill="#222" />
      <path d="M92 74 Q100 80 108 74" stroke="#222" strokeWidth="2" fill="none" />
    </svg>
  );
}
