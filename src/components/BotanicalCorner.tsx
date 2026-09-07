"use client";

/**
 * Original, procedurally-generated fern-frond line art -- not traced or
 * copied from any reference. A simple stem curve with alternating leaflet
 * ellipses, parameterized so each corner placement can vary in size/count/
 * curve without needing hand-authored artwork per instance.
 */
function Frond({
  leaves = 7,
  length = 220,
  curve = 46,
  color,
}: {
  leaves?: number;
  length?: number;
  curve?: number;
  color: string;
}) {
  const stemPath = `M0,${length} Q${curve},${length / 2} 0,0`;

  const leafletts = Array.from({ length: leaves }, (_, i) => {
    const t = (i + 1) / (leaves + 1);
    const y = length * (1 - t);
    const x = 2 * curve * t * (1 - t);
    const side = i % 2 === 0 ? 1 : -1;
    const leafLen = 14 + (1 - t) * 16;
    return { x, y, side, leafLen, key: i };
  });

  return (
    <svg
      viewBox={`-70 -10 140 ${length + 20}`}
      className="h-full w-full overflow-visible"
      fill="none"
    >
      <path d={stemPath} stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      {leafletts.map((l) => (
        <ellipse
          key={l.key}
          cx={l.x + (l.side * l.leafLen) / 2}
          cy={l.y}
          rx={l.leafLen / 2}
          ry={l.leafLen / 5.2}
          fill={color}
          opacity={0.55}
          transform={`rotate(${l.side * 32}, ${l.x}, ${l.y})`}
        />
      ))}
    </svg>
  );
}

export function BotanicalCorner({
  className,
  flipX = false,
  flipY = false,
  colors,
}: {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
  colors: [string, string];
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute h-56 w-40 ${className ?? ""}`}
      style={{
        transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
      }}
    >
      <div className="absolute inset-0 -translate-x-6">
        <Frond leaves={8} length={230} curve={50} color={colors[0]} />
      </div>
      <div className="absolute inset-0 translate-x-8 scale-75 opacity-80">
        <Frond leaves={6} length={190} curve={-40} color={colors[1]} />
      </div>
    </div>
  );
}
