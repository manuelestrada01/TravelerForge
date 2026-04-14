"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mision } from "@/misiones/types";
import { ChevronRight, ScrollText } from "lucide-react";

gsap.registerPlugin(useGSAP);

const ICON_MAP: Record<string, string> = {
  architecture: "architecture",
  description: "description",
  brush: "brush",
  default: "task",
};

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

interface EncargosSemanalesProps {
  encargos: Mision[];
}

export default function EncargosSemanales({ encargos }: EncargosSemanalesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-encargo]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power3.out", delay: 0.15 }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden p-6"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #131110 0%, #0d0c0b 100%)`,
        border: "1px solid rgba(160,125,55,0.38)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.65)",
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,168,75,0.04)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.3)] to-transparent" />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.07)]">
          <ScrollText size={14} strokeWidth={1.3} className="text-[#c8a84b]" />
        </div>
        <div>
          <h3 className="font-serif text-base font-semibold text-[rgba(232,224,208,0.88)]">Encargos Semanales</h3>
        </div>
      </div>

      <div className="relative flex flex-col gap-0">
        {encargos.map((encargo, i) => (
          <div
            key={encargo.id}
            data-encargo
            className={`group flex items-start gap-3 py-3 px-1 transition-colors hover:bg-[rgba(200,168,75,0.03)] cursor-pointer ${
              i !== encargos.length - 1 ? "border-b border-[rgba(160,125,55,0.12)]" : ""
            }`}
            style={{ opacity: 0 }}
          >
            {/* Type icon — square */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.07)] mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-[rgba(160,125,55,0.6)]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                {encargo.icon ? (ICON_MAP[encargo.icon] ?? ICON_MAP.default) : ICON_MAP.default}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-serif text-sm font-semibold text-[rgba(232,224,208,0.85)] leading-tight truncate">{encargo.title}</h5>
              {encargo.description && (
                <p className="text-[11px] font-serif text-[rgba(160,125,55,0.45)] mt-0.5 leading-snug">{encargo.description}</p>
              )}
              <span className="mt-1.5 inline-block font-serif text-xs font-semibold text-[#c8a84b]">
                +{encargo.xpReward} XP
              </span>
            </div>
            <ChevronRight size={13} strokeWidth={1.5} className="text-[rgba(160,125,55,0.25)] group-hover:text-[rgba(160,125,55,0.6)] transition-colors flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>

      {/* Archive button */}
      <button
        className="relative w-full mt-5 py-3 font-serif text-[9px] uppercase tracking-[0.3em] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.8)] transition-colors"
        style={{ border: "1px solid rgba(160,125,55,0.18)", background: "rgba(160,125,55,0.03)" }}
      >
        Ver Archivo de Encargos
      </button>
    </div>
  );
}
