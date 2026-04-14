"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import {
  Check,
  Axe,
  Music,
  HeartHandshake,
  Shield,
  Leaf,
  BookOpen,
  RotateCcw,
  X,
  type LucideIcon,
} from "lucide-react";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

gsap.registerPlugin(useGSAP);

const ATTRIBUTE_LABELS: Record<string, string> = {
  Fuerza: "FUERZA",
  Constitución: "VIGOR",
  Carisma: "CARISMA",
  Destreza: "ARTE",
  Sabiduría: "SABID.",
  Inteligencia: "INTELIG.",
};

const CLASS_ICONS: Record<string, LucideIcon> = {
  barbaro: Axe,
  bardo: Music,
  clerigo: HeartHandshake,
  paladin: Shield,
  druida: Leaf,
  erudito: BookOpen,
};

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";



interface ClassesSectionProps {
  activeClassSlug: string;
  classes: FormativeClassEntry[];
}

export default function ClassesSection({ activeClassSlug, classes }: ClassesSectionProps) {
  const [openClass, setOpenClass] = useState<FormativeClassEntry | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!overlayRef.current || !popupRef.current) return;

      if (isOpen) {
        gsap.set(overlayRef.current, { display: "flex" });
        const tl = gsap.timeline();
        tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "none" });
        tl.fromTo(popupRef.current, { opacity: 0, scale: 0.84, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.52, ease: "back.out(1.5)" }, "-=0.1");
        tl.fromTo("[data-corner]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.25, ease: "back.out(3)" }, "-=0.4");
        tl.fromTo("[data-el]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.32, ease: "power3.out" }, "-=0.3");
      } else if (openClass) {
        const tl = gsap.timeline({
          onComplete: () => {
            setOpenClass(null);
            setFlipped(false);
            gsap.set(overlayRef.current!, { display: "none" });
          },
        });
        tl.to(popupRef.current, { opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: "power2.in" });
        tl.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "none" }, "-=0.1");
      }
    },
    { scope: overlayRef, dependencies: [isOpen] }
  );

  function handleOpen(cls: FormativeClassEntry, e: React.MouseEvent) {
    gsap.timeline()
      .to(e.currentTarget, { scale: 0.93, duration: 0.1, ease: "power2.in" })
      .to(e.currentTarget, { scale: 1, duration: 0.4, ease: "back.out(2.5)" });
    setOpenClass(cls);
    setIsOpen(true);
    setFlipped(false);
  }

  function handleClose() {
    setIsOpen(false);
  }

  if (classes.length === 0) return null;

  return (
    <>
      <section className="pb-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6 flex flex-col items-center text-center"
        >
          <p className="mb-1 text-[9px] font-serif uppercase tracking-[0.3em] text-[rgba(160,125,55,0.5)]">
            Especialización de Gremio
          </p>
          <h2 className="font-serif text-2xl font-bold text-[rgba(232,224,208,0.9)]">Clases Formativas</h2>
          <p className="mt-2 max-w-[320px] text-[10px] font-serif italic leading-relaxed text-[rgba(160,125,55,0.4)]">
            "Porque muchos son llamados, más pocos son los escogidos."
            <br />
            <span className="not-italic text-[rgba(160,125,55,0.3)]">— Arquetipos del Conocimiento</span>
          </p>
        </motion.div>

        {/* Compact class cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {classes.map((cls, index) => {
            const isActive = cls.slug === activeClassSlug;
            const [attr1, attr2] = cls.attributes;
            const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;

            return (
              <motion.div
                key={cls.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.07, duration: 0.38, ease: "easeOut" }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                onClick={(e) => handleOpen(cls, e)}
                className="relative flex w-[200px] cursor-pointer flex-col overflow-hidden p-4 transition-all"
                style={{
                  background: `${STONE_NOISE}, linear-gradient(170deg, ${isActive ? "#1c1408" : "#121109"} 0%, #0c0b07 100%)`,
                  border: `1px solid ${isActive ? "rgba(160,125,55,0.48)" : "rgba(160,125,55,0.2)"}`,
                  boxShadow: isActive ? "0 0 24px rgba(200,168,75,0.07)" : "none",
                }}
              >
                {/* Inner frame */}
                <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.07)]" />

                {/* Watermark icon */}
                <ClassIcon size={76} strokeWidth={0.55} className="absolute -top-2 -right-2 pointer-events-none text-[rgba(160,125,55,0.07)]" />

                {isActive && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 border border-[rgba(160,125,55,0.38)] bg-[rgba(160,125,55,0.1)] px-1.5 py-0.5 text-[8px] font-serif uppercase tracking-[0.18em] text-[#c8a84b]">
                    <Check size={7} strokeWidth={3} />
                    Activa
                  </span>
                )}

                {/* Attributes */}
                <div className="relative mb-2 flex flex-wrap gap-1">
                  {[attr1, attr2].filter(Boolean).map((attr) => (
                    <span
                      key={attr}
                      className="border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.06)] px-1.5 py-0.5 text-[8px] font-serif uppercase tracking-[0.15em] text-[rgba(160,125,55,0.5)]"
                    >
                      {ATTRIBUTE_LABELS[attr] ?? attr}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <div className="relative mb-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <ClassIcon size={15} strokeWidth={1.3} className={isActive ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.5)]"} />
                    <h3 className={`font-serif text-sm font-bold leading-tight ${isActive ? "text-[#c8a84b] uppercase" : "text-[rgba(232,224,208,0.85)]"}`}>
                      {cls.title}
                    </h3>
                  </div>
                  <p className="text-[8px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.38)]">
                    {cls.inspiration}
                  </p>
                </div>

                <p className="relative flex-1 text-[11px] font-serif leading-relaxed text-[rgba(160,125,55,0.48)] line-clamp-3">
                  {cls.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Popup overlay ── */}
      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-50 items-center justify-center bg-black/82 p-4"
        onClick={handleClose}
      >
        <div
          ref={popupRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm"
        >
          {/* Iron bracket corners */}
          <div data-corner className="pointer-events-none absolute -top-2.5 -left-2.5 h-8 w-8 border-t-2 border-l-2 border-[rgba(160,125,55,0.55)]" />
          <div data-corner className="pointer-events-none absolute -top-2.5 -right-2.5 h-8 w-8 border-t-2 border-r-2 border-[rgba(160,125,55,0.55)]" />
          <div data-corner className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-8 w-8 border-b-2 border-l-2 border-[rgba(160,125,55,0.55)]" />
          <div data-corner className="pointer-events-none absolute -bottom-2.5 -right-2.5 h-8 w-8 border-b-2 border-r-2 border-[rgba(160,125,55,0.55)]" />

          {/* Close button — square */}
          <button
            onClick={handleClose}
            className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center border border-[rgba(160,125,55,0.3)] bg-[#120e08] text-[rgba(200,168,75,0.5)] hover:text-[rgba(200,168,75,1)] transition-colors"
          >
            <X size={13} />
          </button>

          {openClass && (
            <div className="relative" style={{ perspective: "1200px", height: "420px" }}>
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d", position: "relative", height: "100%" }}
              >
                <CardFace backface={false}>
                  <ClassCardFront
                    cls={openClass}
                    isActive={openClass.slug === activeClassSlug}
                    onFlip={() => setFlipped(true)}
                  />
                </CardFace>
                <CardFace backface={true}>
                  <ClassCardBack cls={openClass} onFlip={() => setFlipped(false)} />
                </CardFace>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CardFace({ backface, children }: { backface: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        position: backface ? "absolute" : "relative",
        inset: backface ? 0 : undefined,
        transform: backface ? "rotateY(180deg)" : undefined,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

function ClassCardFront({ cls, isActive, onFlip }: {
  cls: FormativeClassEntry;
  isActive: boolean;
  onFlip: () => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
  const [attr1, attr2] = cls.attributes;

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden p-6"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #131110 0%, #0d0c0b 100%)`,
        border: "1px solid rgba(160,125,55,0.42)",
        boxShadow: "0 8px 50px rgba(0,0,0,0.9)",
      }}
    >
      <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.1)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,168,75,0.04)_0%,transparent_55%)]" />
      <ClassIcon size={180} strokeWidth={0.45} className="absolute -bottom-6 -right-6 pointer-events-none text-[rgba(160,125,55,0.05)]" />

      <div data-el className="relative mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
            style={{
              border: "1px solid rgba(160,125,55,0.38)",
              background: isActive ? "rgba(160,125,55,0.15)" : "rgba(160,125,55,0.07)",
            }}
          >
            <ClassIcon size={20} strokeWidth={1.4} className={isActive ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.55)]"} />
          </div>
          <div>
            <h3 className={`font-serif text-xl font-bold leading-tight ${isActive ? "text-[#c8a84b]" : "text-[rgba(232,224,208,0.88)]"}`}>
              {cls.title}
            </h3>
            <p className="text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.4)] mt-0.5">
              {cls.inspiration}
            </p>
          </div>
        </div>
        {isActive && (
          <span className="flex items-center gap-1 border border-[rgba(160,125,55,0.38)] bg-[rgba(160,125,55,0.1)] px-2 py-0.5 text-[8px] font-serif uppercase tracking-[0.2em] text-[#c8a84b] shrink-0">
            <Check size={7} strokeWidth={3} />
            Activa
          </span>
        )}
      </div>

      <div data-el className="relative mb-4 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.3)] to-transparent" />

      <div data-el className="relative mb-4 flex gap-2 flex-wrap">
        {[attr1, attr2].filter(Boolean).map((attr) => (
          <span
            key={attr}
            className="border border-[rgba(160,125,55,0.35)] bg-[rgba(160,125,55,0.08)] px-3 py-0.5 text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(200,168,75,0.7)]"
          >
            {ATTRIBUTE_LABELS[attr] ?? attr}
          </span>
        ))}
      </div>

      <p data-el className="relative flex-1 text-[13px] font-serif leading-relaxed text-[rgba(160,125,55,0.55)]">
        {cls.description}
      </p>

      <div data-el className="relative mt-4">
        <button
          onClick={onFlip}
          className="flex w-full items-center justify-center gap-2 border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.06)] py-2.5 text-[9px] font-serif uppercase tracking-[0.25em] text-[rgba(200,168,75,0.6)] hover:text-[rgba(200,168,75,0.9)] hover:bg-[rgba(160,125,55,0.1)] transition-colors"
        >
          <RotateCcw size={11} strokeWidth={1.8} />
          Ver versículo
        </button>
      </div>
    </div>
  );
}

function ClassCardBack({ cls, onFlip }: {
  cls: FormativeClassEntry;
  onFlip: () => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden p-6 text-center"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #111814 0%, #0a100d 100%)`,
        border: "1px solid rgba(0,155,125,0.3)",
        boxShadow: "0 8px 50px rgba(0,0,0,0.9)",
      }}
    >
      <div className="pointer-events-none absolute inset-[5px] border border-[rgba(0,155,125,0.08)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,155,125,0.04)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,155,125,0.3)] to-transparent" />

      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>

      <div
        className="relative mb-4 flex h-14 w-14 items-center justify-center"
        style={{ border: "1px solid rgba(0,155,125,0.28)", background: "rgba(0,155,125,0.06)" }}
      >
        <div className="pointer-events-none absolute inset-[4px] border border-[rgba(0,155,125,0.1)]" />
        <ClassIcon size={26} strokeWidth={1.2} className="text-[rgba(0,185,150,0.8)]" />
      </div>

      <p className="relative mb-1 text-[9px] font-serif uppercase tracking-[0.3em] text-[rgba(0,155,125,0.5)]">
        {cls.title}
      </p>
      <div className="relative mb-4 mt-2 w-16 h-px bg-gradient-to-r from-transparent via-[rgba(0,155,125,0.3)] to-transparent" />

      <blockquote className="relative mb-4 flex flex-1 flex-col items-center justify-center">
        <span className="font-serif text-[48px] font-bold text-[rgba(200,168,75,0.18)] leading-none mb-[-14px] self-start ml-2 select-none">❝</span>
        <p className="font-serif text-sm leading-relaxed text-[rgba(232,224,208,0.7)] italic px-2">
          {cls.verse_text ?? "Versículo no configurado."}
        </p>
        {cls.verse_reference && (
          <cite className="mt-3 flex items-center gap-2 text-[10px] not-italic font-serif text-[rgba(200,168,75,0.5)] tracking-wider">
            <span className="text-[rgba(0,155,125,0.4)] text-[8px]">✠</span>
            {cls.verse_reference}
            <span className="text-[rgba(0,155,125,0.4)] text-[8px]">✠</span>
          </cite>
        )}
      </blockquote>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,155,125,0.25)] to-transparent" />

      <button
        onClick={onFlip}
        className="relative mt-4 flex items-center gap-2 border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.06)] px-4 py-2.5 text-[9px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.8)] transition-colors"
      >
        <RotateCcw size={11} strokeWidth={1.8} />
        Volver
      </button>
    </div>
  );
}
