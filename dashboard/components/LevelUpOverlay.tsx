"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Parchment + stone noise
const PARCHMENT_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")";

interface LevelUpOverlayProps {
  level: number;
  levelName: string;
  email: string;
}

export default function LevelUpOverlay({ level, levelName, email }: LevelUpOverlayProps) {
  const [show, setShow] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const storageKey = `levelup_seen_${email}`;

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(storageKey) ?? "0", 10);
    if (stored > 0 && level > stored) setShow(true);
    localStorage.setItem(storageKey, String(level));
  }, []);

  useGSAP(
    () => {
      if (!show || !overlayRef.current) return;

      const tl = gsap.timeline();

      // 1. Fade in overlay
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // 2. Burst expands
      tl.fromTo(burstRef.current,
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      );

      // 3. Card drops in from above
      tl.fromTo(cardRef.current,
        { opacity: 0, y: -60, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.2)" },
        "-=0.4"
      );

      // 4. Idle golden pulse on the level number
      tl.to(".levelup-number", {
        textShadow: "0 0 40px rgba(212,160,23,0.9), 0 0 80px rgba(212,160,23,0.4)",
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }, "+=0.1");
    },
    { dependencies: [show] }
  );

  function dismiss() {
    if (!overlayRef.current) { setShow(false); return; }
    gsap.timeline({ onComplete: () => setShow(false) })
      .to(cardRef.current, { opacity: 0, y: 20, scale: 0.92, duration: 0.25, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  }

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={dismiss}
    >
      {/* Radial gold burst — cathedral rose window light */}
      <div
        ref={burstRef}
        className="pointer-events-none absolute"
        style={{
          width: "600px", height: "600px",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse at center, rgba(212,160,23,0.18) 0%, rgba(212,160,23,0.06) 35%, transparent 65%)",
        }}
      />
      {/* Crepuscular rays */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "700px", height: "700px",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: `conic-gradient(
            from 0deg,
            transparent 0deg, rgba(212,160,23,0.04) 3deg, transparent 6deg,
            transparent 30deg, rgba(212,160,23,0.03) 33deg, transparent 36deg,
            transparent 60deg, rgba(212,160,23,0.05) 63deg, transparent 66deg,
            transparent 90deg, rgba(212,160,23,0.03) 93deg, transparent 96deg,
            transparent 120deg, rgba(212,160,23,0.04) 123deg, transparent 126deg,
            transparent 150deg, rgba(212,160,23,0.03) 153deg, transparent 156deg,
            transparent 180deg, rgba(212,160,23,0.04) 183deg, transparent 186deg,
            transparent 210deg, rgba(212,160,23,0.03) 213deg, transparent 216deg,
            transparent 240deg, rgba(212,160,23,0.05) 243deg, transparent 246deg,
            transparent 270deg, rgba(212,160,23,0.03) 273deg, transparent 276deg,
            transparent 300deg, rgba(212,160,23,0.04) 303deg, transparent 306deg,
            transparent 330deg, rgba(212,160,23,0.03) 333deg, transparent 336deg
          )`,
        }}
      />

      {/* The proclamation scroll */}
      <div
        ref={cardRef}
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer iron bracket corners */}
        <div className="pointer-events-none absolute -top-3 -left-3 h-10 w-10 border-t-2 border-l-2 border-[rgba(200,168,75,0.65)]" />
        <div className="pointer-events-none absolute -top-3 -right-3 h-10 w-10 border-t-2 border-r-2 border-[rgba(200,168,75,0.65)]" />
        <div className="pointer-events-none absolute -bottom-3 -left-3 h-10 w-10 border-b-2 border-l-2 border-[rgba(200,168,75,0.65)]" />
        <div className="pointer-events-none absolute -bottom-3 -right-3 h-10 w-10 border-b-2 border-r-2 border-[rgba(200,168,75,0.65)]" />

        {/* Scroll panel */}
        <div
          className="relative flex flex-col items-center overflow-hidden px-10 py-10 text-center"
          style={{
            background: `${PARCHMENT_NOISE}, linear-gradient(170deg, #1c1408 0%, #130e05 100%)`,
            border: "1px solid rgba(160,125,55,0.55)",
            boxShadow: "0 12px 80px rgba(0,0,0,0.95), 0 0 100px rgba(212,160,23,0.08)",
          }}
        >
          {/* Inner manuscript frame */}
          <div className="pointer-events-none absolute inset-[6px] border border-[rgba(160,125,55,0.12)]" />

          {/* Corner ◆ marks */}
          <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.45)] leading-none select-none">◆</span>
          <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.45)] leading-none select-none">◆</span>
          <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.45)] leading-none select-none">◆</span>
          <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.45)] leading-none select-none">◆</span>

          {/* Candlelight */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,140,60,0.09)_0%,transparent_65%)]" />
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.5)] to-transparent" />

          {/* ── Header inscription ── */}
          <div className="relative flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(160,125,55,0.5)]" />
            <p className="text-[8px] font-serif uppercase tracking-[0.4em] text-[rgba(200,168,75,0.5)]">
              Proclamación Real
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[rgba(160,125,55,0.5)]" />
          </div>

          {/* ── Giant level numeral — illuminated digit ── */}
          <p
            className="levelup-number relative font-serif font-bold text-[#d4a017] leading-none select-none"
            style={{
              fontSize: "clamp(5rem, 18vw, 7rem)",
              textShadow: "0 0 20px rgba(212,160,23,0.6), 0 0 60px rgba(212,160,23,0.25)",
            }}
          >
            {level}
          </p>

          {/* Ornamental divider */}
          <div className="relative flex items-center gap-3 my-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[rgba(160,125,55,0.4)]" />
            <span className="text-[rgba(160,125,55,0.45)] text-[8px] leading-none">✦</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[rgba(160,125,55,0.4)]" />
          </div>

          {/* Level name — royal title */}
          <p className="relative font-serif text-xl font-semibold text-[rgba(232,224,208,0.9)] leading-snug mb-1">
            {levelName}
          </p>
          <p className="relative text-[9px] font-serif uppercase tracking-[0.3em] text-[rgba(160,125,55,0.45)] mb-6">
            ¡Nuevo Nivel Alcanzado!
          </p>

          {/* Verse-like proclamation */}
          <p className="relative font-serif text-xs italic leading-relaxed text-[rgba(232,224,208,0.45)] mb-8 px-2">
            Tu constancia ha sido inscrita en el Libro de las Crónicas.
          </p>

          {/* CTA — heraldic square button */}
          <button
            onClick={dismiss}
            className="relative px-8 py-2.5 font-serif text-[10px] uppercase tracking-[0.3em] text-[#1a1000] bg-[#c8a84b] transition-all hover:bg-[#d4b45a]"
            style={{
              border: "1px solid rgba(200,168,75,0.8)",
              boxShadow: "0 0 16px rgba(200,168,75,0.2)",
            }}
          >
            Continuar
          </button>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.4)] to-transparent" />
        </div>
      </div>
    </div>
  );
}
