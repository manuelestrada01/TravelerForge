"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Sword,
  Flame,
  Users,
  ShieldCheck,
  MessageSquare,
  Hammer,
  Moon,
  Eye,
  BookOpen,
  Crown,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { Talent } from "@/talentos/types";

gsap.registerPlugin(useGSAP);

interface TalentsCardProps {
  talents: Talent[];
}

const TALENT_ICONS: Record<string, LucideIcon> = {
  "mano-firme": Sword,
  "perseverancia-activa": Flame,
  "espiritu-colaborador": Users,
  "resistencia-al-error": ShieldCheck,
  "claridad-comunicativa": MessageSquare,
  "dominio-instrumental": Hammer,
  "constancia-silenciosa": Moon,
  "atencion-al-detalle": Eye,
  "autogestion-del-aprendizaje": BookOpen,
  "liderazgo-servicial": Crown,
  "enfoque-y-concentracion": Crosshair,
};

const PAGE_SIZE = 3;

function TalentPopup({
  talent,
  onClose,
}: {
  talent: Talent;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = TALENT_ICONS[talent.id] ?? Sword;

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      ).fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.88, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" },
        "-=0.1"
      );
    },
    { scope: overlayRef }
  );

  function handleClose() {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(cardRef.current, {
      opacity: 0,
      scale: 0.88,
      y: 16,
      duration: 0.2,
      ease: "power2.in",
    }).to(overlayRef.current, { opacity: 0, duration: 0.15, ease: "power2.in" }, "-=0.1");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
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
        <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-[#c9a227]/60 rounded-tl-lg" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-[#c9a227]/60 rounded-tr-lg" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-[#c9a227]/60 rounded-bl-lg" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#c9a227]/60 rounded-br-lg" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e3320] bg-[#0d1a0f] text-[#9aab8a] transition-colors hover:border-[#c9a227]/40 hover:text-[#f5f0e8]"
        >
          <X size={14} />
        </button>

        {/* Card content */}
        <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-[#c9a227]/30 bg-[#0d1a0f] p-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          {/* Radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.06)_0%,transparent_70%)]" />

          {/* Top ornament */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

          {/* Watermark icon */}
          <Icon
            size={160}
            strokeWidth={0.4}
            className="absolute -bottom-6 -right-6 pointer-events-none text-[#9aab8a]/5"
          />

          {/* Icon */}
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10">
            <Icon size={30} strokeWidth={1.2} className="text-[#c9a227]" />
          </div>

          {/* Name */}
          <h3 className="relative mb-1 font-serif text-xl font-bold text-[#f5f0e8]">
            {talent.name}
          </h3>

          {/* Divider */}
          <div className="relative my-4 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />

          {/* Description */}
          <p className="relative mb-6 text-sm leading-relaxed text-[#9aab8a]">
            {talent.description}
          </p>

          {/* Attributes */}
          <div className="relative flex gap-2">
            {talent.attributes.map((attr) => (
              <span
                key={attr}
                className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#c9a227]"
              >
                {attr}
              </span>
            ))}
          </div>

          {/* Bottom ornament */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default function TalentsCard({ talents }: TalentsCardProps) {
  const [page, setPage] = useState(0);
  const [openTalent, setOpenTalent] = useState<Talent | null>(null);
  const totalPages = Math.ceil(talents.length / PAGE_SIZE);
  const paginated = talents.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const isPaginated = talents.length > PAGE_SIZE;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        className="rounded-xl bg-[#0F2411] p-5 border border-[#1e3320] flex flex-col"
      >
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-4">
          <div className="flex justify-start">
            {isPaginated && (
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-6 w-6 items-center justify-center rounded-md text-[#9aab8a] transition-colors hover:text-[#c9a227] disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} strokeWidth={2} />
              </button>
            )}
          </div>

          <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a] text-center">
            Talentos Activos
          </p>

          <div className="flex justify-end">
            {isPaginated && (
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="flex h-6 w-6 items-center justify-center rounded-md text-[#9aab8a] transition-colors hover:text-[#c9a227] disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {talents.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-6">
            <p className="text-xs text-[#9aab8a]/60 text-center">
              Ningún talento activo aún.
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex justify-center gap-3 flex-1 content-center"
              >
                {paginated.map((talent, index) => {
                  const Icon = TALENT_ICONS[talent.id] ?? Sword;
                  return (
                    <motion.div
                      key={talent.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.32,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -3,
                        borderColor: "rgba(201,162,39,0.4)",
                        transition: { duration: 0.18 },
                      }}
                      onClick={() => setOpenTalent(talent)}
                      className="flex flex-col items-center gap-2.5 rounded-xl border border-[#1e3320] bg-[#0d1a0f]/50 p-4 w-36 h-52 cursor-pointer"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/20">
                        <Icon size={20} className="text-[#c9a227]" strokeWidth={1.4} />
                      </span>
                      <div className="flex h-8 items-center justify-center">
                        <p className="text-xs font-semibold text-[#f5f0e8] text-center leading-tight line-clamp-2">
                          {talent.name}
                        </p>
                      </div>
                      <p className="text-[10px] leading-relaxed text-[#9aab8a] text-center line-clamp-3">
                        {talent.description}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1 mt-auto">
                        {talent.attributes.map((attr) => (
                          <span
                            key={attr}
                            className="rounded-full bg-[#c9a227]/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[#c9a227]"
                          >
                            {attr}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {isPaginated && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      i === page
                        ? "w-4 bg-[#c9a227]"
                        : "w-1.5 bg-[#1e3320] hover:bg-[#9aab8a]/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      {openTalent && (
        <TalentPopup
          talent={openTalent}
          onClose={() => setOpenTalent(null)}
        />
      )}
    </>
  );
}
