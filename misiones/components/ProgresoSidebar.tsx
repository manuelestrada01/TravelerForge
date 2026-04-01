interface Props {
  total: number;
  completadas: number;
  xpTotal: number;
  nivel: number;
  strikesActivos: number;
  bimestre: string;
}

export default function ProgresoSidebar({
  total,
  completadas,
  xpTotal,
  nivel,
  strikesActivos,
  bimestre,
}: Props) {
  const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-[#0F2411] border border-[#1e3320] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1e3320] flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
          Progreso {bimestre}
        </p>
        <span className="font-serif italic text-[#c9a227] text-lg">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-4 border-b border-[#1e3320]">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0d1a0f]">
          <div
            className="h-full bg-gradient-to-r from-[#4a8f5a] via-[#8fbc8f] to-[#c9a227] shadow-[0_0_8px_rgba(201,162,39,0.35)] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-[#9aab8a]/70 mt-2">
          {completadas} de {total} misiones completadas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-[#1e3320]">
        <div className="px-4 py-4 text-center">
          <p className="font-serif text-xl text-[#c9a227]">
            {xpTotal.toLocaleString("es-AR")}
          </p>
          <p className="text-[9px] uppercase tracking-widest text-[#9aab8a] mt-0.5">XP</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="font-serif text-xl text-[#8fbc8f]">{nivel}</p>
          <p className="text-[9px] uppercase tracking-widest text-[#9aab8a] mt-0.5">Nivel</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p
            className={`font-serif text-xl ${
              strikesActivos >= 3
                ? "text-[#c0392b]"
                : strikesActivos > 0
                ? "text-[#c9a227]"
                : "text-[#8fbc8f]"
            }`}
          >
            {strikesActivos}
          </p>
          <p className="text-[9px] uppercase tracking-widest text-[#9aab8a] mt-0.5">Strikes</p>
        </div>
      </div>
    </div>
  );
}
