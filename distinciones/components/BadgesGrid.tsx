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

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2020/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

export default function BadgesGrid({ earned, locked }: BadgesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      "[data-badge-earned]",
      { opacity: 0, scale: 0.88, y: 14 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.07, duration: 0.45, ease: "back.out(1.3)", delay: 0.1 }
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
          <h2 className="font-serif text-xl text-[rgba(232,224,208,0.88)] shrink-0">Obtenidas</h2>
          <span className="text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(200,168,75,0.7)] border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.07)] px-2 py-0.5 shrink-0">
            {earned.length}
          </span>
          <div className="gold-divider flex-1" />
        </div>

        {earned.length === 0 ? (
          <p className="font-serif text-sm italic text-[rgba(160,125,55,0.4)] text-center py-8">
            Ninguna distinción obtenida aún.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {earned.map((badge) => (
              <div
                key={badge.id}
                data-badge-earned
                className="relative flex flex-col gap-3 overflow-hidden p-5"
                style={{
                  background: `${STONE_NOISE}, linear-gradient(170deg, #131110 0%, #0d0c0b 100%)`,
                  border: "1px solid rgba(160,125,55,0.42)",
                  boxShadow: "0 0 16px rgba(200,148,40,0.1), 0 4px 24px rgba(0,0,0,0.7)",
                  opacity: 0,
                }}
              >
                {/* Inner frame */}
                <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.1)]" />

                {/* Corner ◆ */}
                <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>
                <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>
                <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>
                <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>

                {/* Candlelight */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,140,60,0.07)_0%,transparent_55%)]" />

                {/* Top rule */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.35)] to-transparent" />

                {/* Watermark icon */}
                <span className="pointer-events-none absolute -right-2 -top-2 select-none text-8xl leading-none opacity-[0.04]">
                  {badge.icon}
                </span>

                <div className="relative flex items-center gap-3">
                  {/* Badge icon — square heraldic seal */}
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-[rgba(160,125,55,0.38)] bg-[rgba(160,125,55,0.1)] text-2xl"
                    style={{ boxShadow: "0 0 10px rgba(200,148,40,0.12) inset" }}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-[rgba(232,224,208,0.88)] leading-tight">{badge.name}</p>
                    <p className="mt-0.5 text-[8px] font-serif uppercase tracking-[0.25em] text-[rgba(200,168,75,0.55)]">◆ Obtenida</p>
                  </div>
                </div>

                <p className="relative text-[11px] font-serif leading-relaxed text-[rgba(160,125,55,0.6)]">{badge.description}</p>

                <p className="relative text-[9px] font-serif uppercase tracking-wider text-[rgba(160,125,55,0.35)]">
                  {formatDate(badge.earnedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Locked ── */}
      {locked.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.15)] to-transparent" />
            <h2 className="font-serif text-xl text-[rgba(160,125,55,0.35)] shrink-0">Por desbloquear</h2>
            <span className="text-[9px] font-serif text-[rgba(160,125,55,0.3)] border border-[rgba(160,125,55,0.18)] bg-[rgba(160,125,55,0.04)] px-2 py-0.5 shrink-0">
              {locked.length}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.15)] to-transparent" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {locked.map((badge) => (
              <div
                key={badge.id}
                data-badge-locked
                className="relative flex flex-col gap-3 p-5 grayscale"
                style={{
                  background: "linear-gradient(170deg, #111009 0%, #0c0a07 100%)",
                  border: "1px solid rgba(160,125,55,0.14)",
                  opacity: 0,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-[rgba(160,125,55,0.05)] border border-[rgba(160,125,55,0.15)] text-2xl">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-[rgba(160,125,55,0.3)] leading-tight">{badge.name}</p>
                    <p className="mt-0.5 text-[8px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.22)]">◇ Bloqueada</p>
                  </div>
                </div>
                <p className="text-[11px] font-serif leading-relaxed text-[rgba(160,125,55,0.28)]">{badge.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
