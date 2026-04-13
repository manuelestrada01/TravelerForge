"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { EarnedBadge, Badge } from "@/distinciones/types";

gsap.registerPlugin(useGSAP);

interface BadgesGridProps {
  earned: EarnedBadge[];
  locked: Badge[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export default function BadgesGrid({ earned, locked }: BadgesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      "[data-badge-earned]",
      { opacity: 0, scale: 0.85, y: 12 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.07, duration: 0.45, ease: "back.out(1.4)", delay: 0.1 }
    );
    gsap.fromTo(
      "[data-badge-locked]",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: "power2.out", delay: 0.4 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col gap-10">

      {/* ── Earned ── */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="gold-divider flex-1" />
          <h2 className="font-serif text-xl text-cream shrink-0">Obtenidas</h2>
          <span
            className="text-[10px] font-semibold text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 shrink-0"
            style={{ clipPath: "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))" }}
          >
            {earned.length}
          </span>
          <div className="gold-divider flex-1" />
        </div>

        {earned.length === 0 ? (
          <p className="text-sm text-sage/50 text-center py-8">Ninguna distinción obtenida aún.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {earned.map((badge) => (
              <div
                key={badge.id}
                data-badge-earned
                className="hud-panel rune-corners relative flex flex-col gap-3 overflow-hidden p-5 scanlines"
                style={{
                  boxShadow: "0 0 16px rgba(201,162,39,0.12), 0 4px 24px rgba(0,0,0,0.6)",
                  opacity: 0,
                }}
              >
                {/* Gold top accent */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                {/* Watermark */}
                <span className="pointer-events-none absolute -right-2 -top-2 select-none text-8xl leading-none opacity-[0.05]">
                  {badge.icon}
                </span>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-gold/15 border border-gold/30 text-2xl"
                    style={{ clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-cream leading-tight">{badge.name}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-widest text-gold/70">◆ Obtenida</p>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-sage">{badge.description}</p>

                <p className="text-[9px] uppercase tracking-wider text-sage/40">{formatDate(badge.earnedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Locked ── */}
      {locked.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-hud-border/50" />
            <h2 className="font-serif text-xl text-cream/40 shrink-0">Por desbloquear</h2>
            <span className="text-[10px] font-semibold text-sage/40 border border-hud-border/50 bg-hud-card px-2 py-0.5 shrink-0">
              {locked.length}
            </span>
            <div className="h-px flex-1 bg-hud-border/50" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {locked.map((badge) => (
              <div
                key={badge.id}
                data-badge-locked
                className="hud-panel flex flex-col gap-3 p-5 opacity-40 grayscale"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-hud-border/30 text-2xl"
                    style={{ clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-cream/30 leading-tight">{badge.name}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-widest text-sage/30">◇ Bloqueada</p>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-sage/40">{badge.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
