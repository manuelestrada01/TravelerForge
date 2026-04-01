"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X, AlertTriangle, ShieldAlert } from "lucide-react";
import type { Strike } from "@/lib/supabase/game";

gsap.registerPlugin(useGSAP);

const MAX_STRIKES = 3;

const REASON_LABELS: Record<string, { label: string; color: string }> = {
  no_submission:    { label: "No entrega",                  color: "text-[#c0392b]" },
  late_submission:  { label: "Entrega fuera de término",    color: "text-[#c9a227]" },
  missing_material: { label: "Falta de material",           color: "text-[#c9a227]" },
};

const STRIKE_MESSAGES: Record<number, string> = {
  0: "Sin incumplimientos activos. El camino está despejado.",
  1: "1/3 Activos. Mantén la rectitud técnica para evitar la purga de privilegios.",
  2: "2/3 Activos. Un incumplimiento más bloqueará el bimestre.",
  3: "3/3 Activos. Bimestre bloqueado. Regulariza tu situación para continuar.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StrikesPopup({
  strikeDetails,
  onClose,
}: {
  strikeDetails: Strike[];
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.timeline()
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" })
        .fromTo(cardRef.current, { opacity: 0, scale: 0.88, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }, "-=0.1");
    },
    { scope: overlayRef }
  );

  function handleClose() {
    gsap.timeline({ onComplete: onClose })
      .to(cardRef.current, { opacity: 0, scale: 0.88, y: 16, duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.15, ease: "power2.in" }, "-=0.1");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner ornaments */}
        <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-[#c0392b]/50 rounded-tl-lg" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-[#c0392b]/50 rounded-tr-lg" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-[#c0392b]/50 rounded-bl-lg" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#c0392b]/50 rounded-br-lg" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e3320] bg-[#0d1a0f] text-[#9aab8a] transition-colors hover:border-[#c0392b]/40 hover:text-[#f5f0e8]"
        >
          <X size={14} />
        </button>

        {/* Card */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#c0392b]/30 bg-[#0d1a0f] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          {/* Radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,57,43,0.05)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c0392b]/40 to-transparent" />

          {/* Header */}
          <div className="relative flex flex-col items-center mb-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#c0392b]/30 bg-[#c0392b]/10">
              <ShieldAlert size={22} strokeWidth={1.4} className="text-[#c0392b]" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#9aab8a]/60">
              Registro de Incumplimientos
            </p>
            <div className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#c0392b]/30 to-transparent" />
          </div>

          {/* Strike list */}
          <div className="relative flex flex-col gap-2">
            {strikeDetails.length === 0 ? (
              <p className="text-xs text-[#9aab8a]/60 text-center py-4">
                Sin incumplimientos registrados.
              </p>
            ) : (
              strikeDetails.map((strike, i) => {
                const reason = REASON_LABELS[strike.reason] ?? { label: strike.reason, color: "text-[#9aab8a]" };
                return (
                  <div
                    key={strike.id}
                    className="flex items-start gap-3 rounded-lg border border-[#1e3320] bg-[#0F2411] p-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[#c0392b]/40 bg-[#c0392b]/10 text-[10px] font-bold text-[#c0392b]">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-tight ${reason.color}`}>
                        {reason.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#9aab8a]/60 uppercase tracking-wider">
                        {strike.bimestre} · {formatDate(strike.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c0392b]/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

interface StrikesCardProps {
  strikes: number;
  blocked?: boolean;
  strikeDetails?: Strike[];
}

export default function StrikesCard({ strikes, blocked = false, strikeDetails = [] }: StrikesCardProps) {
  const [open, setOpen] = useState(false);
  const clamped = Math.min(strikes, MAX_STRIKES);
  const message = STRIKE_MESSAGES[clamped] ?? STRIKE_MESSAGES[3];
  const hasDetails = strikeDetails.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
        onClick={() => hasDetails && setOpen(true)}
        className={`rounded-xl p-5 border transition-colors ${
          blocked
            ? "bg-[#c0392b]/10 border-[#c0392b]/30"
            : "bg-[#0F2411] border-[#1e3320]"
        } ${hasDetails ? "cursor-pointer hover:border-[#c0392b]/40" : ""}`}
      >
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-4">
          <div />
          <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a] text-center">
            Strikes Académicos
          </p>
          <div className="flex justify-end">
            {clamped >= 2 && (
              <motion.span
                className="text-[#c9a227] text-sm"
                animate={{ x: [0, -3, 3, -2, 0] }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <AlertTriangle size={14} className="text-[#c9a227]" />
              </motion.span>
            )}
          </div>
        </div>

        {/* Strike icons */}
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: MAX_STRIKES }).map((_, i) => {
            const isActive = i < clamped;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isActive
                    ? {
                        scale: 1,
                        opacity: 1,
                        boxShadow: [
                          "0 0 0px rgba(192,57,43,0)",
                          "0 0 10px rgba(192,57,43,0.6)",
                          "0 0 0px rgba(192,57,43,0)",
                        ],
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={
                  isActive
                    ? {
                        scale: { delay: i * 0.1, type: "spring", stiffness: 380, damping: 14 },
                        boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                      }
                    : {
                        scale: { delay: i * 0.1, duration: 0.3 },
                        opacity: { delay: i * 0.1, duration: 0.3 },
                      }
                }
                className={`flex h-14 flex-1 items-center justify-center rounded-lg border text-base font-bold ${
                  isActive
                    ? "border-[#c0392b] bg-[#c0392b]/20 text-[#c0392b]"
                    : "border-[#1e3320] bg-[#0d1a0f]/60 text-[#1e3320]"
                }`}
              >
                ✕
              </motion.div>
            );
          })}
        </div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-[11px] leading-relaxed text-[#9aab8a]"
        >
          {message}
        </motion.p>

        {/* Ver detalle hint */}
        {hasDetails && (
          <p className="mt-2 text-[10px] uppercase tracking-wider text-[#c0392b]/50">
            Toca para ver el detalle
          </p>
        )}
      </motion.div>

      {open && (
        <StrikesPopup
          strikeDetails={strikeDetails}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
