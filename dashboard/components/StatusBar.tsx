"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import type { Strike } from "@/lib/supabase/game";

gsap.registerPlugin(useGSAP);

const MAX_STRIKES = 3;
const SEGMENTS = 10;

// SVG stone noise — matches HeroSection texture
function toRoman(n: number): string {
  const map: [number, string][] = [[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let r = ""; let v = Math.max(1, n);
  for (const [num, sym] of map) { while (v >= num) { r += sym; v -= num; } }
  return r;
}

// Pre-computed scalloped seal path — 22 teeth, outer r=30, inner r=26
const SEAL_D = (() => {
  const cx = 32, cy = 32, n = 22;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI) / n - Math.PI / 2;
    const r = i % 2 === 0 ? 30 : 26;
    pts.push(`${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ") + "Z";
})();

const REASON_LABELS: Record<string, { label: string; color: string }> = {
  no_submission:    { label: "No entrega",               color: "text-danger" },
  late_submission:  { label: "Entrega fuera de término", color: "text-ember" },
  missing_material: { label: "Falta de material",        color: "text-ember" },
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
      .fromTo(cardRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }, "-=0.1");
  }, { scope: overlayRef });

  function handleClose() {
    gsap.timeline({ onComplete: onClose })
      .to(cardRef.current, { opacity: 0, scale: 0.9, y: 12, duration: 0.2, ease: "power2.in" })
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={handleClose}
    >
      <div ref={cardRef} className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Outer frame corners — wrought iron */}
        <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-danger/50" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-danger/50" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-danger/50" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-danger/50" />

        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center border border-[rgba(160,125,55,0.3)] bg-[#120e08] text-[rgba(200,168,75,0.6)] hover:text-[rgba(200,168,75,1)] transition-colors"
        >
          <X size={13} />
        </button>

        {/* Card — stone with danger tint */}
        <div
          className="relative flex flex-col overflow-hidden p-6"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"), linear-gradient(170deg, #1a0d0d 0%, #130808 100%)`,
            border: "1px solid rgba(180,60,60,0.35)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.9), 0 0 60px rgba(180,60,60,0.08)",
          }}
        >
          {/* Inner frame */}
          <div className="pointer-events-none absolute inset-[6px] border border-[rgba(180,60,60,0.1)]" />

          {/* Corner ◆ marks */}
          <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-danger/30 leading-none select-none">◆</span>
          <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-danger/30 leading-none select-none">◆</span>
          <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-danger/30 leading-none select-none">◆</span>
          <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-danger/30 leading-none select-none">◆</span>

          {/* Candlelight tint — blood red */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,30,30,0.06)_0%,transparent_65%)]" />
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-danger/30 to-transparent" />

          {/* Header */}
          <div className="relative flex flex-col items-center mb-5">
            {/* Seal icon */}
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center border border-danger/40 bg-danger/[0.08]"
              style={{ boxShadow: "0 0 16px rgba(230,57,70,0.15) inset" }}
            >
              <ShieldAlert size={28} strokeWidth={1.3} className="text-danger" />
            </div>
            <p className="text-[11px] font-serif uppercase tracking-[0.3em] text-[rgba(200,168,75,0.5)]">
              Registro de Incumplimientos
            </p>
            <div className="mt-3 w-16 h-px bg-gradient-to-r from-transparent via-danger/35 to-transparent" />
          </div>

          {/* Strike list */}
          <div className="relative flex flex-col gap-2">
            {strikeDetails.length === 0 ? (
              <p className="text-xs font-serif italic text-[rgba(200,168,75,0.4)] text-center py-4">
                Sin incumplimientos registrados.
              </p>
            ) : strikeDetails.map((strike, i) => {
              const reason = REASON_LABELS[strike.reason] ?? { label: strike.reason, color: "text-[rgba(200,168,75,0.7)]" };
              return (
                <div
                  key={strike.id}
                  className="flex items-start gap-3 border border-[rgba(180,60,60,0.2)] bg-[rgba(180,30,30,0.05)] p-3"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center border border-danger/40 bg-danger/[0.12] text-[12px] font-serif font-bold text-danger">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[15px] font-serif font-semibold leading-tight ${reason.color}`}>{reason.label}</p>
                    <p className="mt-0.5 text-[11px] font-serif uppercase tracking-wider text-[rgba(200,168,75,0.35)]">
                      {strike.bimestre} · {formatDate(strike.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom rule */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-danger/25 to-transparent" />
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
}

export default function StatusBar({
  xp, xpCurrentLevel, xpNextLevel, level, levelName, studentName,
  blocked, strikes, strikeDetails,
}: StatusBarProps) {
  const [popupOpen, setPopupOpen] = useState(false);

  const animatedXp = useCountUp(xp);
  const clamped = Math.min(strikes, MAX_STRIKES);
  const progress = Math.min(((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100, 100);
  const hasDetails = strikeDetails.length > 0;
  const strikeMessage = STRIKE_MESSAGES[clamped] ?? STRIKE_MESSAGES[3];

  const filledSegments = Math.round((progress / 100) * SEGMENTS);

  const roman = toRoman(level);
  const romanSize = roman.length <= 2 ? 16 : roman.length <= 4 ? 13 : 10;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`chronicle-stone relative overflow-hidden flex flex-col md:flex-row ${blocked ? "!border-[rgba(180,60,60,0.45)]" : ""}`}
      >
        {/* Corner ornaments */}
        <span className="pointer-events-none absolute top-[3px] left-[3px] text-[6px] text-[rgba(160,125,55,0.22)] leading-none select-none z-10">◆</span>
        <span className="pointer-events-none absolute top-[3px] right-[3px] text-[6px] text-[rgba(160,125,55,0.22)] leading-none select-none z-10">◆</span>
        <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[6px] text-[rgba(160,125,55,0.22)] leading-none select-none z-10">◆</span>
        <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[6px] text-[rgba(160,125,55,0.22)] leading-none select-none z-10">◆</span>
        {/* Candlelight glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.05)_0%,transparent_55%)]" />

        {/* ── Level seal + XP ── */}
        <div className="flex flex-1 items-center gap-5 px-6 py-4">

          {/* Level — display only */}
          <div
            className="flex-shrink-0 flex flex-col items-center justify-center"
            style={{ width: "52px", height: "52px", border: "1px solid rgba(200,168,75,0.22)", gap: "3px" }}
          >
            <span className="block w-full text-center text-[7px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.45)] leading-none">
              Nivel
            </span>
            <span
              className="block w-full text-center font-serif font-bold text-[rgba(200,168,75,0.85)] leading-none"
              style={{ fontSize: `${romanSize}px` }}
            >
              {roman}
            </span>
          </div>

          {/* XP details */}
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.6)]">
                Resonancia de Experiencia
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl font-bold text-[#c8a84b] tabular-nums gold-glow-sm">
                  {formatXp(animatedXp)}
                </span>
                <span className="text-[11px] font-serif uppercase tracking-wider text-[rgba(160,125,55,0.5)]">XP</span>
              </div>
            </div>

            <p className="mb-2 text-[11px] font-serif uppercase tracking-wider text-[rgba(200,168,75,0.4)]">
              {levelName} · {studentName}
              {blocked && <span className="ml-2 text-danger">· Bimestre bloqueado</span>}
            </p>

            {/* Segmented XP bar */}
            <div className="flex gap-0.5 h-2">
              {Array.from({ length: SEGMENTS }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25 + i * 0.04, duration: 0.22, ease: "easeOut" }}
                  className={`flex-1 origin-left ${
                    i < filledSegments
                      ? blocked
                        ? "bg-danger/60 shadow-[0_0_4px_rgba(230,57,70,0.5)]"
                        : "xp-bar-fill"
                      : "bg-[rgba(160,125,55,0.12)]"
                  }`}
                  style={{ clipPath: "polygon(0 0, calc(100% - 2px) 0, 100% 100%, 2px 100%)" }}
                />
              ))}
            </div>

            <div className="mt-1.5 flex justify-between">
              <p className="text-[11px] font-serif uppercase tracking-wider text-[rgba(160,125,55,0.4)]">
                → {formatXp(xpNextLevel)} XP
              </p>
              <p className="text-[11px] font-serif uppercase tracking-wider text-[rgba(200,168,75,0.5)]">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </div>

        {/* ── Divider — vertical on desktop, horizontal on mobile ── */}
        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-[rgba(160,125,55,0.22)] to-transparent my-3" />
        <div className="md:hidden h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.22)] to-transparent mx-5" />

        {/* ── Strikes — wrought iron tally ── */}
        <div
          onClick={() => hasDetails && setPopupOpen(true)}
          className={`flex md:w-56 flex-col justify-center items-center md:items-start px-5 py-4 transition-colors ${
            hasDetails ? "cursor-pointer hover:bg-[rgba(200,30,30,0.04)]" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-3 w-full">
            <p className="text-[11px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.6)] w-full text-center md:text-left">
              Strikes Académicos
            </p>
            {clamped >= 2 && (
              <motion.div animate={{ x: [0, -2, 2, -1, 0] }} transition={{ duration: 0.4, delay: 0.6 }}>
                <AlertTriangle size={11} className="text-[#c8a84b]" />
              </motion.div>
            )}
          </div>

          {/* Strike tally marks — square iron plates */}
          <div className="flex gap-2.5 mb-2.5">
            {Array.from({ length: MAX_STRIKES }).map((_, i) => {
              const isActive = i < clamped;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isActive ? {
                    scale: 1, opacity: 1,
                    boxShadow: [
                      "0 0 0px rgba(230,57,70,0)",
                      "0 0 10px rgba(230,57,70,0.6)",
                      "0 0 0px rgba(230,57,70,0)",
                    ],
                  } : { scale: 1, opacity: 1 }}
                  transition={isActive ? {
                    scale: { delay: i * 0.1, type: "spring", stiffness: 380, damping: 14 },
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 },
                  } : {
                    scale: { delay: i * 0.1, duration: 0.3 },
                    opacity: { delay: i * 0.1, duration: 0.3 },
                  }}
                  className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center text-xs font-serif font-bold"
                  style={{
                    background: isActive
                      ? "rgba(180,30,30,0.18)"
                      : "rgba(160,125,55,0.05)",
                    border: isActive
                      ? "1px solid rgba(180,60,60,0.45)"
                      : "1px solid rgba(160,125,55,0.2)",
                    color: isActive ? "rgba(230,57,70,0.9)" : "rgba(160,125,55,0.25)",
                  }}
                >
                  {/* Inner frame on active */}
                  {isActive && (
                    <div className="pointer-events-none absolute inset-[3px] border border-[rgba(180,60,60,0.2)]" />
                  )}
                  <span className="relative z-10">{isActive ? "✕" : "—"}</span>
                </motion.div>
              );
            })}
          </div>

          <p className="text-[12px] font-serif leading-relaxed text-[rgba(200,168,75,0.55)]">
            {strikeMessage}
          </p>
          {hasDetails && (
            <p className="mt-1 text-[11px] font-serif uppercase tracking-wider text-danger/40">
              Toca para ver el detalle
            </p>
          )}
        </div>
      </motion.div>

      {popupOpen && <StrikesPopup strikeDetails={strikeDetails} onClose={() => setPopupOpen(false)} />}
    </>
  );
}
