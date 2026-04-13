"use client";

import { motion } from "framer-motion";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

interface HeroSectionProps {
  studentName: string;
  classEntry: FormativeClassEntry | null;
}

const textContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const textItem = {
  hidden: { opacity: 0, y: 22 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
};

export default function HeroSection({ studentName, classEntry }: HeroSectionProps) {
  const classLabel = classEntry?.title.toUpperCase() ?? "ESTUDIANTE";
  const heroText =
    classEntry?.description ??
    "Tu recorrido en el nexo técnico continúa. Mantén la resonancia alta para desbloquear nuevos fragmentos de sabiduría.";

  return (
    <div
      className="relative w-full overflow-hidden scanlines"
      style={{ minHeight: "220px", clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)" }}
    >
      {/* Background image — zoom-in on mount */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/images/bosque.png')",
          backgroundPosition: "center 65%",
        }}
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.8, ease: "easeOut" }}
      />

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-hud-base/90 via-hud-base/60 to-hud-base/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-hud-base/70 via-transparent to-transparent" />

      {/* Subtle gold radial in center */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_50%,rgba(201,162,39,0.06)_0%,transparent_60%)]" />

      {/* Corner rune ornaments */}
      <div className="pointer-events-none absolute top-3 left-3 text-gold/40 text-[8px] leading-none">◆</div>
      <div className="pointer-events-none absolute bottom-5 right-5 text-gold/30 text-[8px] leading-none">◆</div>

      {/* Top gold line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full flex-col justify-center px-8 py-8"
        variants={textContainer}
        initial="hidden"
        animate="show"
      >
        {/* Class label */}
        <motion.p
          variants={textItem}
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60"
        >
          ◆ {classLabel} ◆
        </motion.p>

        {/* Main heading */}
        <motion.h1
          variants={textItem}
          className="font-serif text-5xl font-normal leading-tight text-cream max-w-2xl"
        >
          Bienvenido,{" "}
          <em className="not-italic gold-glow text-gold font-semibold">{studentName}.</em>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={textItem}
          className="mt-3 max-w-md text-sm leading-relaxed text-sage"
        >
          {heroText}
        </motion.p>
      </motion.div>

      {/* Bottom chamfer line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hud-border to-transparent" />
    </div>
  );
}
