"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ActivityEntry } from "@/xp/types";
import { Mail, Zap, Star, Trophy, Lock, Unlock } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffH < 1) return "Hace unos minutos";
  if (diffH < 24) return `Hace ${diffH}h`;
  return `Hace ${diffD}d`;
}

const EVENT_ICONS: Record<ActivityEntry["type"], React.ElementType> = {
  xp_base: Mail,
  xp_silent: Zap,
  xp_quality: Star,
  xp_event: Trophy,
  strike_added: Lock,
  strike_removed: Unlock,
  level_up: Trophy,
  badge_earned: Star,
  bimester_blocked: Lock,
  bimester_unlocked: Unlock,
};

// Left border colors for each event type
const EVENT_BORDER: Record<ActivityEntry["type"], string> = {
  xp_base: "border-l-teal/60",
  xp_silent: "border-l-gold/60",
  xp_quality: "border-l-gold/60",
  xp_event: "border-l-gold/60",
  strike_added: "border-l-danger/60",
  strike_removed: "border-l-teal/60",
  level_up: "border-l-gold",
  badge_earned: "border-l-arcane/60",
  bimester_blocked: "border-l-danger",
  bimester_unlocked: "border-l-teal",
};

const EVENT_ICON_COLORS: Record<ActivityEntry["type"], string> = {
  xp_base: "text-teal bg-teal/10",
  xp_silent: "text-gold bg-gold/10",
  xp_quality: "text-gold bg-gold/10",
  xp_event: "text-gold bg-gold/10",
  strike_added: "text-danger bg-danger/10",
  strike_removed: "text-teal bg-teal/10",
  level_up: "text-gold bg-gold/10",
  badge_earned: "text-arcane bg-arcane/10",
  bimester_blocked: "text-danger bg-danger/10",
  bimester_unlocked: "text-teal bg-teal/10",
};

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current?.querySelectorAll("[data-entry]") ?? [],
      { opacity: 0, x: -14 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: "power3.out", delay: 0.15 }
    );
  }, { scope: containerRef });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className="hud-panel scanlines p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-4 gap-3">
        <div className="gold-divider flex-1" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage shrink-0">
          Fragmentos de Actividad
        </p>
        <div className="gold-divider flex-1" />
      </div>

      <div className="flex flex-col gap-1.5">
        {entries.length === 0 && (
          <p className="text-xs text-sage/50 py-4 text-center">Sin actividad reciente.</p>
        )}
        {entries.slice(0, 5).map((entry, index) => {
          const Icon = EVENT_ICONS[entry.type];
          const iconClass = EVENT_ICON_COLORS[entry.type];
          const borderClass = EVENT_BORDER[entry.type];
          const hasXp = entry.xpDelta !== undefined && entry.xpDelta !== 0;

          return (
            <div
              key={entry.id}
              data-entry
              className={`flex items-center gap-2.5 px-2.5 py-2 border-l-2 bg-hud-base/40 ${borderClass}`}
              style={{ opacity: 0 /* GSAP will animate in */ }}
            >
              <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center ${iconClass}`}
                style={{ clipPath: "polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))" }}
              >
                <Icon size={11} strokeWidth={1.5} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-cream leading-tight truncate">
                  {entry.description}
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-sage/60">
                  {formatRelativeTime(entry.timestamp)}
                  {entry.productionType && <span className="ml-1.5">· {entry.productionType}</span>}
                </p>
              </div>

              {hasXp && (
                <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                  entry.xpDelta! > 0 ? "text-teal" : "text-danger"
                }`}>
                  {entry.xpDelta! > 0 ? "+" : ""}{entry.xpDelta}
                </span>
              )}

              {/* Row index for visual rhythm */}
              <span className="flex-shrink-0 text-[8px] text-hud-border font-mono tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
