import { Lamina, LaminaStatus } from "@/laminas/types";

interface LaminasListProps {
  laminas: Lamina[];
  activeBimestre: string;
}

// Stone noise
const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

const STATUS_CONFIG: Record<LaminaStatus, { label: string; color: string; border: string; bg: string }> = {
  entregada:    { label: "Entregada",    color: "text-[#c8a84b]",             border: "border-[rgba(160,125,55,0.35)]", bg: "bg-[rgba(160,125,55,0.08)]" },
  tardía:       { label: "Tardía",       color: "text-[rgba(212,140,23,0.8)]", border: "border-[rgba(212,140,23,0.3)]",  bg: "bg-[rgba(212,140,23,0.07)]" },
  pendiente:    { label: "Pendiente",    color: "text-[rgba(136,153,170,0.7)]", border: "border-[rgba(136,153,170,0.2)]", bg: "bg-[rgba(136,153,170,0.05)]" },
  no_entregada: { label: "No entregada", color: "text-[rgba(136,153,170,0.35)]", border: "border-[rgba(136,153,170,0.12)]", bg: "bg-[rgba(0,0,0,0.1)]" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function BimestreTable({ laminas }: { laminas: Lamina[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
        border: "1px solid rgba(160,125,55,0.28)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.55)",
      }}
    >
      {/* Header row */}
      <div className="grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 border-b border-[rgba(160,125,55,0.15)] px-5 py-2.5">
        {["Tipo", "Tarea", "Vencimiento", "Entregado", "Estado", "XP"].map((col) => (
          <p key={col} className="text-[8px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.45)]">
            {col}
          </p>
        ))}
      </div>

      <div className="flex flex-col">
        {laminas.map((lamina, i) => {
          const status = STATUS_CONFIG[lamina.status];
          const isPending = lamina.status === "no_entregada" || lamina.status === "pendiente";
          return (
            <div
              key={lamina.id}
              className={`grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 items-center px-5 py-3.5 transition-colors hover:bg-[rgba(200,168,75,0.02)] ${
                i !== laminas.length - 1 ? "border-b border-[rgba(160,125,55,0.1)]" : ""
              } ${isPending ? "opacity-45" : ""}`}
            >
              {/* Type badge — straight */}
              <span className="w-fit px-2 py-0.5 text-[9px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.6)] border border-[rgba(160,125,55,0.2)] bg-[rgba(160,125,55,0.06)]">
                {lamina.productionType}
              </span>

              {/* Title */}
              <div className="min-w-0">
                <p className="font-serif text-sm text-[rgba(232,224,208,0.8)] leading-tight truncate">{lamina.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {lamina.strikeAdded && (
                    <p className="text-[9px] font-serif text-danger uppercase tracking-wider">+1 Strike</p>
                  )}
                  {lamina.isEarly && (
                    <p className="text-[9px] font-serif text-[#c8a84b]/70 uppercase tracking-wider">◆ Anticipada</p>
                  )}
                </div>
              </div>

              <p className="font-serif text-xs text-[rgba(160,125,55,0.45)]">{lamina.dueDate ? formatDate(lamina.dueDate) : "—"}</p>
              <p className="font-serif text-xs text-[rgba(160,125,55,0.45)]">{lamina.submittedAt ? formatDate(lamina.submittedAt) : "—"}</p>

              {/* Status pill — straight */}
              <span className={`w-fit border px-2 py-0.5 text-[9px] font-serif ${status.bg} ${status.border} ${status.color}`}>
                {status.label}
              </span>

              <p className={`font-serif text-sm font-bold tabular-nums ${lamina.xpEarned ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.25)]"}`}>
                {lamina.xpEarned ? `+${lamina.xpEarned}` : "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LaminasList({ laminas, activeBimestre }: LaminasListProps) {
  const active = laminas.filter((l) => l.bimestre === activeBimestre);
  const previous = laminas.filter((l) => l.bimestre !== activeBimestre);
  const previousBimestres = [...new Set(previous.map((l) => l.bimestre))].sort();

  const totalXp = laminas.reduce((sum, l) => sum + (l.xpEarned ?? 0), 0);
  const strikesGenerados = laminas.filter((l) => l.strikeAdded).length;
  const pendientes = laminas.filter((l) => l.status === "no_entregada").length;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Summary seals ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "XP Acumulada",      value: totalXp.toLocaleString("es-AR") + " XP", color: "text-[#c8a84b] gold-glow-sm" },
          { label: "Strikes Generados",  value: String(strikesGenerados),                 color: "text-danger" },
          { label: "Pendientes",         value: String(pendientes),                       color: "text-[rgba(136,153,170,0.6)]" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="relative p-4 overflow-hidden"
            style={{
              background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
              border: "1px solid rgba(160,125,55,0.28)",
            }}
          >
            <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.07)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(200,148,40,0.05)_0%,transparent_55%)]" />
            <p className="relative text-[8px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.45)] mb-1.5">{label}</p>
            <p className={`relative font-serif text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Bimestre activo ── */}
      {active.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="gold-divider w-6" />
            <p className="text-[9px] font-serif uppercase tracking-[0.28em] text-[#c8a84b] shrink-0">
              {activeBimestre}
            </p>
            <span className="text-[8px] font-serif uppercase tracking-[0.18em] text-[rgba(200,168,75,0.6)] border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.08)] px-2 py-0.5">
              Activo
            </span>
            <div className="gold-divider flex-1" />
          </div>
          <BimestreTable laminas={active} />
        </section>
      )}

      {/* ── Bimestres anteriores ── */}
      {previousBimestres.map((bim) => {
        const rows = previous.filter((l) => l.bimestre === bim);
        return (
          <section key={bim} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-gradient-to-r from-transparent to-[rgba(160,125,55,0.2)]" />
              <p className="text-[9px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.35)] shrink-0">{bim}</p>
              <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.2)] to-transparent" />
            </div>
            <BimestreTable laminas={rows} />
          </section>
        );
      })}

      {laminas.length === 0 && (
        <p className="font-serif text-sm italic text-[rgba(160,125,55,0.4)] text-center py-12">
          Todavía no hay entregas registradas.
        </p>
      )}
    </div>
  );
}
