"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Sword, Flame, Users, ShieldCheck, MessageSquare,
  Hammer, Moon, Eye, BookOpen, Crown, Crosshair,
  ChevronLeft, ChevronRight, X,
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

function TalentPopup({ talent, onClose }: { talent: Talent; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = TALENT_ICONS[talent.id] ?? Sword;

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
        {/* HUD corner ornaments */}
        <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-gold/50" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-gold/50" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-gold/50" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-gold/50" />

        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center border border-hud-border bg-hud-surface text-sage hover:text-cream transition-colors"
        >
          <X size={14} />
        </button>

        <div className="hud-panel relative flex flex-col items-center overflow-hidden p-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.9)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.05)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-24 gold-divider" />

          {/* Watermark icon */}
          <Icon size={140} strokeWidth={0.35} className="absolute -bottom-4 -right-4 pointer-events-none text-sage/5" />

          {/* Icon */}
          <div
            className="relative mb-4 flex h-16 w-16 items-center justify-center bg-gold/10 border border-gold/30"
            style={{ clipPath: "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))" }}
          >
            <Icon size={28} strokeWidth={1.2} className="text-gold" />
          </div>

          <h3 className="relative mb-1 font-serif text-xl font-bold text-cream">{talent.name}</h3>
          <div className="relative my-4 gold-divider w-16" />
          <p className="relative mb-6 text-sm leading-relaxed text-sage">{talent.description}</p>

          <div className="relative flex gap-2">
            {talent.attributes.map((attr) => (
              <span
                key={attr}
                className="border border-arcane/30 bg-arcane/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-arcane"
                style={{ clipPath: "polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))" }}
              >
                {attr}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-24 gold-divider" />
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
        className="hud-panel p-5 flex flex-col"
      >
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-4">
          <div className="flex justify-start">
            {isPaginated && (
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-6 w-6 items-center justify-center text-sage hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} strokeWidth={2} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="gold-divider w-8" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage shrink-0">Talentos Activos</p>
            <div className="gold-divider w-8" />
          </div>
          <div className="flex justify-end">
            {isPaginated && (
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="flex h-6 w-6 items-center justify-center text-sage hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {talents.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-6">
            <p className="text-xs text-sage/50 text-center">Ningún talento activo aún.</p>
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
                className="flex justify-center gap-3 flex-1"
              >
                {paginated.map((talent, index) => {
                  const Icon = TALENT_ICONS[talent.id] ?? Sword;
                  return (
                    <motion.div
                      key={talent.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.32, ease: "easeOut" }}
                      whileHover={{ y: -3, transition: { duration: 0.18 } }}
                      onClick={() => setOpenTalent(talent)}
                      className="hud-panel-sm flex flex-col items-center gap-2.5 p-4 w-36 h-52 cursor-pointer hover:before:opacity-80 transition-all group"
                    >
                      {/* Icon */}
                      <div
                        className="flex h-10 w-10 items-center justify-center bg-gold/10 border border-gold/20 group-hover:bg-gold/15 transition-colors"
                        style={{ clipPath: "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))" }}
                      >
                        <Icon size={18} className="text-gold" strokeWidth={1.4} />
                      </div>

                      {/* Name */}
                      <p className="text-xs font-semibold text-cream text-center leading-tight line-clamp-2">
                        {talent.name}
                      </p>

                      {/* Description */}
                      <p className="text-[10px] leading-relaxed text-sage text-center line-clamp-3 flex-1">
                        {talent.description}
                      </p>

                      {/* Attribute chips — arcane style */}
                      <div className="flex flex-wrap justify-center gap-1 mt-auto">
                        {talent.attributes.map((attr) => (
                          <span
                            key={attr}
                            className="border border-arcane/25 bg-arcane/10 px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider text-arcane"
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

            {/* Rune pagination dots */}
            {isPaginated && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`transition-all duration-200 text-xs ${
                      i === page ? "text-gold" : "text-hud-border hover:text-sage"
                    }`}
                  >
                    {i === page ? "◆" : "◇"}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      {openTalent && <TalentPopup talent={openTalent} onClose={() => setOpenTalent(null)} />}
    </>
  );
}
