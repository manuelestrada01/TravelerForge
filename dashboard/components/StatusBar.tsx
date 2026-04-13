"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import type { Strike } from "@/lib/supabase/game";
import type { Talent } from "@/talentos/types";
import type { FormativeClassEntry } from "@/lib/supabase/classes";
import CharacterSheet from "@/dashboard/components/CharacterSheet";

gsap.registerPlugin(useGSAP);

const MAX_STRIKES = 3;
const SEGMENTS = 10;

const REASON_LABELS: Record<string, { label: string; color: string }> = {
  no_submission:    { label: "No entrega",               color: "text-danger" },
  late_submission:  { label: "Entrega fuera de término", color: "text-gold" },
  missing_material: { label: "Falta de material",        color: "text-gold" },
};

const STRIKE_MESSAGES: Record<number, string> = {
  0: "Sin incumplimientos activos.",
  1: "1/3 — Mantené la rectitud técnica.",
  2: "2/3 — Un más bloqueará el bimestre.",
  3: "3/3 — Bimestre bloqueado.",
};

function formatXp(v: number) { return v.toLocaleString("es-AR"); }
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

function useCountUp(target: number, duration = 1300) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(easeOutCubic(p) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return count;
}

// ─── Strikes Popup ──────────────────────────────────────────────────────────

