"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Axe, Music, HeartHandshake, Shield, Leaf, BookOpen, Users, type LucideIcon,
} from "lucide-react";
import type { RankingEntry } from "@/lib/supabase/comunidad";

gsap.registerPlugin(useGSAP);

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")";

const CLASS_ICONS: Record<string, LucideIcon> = {
  barbaro: Axe,
  bardo: Music,
  clerigo: HeartHandshake,
  paladin: Shield,
  druida: Leaf,
  erudito: BookOpen,
};

const CLASS_LABELS: Record<string, string> = {
  barbaro: "Bárbaro",
  bardo: "Bardo",
  clerigo: "Clérigo",
  paladin: "Paladín",
  druida: "Druida",
  erudito: "Erudito",
};

const MEDAL: Record<number, { label: string; color: string; leftAccent: string; stoneBg: string; stoneBorder: string }> = {
  1: {
    label: "1°",
    color: "text-[#e8c96a]",
    leftAccent: "rgba(232,201,106,0.85)",
    stoneBg: `linear-gradient(170deg, #1a1508 0%, #120f05 100%)`,
    stoneBorder: "1px solid rgba(232,201,106,0.28)",
  },
  2: {
    label: "2°",
    color: "text-[#c8cfd6]",
    leftAccent: "rgba(180,190,200,0.7)",
    stoneBg: `linear-gradient(170deg, #13151a 0%, #0e1014 100%)`,
    stoneBorder: "1px solid rgba(180,190,200,0.2)",
  },
  3: {
    label: "3°",
    color: "text-[#c8884a]",
    leftAccent: "rgba(180,120,60,0.65)",
    stoneBg: `linear-gradient(170deg, #160f08 0%, #100b05 100%)`,
    stoneBorder: "1px solid rgba(180,120,60,0.22)",
  },
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

interface Props {
  entries: RankingEntry[];
  currentEmail: string;
}

export default function RankingList({ entries, currentEmail }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxXp = entries[0]?.xpTotal ?? 1;
  const currentEntry = entries.find((e) => e.email === currentEmail);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-row]",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: "power3.out", delay: 0.1 }
      );
    },
    { scope: containerRef }
  );

  if (!entries.length) {
    return (
      <p className="font-serif text-[17px] italic text-[rgba(160,125,55,0.4)] text-center py-16">
        Sin datos de ranking disponibles.
      </p>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-3">

      {/* Tu posición */}
      {currentEntry && (
        <div
          data-row
          className="relative flex items-center justify-between px-6 py-3 overflow-hidden"
          style={{
            background: `${STONE_NOISE}, linear-gradient(170deg, #17130a 0%, #120f06 100%)`,
            border: "1px solid rgba(200,168,75,0.35)",
            borderLeft: "2px solid rgba(200,168,75,0.6)",
            boxShadow: "0 0 20px rgba(200,168,75,0.06)",
          }}
        >
          <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.08)]" />
          <div className="flex items-center gap-2">
            <Users size={13} strokeWidth={1.5} className="text-[rgba(160,125,55,0.45)]" />
            <p className="text-[13px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.45)]">Tu posición</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-serif text-[22px] font-bold text-[#c8a84b] tabular-nums">#{currentEntry.position}</span>
            <span className="text-[13px] font-serif text-[rgba(160,125,55,0.4)]">de {entries.length} estudiantes</span>
          </div>
        </div>
      )}

      {/* Header columns */}
      <div className="grid grid-cols-[44px_1fr_140px_80px_120px] gap-4 px-5 py-2">
        {["#", "Estudiante", "Clase", "Nivel", "XP"].map((h) => (
          <p key={h} className="text-[12px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.45)]">
            {h}
          </p>
        ))}
      </div>

      {/* Rows */}
      {entries.map((entry) => {
        const isMe = entry.email === currentEmail;
        const medal = MEDAL[entry.position];
        const Icon = CLASS_ICONS[entry.formativeClass] ?? BookOpen;
        const classLabel = CLASS_LABELS[entry.formativeClass] ?? entry.formativeClass;
        const barWidth = Math.round((entry.xpTotal / maxXp) * 100);

        const leftAccent = isMe
          ? "rgba(200,168,75,0.6)"
          : medal
          ? medal.leftAccent
          : "rgba(160,125,55,0.18)";

        const rowBg = isMe
          ? `${STONE_NOISE}, linear-gradient(170deg, #17130a 0%, #120f06 100%)`
          : medal
          ? `${STONE_NOISE}, ${medal.stoneBg}`
          : `${STONE_NOISE}, linear-gradient(170deg, #0d0c08 0%, #090806 100%)`;

        const rowBorder = isMe
          ? "1px solid rgba(200,168,75,0.32)"
          : medal
          ? medal.stoneBorder
          : "1px solid rgba(160,125,55,0.2)";

        return (
          <div
            key={entry.email}
            data-row
            className="relative grid grid-cols-[44px_1fr_140px_80px_120px] gap-4 items-center px-5 py-3.5 hover:brightness-110 transition-all"
            style={{
              background: rowBg,
              border: rowBorder,
              borderLeft: `2px solid ${leftAccent}`,
              boxShadow: isMe ? "0 0 20px rgba(200,168,75,0.05)" : "0 2px 12px rgba(0,0,0,0.4)",
              opacity: 0,
            }}
          >
            <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.06)]" />

            {/* Position */}
            <div className="relative flex items-center justify-center">
              {medal ? (
                <span className={`font-serif text-[20px] font-bold ${medal.color}`}>{medal.label}</span>
              ) : (
                <span className="font-serif text-[15px] text-[rgba(160,125,55,0.4)] tabular-nums">{entry.position}</span>
              )}
            </div>

            {/* Student */}
            <div className="relative flex items-center gap-3 min-w-0">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-[12px] font-serif font-bold"
                style={{
                  background: isMe ? "rgba(200,168,75,0.12)" : "rgba(160,125,55,0.07)",
                  border: isMe ? "1px solid rgba(200,168,75,0.35)" : "1px solid rgba(160,125,55,0.2)",
                  color: isMe ? "#c8a84b" : "rgba(160,125,55,0.6)",
                }}
              >
                {initials(entry.displayName)}
              </div>
              <div className="min-w-0">
                <p className={`font-serif text-[17px] leading-tight truncate ${
                  isMe ? "text-[#c8a84b]" : medal ? medal.color : "text-[rgba(232,224,208,0.8)]"
                }`}>
                  {entry.displayName}
                  {isMe && (
                    <span className="ml-2 text-[10px] font-serif uppercase tracking-wider text-[rgba(160,125,55,0.5)]">· tú</span>
                  )}
                </p>
              </div>
            </div>

            {/* Class */}
            <div className="relative flex items-center gap-2">
              <Icon size={13} strokeWidth={1.4} className={medal ? medal.color : "text-[rgba(160,125,55,0.45)]"} />
              <span className={`font-serif text-[14px] ${medal ? medal.color : "text-[rgba(160,125,55,0.55)]"}`}>
                {classLabel}
              </span>
            </div>

            {/* Level */}
            <span className={`relative font-serif text-[15px] font-bold tabular-nums ${
              medal ? medal.color : isMe ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.55)]"
            }`}>
              Nv. {entry.level}
            </span>

            {/* XP + bar */}
            <div className="relative flex flex-col gap-1.5">
              <span className={`font-serif text-[15px] font-bold tabular-nums text-right ${
                medal ? medal.color : isMe ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.7)]"
              }`}>
                {entry.xpTotal.toLocaleString("es-AR")} XP
              </span>
              <div className="h-1 w-full bg-[rgba(160,125,55,0.08)] overflow-hidden">
                <div
                  className="h-full xp-bar-fill"
                  style={{ width: `${barWidth}%`, opacity: isMe || entry.position <= 3 ? 1 : 0.45 }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
