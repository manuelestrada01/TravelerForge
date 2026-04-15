"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Sword, Flame, Users, ShieldCheck, MessageSquare,
  Hammer, Moon, Eye, BookOpen, Crown, Crosshair,
  ChevronRight, ChevronLeft, X,
  type LucideIcon,
} from "lucide-react";
import { Talent } from "@/talentos/types";

gsap.registerPlugin(useGSAP);

const PAGE_SIZE = 5;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      style={{ backdropFilter: "blur(2px)" }}
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

        <div className="reliquary-panel relative flex flex-col items-center overflow-hidden p-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.9)]">
          {/* Corner ornaments inside popup */}
          <span className="pointer-events-none absolute top-[3px] left-[3px] text-[6px] text-gold/20 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
          <span className="pointer-events-none absolute top-[3px] right-[3px] text-[6px] text-gold/20 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
          <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[6px] text-gold/20 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
          <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[6px] text-gold/20 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,140,60,0.06)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.5)] to-transparent" />

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
          <p className="relative mb-6 text-sm leading-relaxed text-sage font-serif">{talent.description}</p>

          <div className="relative flex gap-2">
            {talent.attributes.map((attr) => (
              <span
                key={attr}
                className="border border-[rgba(160,125,55,0.35)] bg-[rgba(160,125,55,0.08)] px-4 py-1 text-[10px] font-serif uppercase tracking-widest text-[rgba(200,168,75,0.75)]"
              >
                {attr}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.5)] to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default function TalentsCard({ talents }: TalentsCardProps) {
  const [openTalent, setOpenTalent] = useState<Talent | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);
  const mountedRef = useRef(false);

  const totalPages = Math.ceil(talents.length / PAGE_SIZE);
  const pageItems = talents.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  useGSAP(() => {
    const items = Array.from(listRef.current?.querySelectorAll("[data-talent-item]") ?? []);
    if (!items.length) return;

    const dir = directionRef.current;
    gsap.fromTo(items,
      { opacity: 0, x: dir * 14 },
      { opacity: 1, x: 0, stagger: 0.065, duration: 0.38, ease: "power3.out" }
    );

    if (!mountedRef.current) {
      mountedRef.current = true;
      const icons = Array.from(listRef.current?.querySelectorAll("[data-talent-icon]") ?? []);
      if (icons.length) {
        gsap.timeline({ delay: 0.3 })
          .fromTo(icons,
            { background: "rgba(160,125,55,0.08)" },
            { background: "rgba(210,148,24,0.28)", stagger: 0.05, duration: 0.15,
              yoyo: true, repeat: 1, ease: "power2.in" }
          );
      }
    }
  }, { scope: listRef, dependencies: [currentPage] });

  function goToPage(next: number) {
    if (next === currentPage) return;
    directionRef.current = next > currentPage ? 1 : -1;
    const items = Array.from(listRef.current?.querySelectorAll("[data-talent-item]") ?? []);
    gsap.to(items, {
      opacity: 0, x: directionRef.current * -14, duration: 0.18, ease: "power2.in",
      onComplete: () => setCurrentPage(next),
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        className="reliquary-panel h-full p-5 flex flex-col relative"
      >
        {/* Corner diamond ornaments */}
        <span className="pointer-events-none absolute top-[3px] left-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
        <span className="pointer-events-none absolute top-[3px] right-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
        <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
        <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>

        {/* Warm candlelight over oak */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,140,60,0.07)_0%,transparent_55%)]" />

        {/* Header — carved wood plaque inscription */}
        <div className="relative flex flex-col items-center mb-3 gap-1" style={{ zIndex: 2 }}>
          <div className="flex items-center w-full gap-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.4)] to-transparent" />
            <span className="text-[rgba(200,168,75,0.5)] text-[9px] font-serif leading-none">✠</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.4)] to-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[rgba(200,168,75,0.7)] font-serif">
              Talentos Forjados
            </p>
            <span className="text-[10px] tabular-nums text-[rgba(160,125,55,0.5)] font-mono border border-[rgba(160,125,55,0.25)] px-1.5 py-px">
              {talents.length}
            </span>
          </div>
          <div className="flex-1 w-full h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
        </div>

        {/* Talent list */}
        {talents.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center py-8 gap-2" style={{ zIndex: 2 }}>
            <span className="text-[rgba(160,125,55,0.2)] text-2xl font-serif leading-none">⚔</span>
            <p className="text-xs text-sage/40 font-serif italic text-center">
              Ningún talento forjado aún.
            </p>
          </div>
        ) : (
          <div ref={listRef} className="relative flex flex-col" style={{ zIndex: 2 }}>
            {pageItems.map((talent) => {
              const Icon = TALENT_ICONS[talent.id] ?? Sword;
              return (
                <div
                  key={talent.id}
                  data-talent-item
                  onClick={() => setOpenTalent(talent)}
                  className="group flex items-center gap-3 px-3 py-2.5 cursor-pointer border-b border-[rgba(160,125,55,0.15)] last:border-b-0 hover:bg-[rgba(200,168,75,0.04)] transition-colors"
                  style={{ opacity: 0 }}
                >
                  <div
                    data-talent-icon
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[rgba(160,125,55,0.08)] border border-[rgba(160,125,55,0.25)] group-hover:bg-[rgba(160,125,55,0.14)] group-hover:border-[rgba(160,125,55,0.4)] transition-colors"
                    style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                  >
                    <Icon size={13} className="text-[#c8a84b]" strokeWidth={1.4} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-cream/90 leading-tight truncate font-serif">
                      {talent.name}
                    </p>
                    <div className="flex gap-1.5 mt-0.5">
                      {talent.attributes.map((attr) => (
                        <span
                          key={attr}
                          className="px-1.5 py-px text-[9px] font-medium uppercase tracking-widest text-[rgba(160,125,55,0.7)] bg-[rgba(160,125,55,0.07)] border border-[rgba(160,125,55,0.18)]"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ChevronRight
                    size={11}
                    strokeWidth={1.5}
                    className="flex-shrink-0 text-[rgba(160,125,55,0.3)] group-hover:text-[rgba(160,125,55,0.7)] transition-colors"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom — navigation when paginated, ornament otherwise */}
        <div className="relative flex items-center justify-center pt-3 mt-auto gap-3" style={{ zIndex: 2 }}>
          {totalPages > 1 ? (
            <>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center justify-center w-5 h-5 text-[rgba(160,125,55,0.4)] hover:text-[rgba(200,168,75,0.85)] disabled:opacity-20 transition-colors"
              >
                <ChevronLeft size={12} strokeWidth={1.5} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className="transition-all"
                    style={{
                      width: i === currentPage ? "16px" : "5px",
                      height: "5px",
                      background: i === currentPage
                        ? "rgba(200,168,75,0.7)"
                        : "rgba(160,125,55,0.25)",
                      transform: i === currentPage ? "rotate(45deg)" : "rotate(45deg)",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="flex items-center justify-center w-5 h-5 text-[rgba(160,125,55,0.4)] hover:text-[rgba(200,168,75,0.85)] disabled:opacity-20 transition-colors"
              >
                <ChevronRight size={12} strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <span className="text-[rgba(160,125,55,0.25)] text-[8px] tracking-[0.4em]">◆ ◆ ◆</span>
          )}
        </div>
      </motion.div>

      {openTalent && <TalentPopup talent={openTalent} onClose={() => setOpenTalent(null)} />}
    </>
  );
}