function StrikesPopup({ strikeDetails, onClose }: { strikeDetails: Strike[]; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.timeline()
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" })
      .fromTo(cardRef.current, { opacity: 0, scale: 0.88, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }, "-=0.1");
  }, { scope: overlayRef });

  function handleClose() {
    gsap.timeline({ onComplete: onClose })
      .to(cardRef.current, { opacity: 0, scale: 0.88, y: 16, duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.15 }, "-=0.1");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div ref={cardRef} className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {/* Corner ornaments */}
        <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-danger/40 rounded-tl" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-danger/40 rounded-tr" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-danger/40 rounded-bl" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-danger/40 rounded-br" />

        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-hud-border bg-hud-surface text-sage hover:text-cream transition-colors"
        >
          <X size={14} />
        </button>

        <div className="hud-panel hud-panel-danger relative flex flex-col overflow-hidden p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,62,62,0.04)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-danger/40 to-transparent" />

          <div className="relative flex flex-col items-center mb-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
              <ShieldAlert size={22} strokeWidth={1.4} className="text-danger" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-sage/60">Registro de Incumplimientos</p>
            <div className="mt-3 gold-divider w-16" />
          </div>

          <div className="relative flex flex-col gap-2">
            {strikeDetails.length === 0 ? (
              <p className="text-xs text-sage/60 text-center py-4">Sin incumplimientos registrados.</p>
            ) : strikeDetails.map((strike, i) => {
              const reason = REASON_LABELS[strike.reason] ?? { label: strike.reason, color: "text-sage" };
              return (
                <div key={strike.id} className="flex items-start gap-3 rounded border border-hud-border bg-hud-base p-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-danger/40 bg-danger/10 text-[10px] font-bold text-danger">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold leading-tight ${reason.color}`}>{reason.label}</p>
                    <p className="mt-0.5 text-[10px] text-sage/60 uppercase tracking-wider">{strike.bimestre} · {formatDate(strike.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-danger/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// ─── StatusBar ───────────────────────────────────────────────────────────────

interface StatusBarProps {
  xp: number;
  xpCurrentLevel: number;
  xpNextLevel: number;
  level: number;
  levelName: string;
  studentName: string;
  blocked: boolean;
  strikes: number;
  strikeDetails: Strike[];
  classEntry: FormativeClassEntry | null;
  talents: Talent[];
}

export default function StatusBar({
  xp, xpCurrentLevel, xpNextLevel, level, levelName, studentName,
  blocked, strikes, strikeDetails, classEntry, talents,
}: StatusBarProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const animatedXp = useCountUp(xp);
  const clamped = Math.min(strikes, MAX_STRIKES);
  const progress = Math.min(((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100, 100);
  const hasDetails = strikeDetails.length > 0;
  const strikeMessage = STRIKE_MESSAGES[clamped] ?? STRIKE_MESSAGES[3];

  // Filled segments count
  const filledSegments = Math.round((progress / 100) * SEGMENTS);

  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const badge = badgeRef.current;
      if (!badge) return;

      // Idle breathing glow
      gsap.to(badge, {
        boxShadow: "0 0 18px rgba(201,162,39,0.5), 0 0 6px rgba(201,162,39,0.2) inset",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const onEnter = contextSafe!(() => {
        gsap.killTweensOf(badge, "boxShadow");
        gsap.to(badge, { scale: 1.08, boxShadow: "0 0 28px rgba(201,162,39,0.8)", duration: 0.25, ease: "power2.out" });
      });

      const onLeave = contextSafe!(() => {
        gsap.to(badge, {
          scale: 1, boxShadow: "0 0 6px rgba(201,162,39,0.1)", duration: 0.3, ease: "power2.out",
          onComplete: () => { gsap.to(badge, {
            boxShadow: "0 0 18px rgba(201,162,39,0.5)", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut",
          }); },
        });
      });

      const onClick = contextSafe!(() => {
        gsap.timeline()
          .to(badge, { scale: 0.9, duration: 0.1, ease: "power2.in" })
          .to(badge, { scale: 1.06, duration: 0.2, ease: "back.out(2)" })
          .to(badge, { scale: 1, duration: 0.15 });
      });

      badge.addEventListener("mouseenter", onEnter);
      badge.addEventListener("mouseleave", onLeave);
      badge.addEventListener("click", onClick);
      return () => {
        badge.removeEventListener("mouseenter", onEnter);
        badge.removeEventListener("mouseleave", onLeave);
        badge.removeEventListener("click", onClick);
      };
    },
    { scope: containerRef }
  );

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`hud-panel ${blocked ? "hud-panel-danger" : ""} flex overflow-hidden`}
      >
        {/* ── Level badge + XP ── */}
        <div className="flex flex-1 gap-4 px-5 py-4">

          {/* Octagonal level badge */}
          <button
            ref={badgeRef}
            onClick={() => setSheetOpen(true)}
            title="Ver Hoja de Personaje"
            className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 octagon bg-gold cursor-pointer"
          >
            <span className="font-serif text-2xl font-bold text-hud-base leading-none tabular-nums">
              {level}
            </span>
          </button>

          {/* XP details */}
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-medium uppercase tracking-widest text-sage">
                Resonancia de Experiencia
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl font-bold text-gold tabular-nums gold-glow-sm">
                  {formatXp(animatedXp)}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sage">XP</span>
              </div>
            </div>

            <p className="mb-2 text-[9px] uppercase tracking-wider text-sage/60">
              {levelName} · {studentName}
              {blocked && <span className="ml-2 text-danger">· Bimestre bloqueado</span>}
            </p>

            {/* Segmented XP bar */}
            <div className="flex gap-0.5 h-2.5">
              {Array.from({ length: SEGMENTS }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.25, ease: "easeOut" }}
                  className={`flex-1 origin-left ${
                    i < filledSegments
                      ? blocked ? "bg-danger/60 shadow-[0_0_4px_rgba(229,62,62,0.6)]" : "xp-bar-fill"
                      : "bg-hud-border/50"
                  }`}
                  style={{ clipPath: "polygon(0 0, calc(100% - 2px) 0, 100% 100%, 2px 100%)" }}
                />
              ))}
            </div>

            <div className="mt-1.5 flex justify-between">
              <p className="text-[9px] uppercase tracking-wider text-sage/60">
                → {formatXp(xpNextLevel)} XP
              </p>
              <p className="text-[9px] uppercase tracking-wider text-sage/80">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="w-px bg-hud-border my-3" />

        {/* ── Strikes ── */}
        <div
          onClick={() => hasDetails && setPopupOpen(true)}
          className={`flex w-52 flex-col justify-center px-5 py-4 transition-colors ${
            hasDetails ? "cursor-pointer hover:bg-danger/5" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-sage">
              Strikes Académicos
            </p>
            {clamped >= 2 && (
              <motion.div animate={{ x: [0, -2, 2, -1, 0] }} transition={{ duration: 0.4, delay: 0.6 }}>
                <AlertTriangle size={12} className="text-gold" />
              </motion.div>
            )}
          </div>

          <div className="flex gap-1.5 mb-2">
            {Array.from({ length: MAX_STRIKES }).map((_, i) => {
              const isActive = i < clamped;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isActive ? {
                    scale: 1, opacity: 1,
                    boxShadow: ["0 0 0px rgba(229,62,62,0)", "0 0 8px rgba(229,62,62,0.6)", "0 0 0px rgba(229,62,62,0)"],
                  } : { scale: 1, opacity: 1 }}
                  transition={isActive ? {
                    scale: { delay: i * 0.1, type: "spring", stiffness: 380, damping: 14 },
                    boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                  } : {
                    scale: { delay: i * 0.1, duration: 0.3 },
                    opacity: { delay: i * 0.1, duration: 0.3 },
                  }}
                  className={`relative flex h-10 flex-1 items-center justify-center text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-danger/20 text-danger border border-danger/50"
                      : "bg-hud-base border border-hud-border/60 text-hud-border"
                  }`}
                  style={{ clipPath: "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))" }}
                >
                  {/* Rune corner on empty slots */}
                  {!isActive && <span className="absolute top-0.5 left-0.5 text-[5px] text-hud-border/50">◆</span>}
                  ✕
                </motion.div>
              );
            })}
          </div>

          <p className="text-[10px] leading-relaxed text-sage">{strikeMessage}</p>
          {hasDetails && (
            <p className="mt-1 text-[9px] uppercase tracking-wider text-danger/50">Toca para ver el detalle</p>
          )}
        </div>
      </motion.div>

      {popupOpen && <StrikesPopup strikeDetails={strikeDetails} onClose={() => setPopupOpen(false)} />}

      <CharacterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        studentName={studentName}
        level={level}
        levelName={levelName}
        classEntry={classEntry}
        talents={talents}
      />
    </>
  );
}
