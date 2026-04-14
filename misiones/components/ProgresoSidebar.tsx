// Stone noise
const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")";

interface Props {
  total: number;
  completadas: number;
  xpTotal: number;
  nivel: number;
  strikesActivos: number;
  bimestre: string;
}

export default function ProgresoSidebar({
  total, completadas, xpTotal, nivel, strikesActivos, bimestre,
}: Props) {
  const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;
  const filledSegments = Math.round((pct / 100) * 8);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
        border: "1px solid rgba(160,125,55,0.32)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
      }}
    >
      {/* Inner frame */}
      <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.08)]" />

      {/* Corner ◆ */}
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>

      {/* Candlelight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,148,40,0.06)_0%,transparent_55%)]" />

      {/* Top rule */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.3)] to-transparent" />

      {/* ── Header ── */}
      <div className="relative flex items-center justify-between px-5 py-4 border-b border-[rgba(160,125,55,0.15)]">
        <p className="text-[9px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.5)]">
          Progreso {bimestre}
        </p>
        <span className="font-serif text-lg font-bold text-[#c8a84b]">{pct}%</span>
      </div>

      {/* ── Segmented progress bar ── */}
      <div className="relative px-5 py-4 border-b border-[rgba(160,125,55,0.15)]">
        <div className="flex gap-0.5 h-2 mb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 ${i < filledSegments ? "xp-bar-fill" : "bg-[rgba(160,125,55,0.1)]"}`}
              style={{ clipPath: "polygon(0 0, calc(100% - 1px) 0, 100% 100%, 1px 100%)" }}
            />
          ))}
        </div>
        <p className="text-[10px] font-serif text-[rgba(160,125,55,0.4)]">
          {completadas} de {total} misiones completadas
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="relative grid grid-cols-3 divide-x divide-[rgba(160,125,55,0.15)]">
        <div className="px-4 py-4 text-center">
          <p className="font-serif text-xl font-bold text-[#c8a84b] tabular-nums">
            {xpTotal.toLocaleString("es-AR")}
          </p>
          <p className="text-[8px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.4)] mt-0.5">XP</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="font-serif text-xl font-bold text-[rgba(232,224,208,0.7)]">{nivel}</p>
          <p className="text-[8px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.4)] mt-0.5">Nivel</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className={`font-serif text-xl font-bold ${
            strikesActivos >= 3 ? "text-danger" : strikesActivos > 0 ? "text-[rgba(212,140,23,0.8)]" : "text-[rgba(160,125,55,0.5)]"
          }`}>
            {strikesActivos}
          </p>
          <p className="text-[8px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.4)] mt-0.5">Strikes</p>
        </div>
      </div>
    </div>
  );
}
