"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollText } from "lucide-react";

gsap.registerPlugin(useGSAP);
import type { FormativeClassEntry } from "@/lib/supabase/classes";
import type { Talent } from "@/talentos/types";
import { getClassIcon } from "@/shared/classIcons";
import CharacterSheet from "@/dashboard/components/CharacterSheet";

interface HeroSectionProps {
  studentName: string;
  classEntry: FormativeClassEntry | null;
  level: number;
  levelName: string;
  talents: Talent[];
}

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.06 } },
};

const textItem = {
  hidden: { opacity: 0, y: 18 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
};

// SVG noise for stone texture
const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")";

export default function HeroSection({ studentName, classEntry, level, levelName, talents }: HeroSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      boxShadow: "0 0 14px rgba(200,168,75,0.22), inset 0 0 6px rgba(200,168,75,0.06)",
      duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8,
    });
  });
  const classTitle = classEntry?.title ?? "Estudiante";
  const classIcon  = getClassIcon(classTitle);
  const classAttributes = classEntry?.attributes ?? [];
  const heroText =
    classEntry?.description ??
    "El camino del conocimiento requiere constancia. Cada entrega forja tu carácter y expande tu resonancia.";

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: "260px" }}
    >
      {/* ── Background photo ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/images/desierto.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center select-none"
        style={{ filter: "brightness(0.55) saturate(0.85)" }}
      />

      {/* ── Dark vignette — left heavy so text is readable ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,8,4,0.88) 0%, rgba(12,9,5,0.72) 42%, rgba(14,11,6,0.38) 72%, rgba(16,12,7,0.55) 100%)",
        }}
      />

      {/* ── Bottom fade — blends into StatusBar below ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: "60px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(8,6,3,0.85) 100%)",
        }}
      />

      {/* ── Top fade ── */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0"
        style={{
          height: "40px",
          background: "linear-gradient(to top, transparent 0%, rgba(8,6,3,0.6) 100%)",
        }}
      />

      {/* ── Stone noise texture over photo ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: STONE_NOISE, opacity: 0.6 }}
      />

      {/* ── Golden warm tint from left — enhances text area ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%", left: "-5%",
          width: "55%", height: "140%",
          background: "radial-gradient(ellipse at center, rgba(180,130,30,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Aged bronze borders — top and bottom */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[rgba(160,125,55,0.6)] via-[rgba(200,168,75,0.4)] to-[rgba(160,125,55,0.15)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[rgba(160,125,55,0.4)] via-[rgba(160,125,55,0.25)] to-transparent" />

      {/* Vertical divider before crest */}
      <div className="pointer-events-none absolute right-[216px] top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-[rgba(160,125,55,0.28)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-between px-8 py-8">

        {/* ── Left: Proclamation text ── */}
        <motion.div
          className="flex flex-col justify-center"
          variants={textContainer}
          initial="hidden"
          animate="show"
        >
          {/* Class label — heraldic small caps */}
          <motion.div variants={textItem} className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[rgba(160,125,55,0.45)]" />
            <span className="text-[11px] font-serif uppercase tracking-[0.4em] text-[rgba(200,168,75,0.55)]">
              {classTitle}
            </span>
            <div className="h-px w-6 bg-[rgba(160,125,55,0.45)]" />
          </motion.div>

          {/* Main heading — royal proclamation, dominant serif */}
          <motion.h1
            variants={textItem}
            className="font-serif leading-[1.15] text-[rgba(232,224,208,0.92)] max-w-lg"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
          >
            Bienvenido,{" "}
            <span className="text-[#c8a84b] font-semibold">
              {studentName}.
            </span>
          </motion.h1>

          {/* Description — italic serif, parchment tone */}
          <motion.p
            variants={textItem}
            className="mt-3 max-w-md text-[15px] leading-relaxed font-serif italic text-[rgba(232,224,208,0.45)]"
          >
            {heroText}
          </motion.p>

          {/* Attribute chips — heraldic bronze tags, straight edges */}
          {classAttributes.length > 0 && (
            <motion.div variants={textItem} className="mt-5 flex gap-2">
              {classAttributes.map((attr) => (
                <span
                  key={attr}
                  className="border border-[rgba(160,125,55,0.35)] bg-[rgba(160,125,55,0.08)] px-3 py-1 text-[11px] font-serif uppercase tracking-[0.2em] text-[rgba(200,168,75,0.7)]"
                >
                  {attr}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ── Right: Heraldic class crest ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease: "easeOut" }}
          className="flex-shrink-0 flex flex-col items-center gap-3 ml-8 w-[176px]"
        >
          {/* Square heraldic crest — no hexagon, no clip-path */}
          <div
            className="relative flex items-center justify-center bg-[rgba(160,125,55,0.06)] border border-[rgba(160,125,55,0.32)]"
            style={{ width: "84px", height: "84px" }}
          >
            {/* Inner frame */}
            <div className="absolute inset-[5px] border border-[rgba(160,125,55,0.12)]" />
            {/* Corner marks */}
            <span className="pointer-events-none absolute top-[2px] left-[2px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>
            <span className="pointer-events-none absolute top-[2px] right-[2px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>
            <span className="pointer-events-none absolute bottom-[2px] left-[2px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>
            <span className="pointer-events-none absolute bottom-[2px] right-[2px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>
            <span className="text-[42px] leading-none relative z-10 select-none" role="img" aria-label={classTitle}>
              {classIcon}
            </span>
          </div>

          {/* Class name + label */}
          <div className="text-center">
            <p className="font-serif text-sm font-semibold text-[#c8a84b]">{classTitle}</p>
            <p className="text-[11px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.4)] mt-0.5">
              Clase Formativa
            </p>
          </div>

          {/* Character sheet button */}
          <button
            ref={btnRef}
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[rgba(160,125,55,0.35)] bg-[rgba(160,125,55,0.05)] hover:border-[rgba(200,168,75,0.6)] hover:bg-[rgba(160,125,55,0.1)] transition-colors cursor-pointer"
          >
            <ScrollText size={12} strokeWidth={1.3} style={{ color: "rgba(200,168,75,0.65)" }} />
            <span className="text-[10px] font-serif uppercase tracking-[0.22em] text-[rgba(200,168,75,0.65)]">
              Hoja de Personaje
            </span>
          </button>

        </motion.div>
      </div>

      <CharacterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        studentName={studentName}
        level={level}
        levelName={levelName}
        classEntry={classEntry}
        talents={talents}
      />
    </div>
  );
}
