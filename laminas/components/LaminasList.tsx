import { Lamina, LaminaStatus } from "@/laminas/types";

interface LaminasListProps {
  laminas: Lamina[];
  activeBimestre: string;
}

const STATUS_CONFIG: Record<LaminaStatus, { label: string; color: string; bg: string }> = {
  entregada:    { label: "Entregada",    color: "text-teal",       bg: "bg-teal/10 border-teal/30" },
  tardía:       { label: "Tardía",       color: "text-gold",       bg: "bg-gold/10 border-gold/30" },
  pendiente:    { label: "Pendiente",    color: "text-sage",       bg: "bg-hud-card border-hud-border" },
  no_entregada: { label: "No entregada", color: "text-sage/40",    bg: "bg-hud-card border-hud-border/50" },
};

const TYPE_BADGE: Record<string, string> = {
  A4:  "type-badge-a4",
  A3:  "type-badge-a3",
  CAL: "type-badge-cal",
  CAD: "type-badge-cal",
  EVA: "type-badge-eva",
  EVT: "type-badge-evt",
};

function typeBadgeClass(tipo: string): string {
  return TYPE_BADGE[tipo] ?? "type-badge-cal";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function BimestreTable({ laminas }: { laminas: Lamina[] }) {
  return (
    <div className="hud-panel overflow-hidden p-0">
      {/* Header row */}
      <div className="grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 border-b border-hud-border px-5 py-2.5">
        {["Tipo", "Tarea", "Vencimiento", "Entregado", "Estado", "XP"].map((col) => (
          <p key={col} className="text-[9px] font-semibold uppercase tracking-widest text-sage/50">
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
              className={`grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 items-center px-5 py-3.5 transition-colors hover:bg-hud-card/50 ${
                i !== laminas.length - 1 ? "border-b border-hud-border/50" : ""
              } ${isPending ? "opacity-50" : ""}`}
            >
              {/* Type badge */}
              <span
                className={`w-fit px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${typeBadgeClass(lamina.productionType)}`}
                style={{ clipPath: "polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))" }}
              >
                {lamina.productionType}
              </span>

              {/* Title */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-cream leading-tight truncate">{lamina.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {lamina.strikeAdded && (
                    <p className="text-[9px] text-danger uppercase tracking-wider">+1 Strike</p>
                  )}
                  {lamina.isEarly && (
                    <p className="text-[9px] text-teal uppercase tracking-wider">◆ Anticipada</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-sage">{lamina.dueDate ? formatDate(lamina.dueDate) : "—"}</p>
              <p className="text-xs text-sage">{lamina.submittedAt ? formatDate(lamina.submittedAt) : "—"}</p>

              {/* Status pill */}
              <span
                className={`w-fit border px-2 py-0.5 text-[9px] font-semibold ${status.bg} ${status.color}`}
                style={{ clipPath: "polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))" }}
              >
                {status.label}
              </span>

              <p className={`text-sm font-bold tabular-nums ${lamina.xpEarned ? "text-teal" : "text-sage/30"}`}>
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

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "XP acumulada",      value: totalXp.toLocaleString("es-AR") + " XP", color: "text-gold gold-glow-sm" },
          { label: "Strikes generados",  value: String(strikesGenerados),                 color: "text-danger" },
          { label: "Pendientes",         value: String(pendientes),                       color: "text-sage" },
        ].map(({ label, value, color }) => (
          <div key={label} className="hud-panel p-4">
            <p className="text-[9px] uppercase tracking-widest text-sage/50 mb-1">{label}</p>
            <p className={`font-serif text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Bimestre activo ── */}
      {active.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="gold-divider w-6" />
            <p className="text-[10px] uppercase tracking-widest text-gold font-semibold shrink-0">
              {activeBimestre}
            </p>
            <span
              className="text-[9px] uppercase tracking-wider text-gold border border-gold/30 bg-gold/10 px-2 py-0.5"
              style={{ clipPath: "polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))" }}
            >
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
              <div className="h-px w-6 bg-hud-border/50" />
              <p className="text-[10px] uppercase tracking-widest text-sage/50 font-semibold shrink-0">{bim}</p>
              <div className="h-px flex-1 bg-hud-border/40" />
            </div>
            <BimestreTable laminas={rows} />
          </section>
        );
      })}

      {laminas.length === 0 && (
        <p className="text-sm text-sage/50 text-center py-12">
          Todavía no hay entregas registradas.
        </p>
      )}
    </div>
  );
}
