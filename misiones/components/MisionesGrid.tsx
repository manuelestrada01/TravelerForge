"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mision } from "@/misiones/types";
import { Check, AlertCircle, Clock, Trophy, Zap, ChevronDown, ChevronUp } from "lucide-react";

gsap.registerPlugin(useGSAP);

const VISIBLE_COUNT = 3;

function deadlineInfo(dueAt: Date | null): { text: string; urgent: boolean; overdue: boolean } {
  if (!dueAt) return { text: "Sin fecha límite", urgent: false, overdue: false };
  const diff = Math.ceil((dueAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: `Venció hace ${Math.abs(diff)} día${Math.abs(diff) === 1 ? "" : "s"}`, urgent: false, overdue: true };
  if (diff === 0) return { text: "Vence hoy", urgent: true, overdue: false };
  if (diff === 1) return { text: "Vence mañana", urgent: true, overdue: false };
  if (diff <= 4) return { text: `Vence en ${diff} días`, urgent: true, overdue: false };
  return { text: `Vence en ${diff} días`, urgent: false, overdue: false };
}

function MisionCard({ m, dataAttr }: { m: Mision; dataAttr?: string }) {
  const dl = deadlineInfo(m.dueAt);
  const borderAccent = dl.overdue ? "border-l-danger" : dl.urgent ? "border-l-gold" : "border-l-teal/40";

  return (
    <div
      data-mision={dataAttr}
      className={`hud-panel border-l-2 ${borderAccent} p-5 flex flex-col gap-3 hover:brightness-110 transition-all`}
    >
      {/* Top row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[9px] uppercase tracking-widest font-bold text-sage px-2 py-0.5 bg-hud-border/30"
          style={{ clipPath: "polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))" }}
        >
          {m.tipo}
        </span>
        {(dl.urgent || dl.overdue) && (
          <span className={`flex items-center gap-1 text-[9px] uppercase tracking-wide font-semibold px-1.5 py-0.5 ${
            dl.overdue ? "text-danger border border-danger/40 bg-danger/10" : "text-gold border border-gold/30 bg-gold/10"
          }`}
            style={{ clipPath: "polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))" }}
          >
            <AlertCircle size={8} strokeWidth={2.5} />
            {dl.overdue ? "Atrasada" : "Urgente"}
          </span>
        )}
        <span className="ml-auto font-serif text-sm font-bold text-teal">
          +{m.xpReward.toLocaleString("es-AR")} XP
        </span>
      </div>

      <h4 className="font-serif text-base text-cream leading-snug flex-1">{m.title}</h4>

      <p className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${dl.overdue ? "text-danger/70" : "text-sage/60"}`}>
        <Clock size={9} strokeWidth={1.5} />
        {dl.text}
      </p>
    </div>
  );
}

interface Props {
  pendientes: Mision[];
  completadas: Mision[];
  xpTotal: number;
  nivel: number;
  total: number;
}

export default function MisionesGrid({ pendientes, completadas, xpTotal, nivel, total }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const progressPct = total > 0 ? Math.round((completadas.length / total) * 100) : 0;
  const filledSegments = Math.round((progressPct / 100) * 10);
  const visible = pendientes.slice(0, VISIBLE_COUNT);
  const hidden = pendientes.slice(VISIBLE_COUNT);
  const hasMore = hidden.length > 0;

  const { contextSafe } = useGSAP(
    () => {
      gsap.fromTo("[data-stat]", { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.35, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-mision='visible']", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.45, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-card-completada]", { opacity: 0, x: -8 }, { opacity: 1, x: 0, stagger: 0.04, duration: 0.3, ease: "power2.out", delay: 0.45 });
    },
    { scope: containerRef }
  );

  const handleToggle = contextSafe(() => {
    if (!expanded) {
      setExpanded(true);
      gsap.fromTo(
        "[data-mision='hidden']",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.38, ease: "power3.out", delay: 0.02 }
      );
    } else {
      gsap.to("[data-mision='hidden']", {
        opacity: 0, y: 10, stagger: 0.05, duration: 0.22, ease: "power2.in",
        onComplete: () => setExpanded(false),
      });
    }
  });

  return (
    <div ref={containerRef} className="flex flex-col gap-8">

      {/* ── Stats strip ── */}
      <div className="hud-panel px-6 py-4 flex items-center gap-6 overflow-hidden">
        {/* Progress bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-widest text-sage/60">Progreso del bimestre</p>
            <p className="text-[10px] uppercase tracking-widest text-sage">{progressPct}%</p>
          </div>
          {/* Segmented bar */}
          <div className="flex gap-0.5 h-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${i < filledSegments ? "xp-bar-fill" : "bg-hud-border/40"}`}
                style={{ clipPath: "polygon(0 0, calc(100% - 2px) 0, 100% 100%, 2px 100%)" }}
              />
            ))}
          </div>
        </div>

        <div className="h-8 w-px bg-hud-border" />

        {[
          { label: "Completadas", value: `${completadas.length}/${total}`, color: "text-cream" },
          { label: "XP Total", value: `${xpTotal.toLocaleString("es-AR")} XP`, color: "text-gold gold-glow-sm" },
          { label: "Nivel", value: String(nivel), color: "text-teal" },
        ].map(({ label, value, color }) => (
          <div key={label} data-stat className="text-center" style={{ opacity: 0 }}>
            <p className="text-[9px] uppercase tracking-widest text-sage/50 mb-0.5">{label}</p>
            <p className={`font-serif text-lg font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Misiones Activas ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={14} className="text-gold" />
          <h3 className="font-serif text-xl text-cream">Misiones Activas</h3>
          {pendientes.length > 0 && (
            <span
              className="ml-auto text-[10px] font-semibold text-gold border border-gold/30 bg-gold/10 px-2.5 py-0.5"
              style={{ clipPath: "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))" }}
            >
              {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {pendientes.length === 0 ? (
          <div className="hud-panel flex items-center gap-3 p-6 text-sage text-sm italic">
            <Check size={14} className="text-teal shrink-0" />
            Todo al día — no hay misiones pendientes en este bimestre.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {visible.map((m) => <MisionCard key={m.id} m={m} dataAttr="visible" />)}
            </div>

            {expanded && (
              <div className="grid grid-cols-2 gap-3">
                {hidden.map((m) => <MisionCard key={m.id} m={m} dataAttr="hidden" />)}
              </div>
            )}

            {hasMore && (
              <button
                onClick={handleToggle}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-hud-border bg-hud-card text-[10px] uppercase tracking-widest text-sage hover:text-gold hover:border-gold/30 transition-colors"
                style={{ clipPath: "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))" }}
              >
                {expanded ? (
                  <><ChevronUp size={12} strokeWidth={2} /> Ver menos</>
                ) : (
                  <><ChevronDown size={12} strokeWidth={2} /> Ver {hidden.length} misión{hidden.length !== 1 ? "es" : ""} más</>
                )}
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Completadas ── */}
      {completadas.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Check size={13} className="text-teal" />
            <h3 className="font-serif text-lg text-sage">Completadas este bimestre</h3>
            <span className="ml-auto text-[10px] text-sage/40 tabular-nums">
              {completadas.length} misión{completadas.length !== 1 ? "es" : ""}
            </span>
          </div>
          <div className="hud-panel overflow-hidden p-0">
            {completadas.map((m, i) => {
              const fechaEntrega = m.submittedAt
                ? m.submittedAt.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
                : m.dueAt
                ? m.dueAt.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
                : null;
              return (
                <div
                  key={m.id}
                  data-card-completada
                  className={`flex items-center gap-3 px-5 py-3 group ${i !== completadas.length - 1 ? "border-b border-hud-border" : ""}`}
                >
                  <span className="text-teal/50 text-[8px]">✓</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-sage/40 shrink-0 w-8">{m.tipo}</span>
                  <span className="text-sm text-cream/60 truncate min-w-0">{m.title}</span>
                  <span className="flex-1 border-b border-dotted border-hud-border group-hover:border-sage/20 transition-colors mx-2 mb-0.5 min-w-4" />
                  <span className="text-[10px] text-sage/40 tabular-nums shrink-0">{fechaEntrega ?? "—"}</span>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {(m.xpBonus ?? 0) > 0 && (
                      <span className="flex items-center gap-0.5 text-[9px] text-teal/70 border border-teal/20 bg-teal/10 px-1 py-0.5">
                        <Zap size={7} className="text-teal/70" />
                        +{m.xpBonus}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-gold tabular-nums">+{m.xpReward.toLocaleString("es-AR")} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {pendientes.length === 0 && completadas.length === 0 && (
        <p className="text-sm text-sage/50 text-center py-16">Sin misiones registradas para este bimestre.</p>
      )}
    </div>
  );
}
