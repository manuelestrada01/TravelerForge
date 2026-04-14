"use client";

import { useRef } from "react";
import { BookOpen } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface VerseContentProps {
  text: string;
  reference: string;
}

export default function VerseContent({ text, reference }: VerseContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const citeRef = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Divider extends from center
    tl.fromTo(dividerRef.current,
      { scaleX: 0, transformOrigin: "center" },
      { scaleX: 1, duration: 0.5, ease: "power3.out" }
    )
    // Words appear staggered
    .to("[data-word]",
      { opacity: 1, y: 0, stagger: 0.038, duration: 0.44, ease: "power2.out" },
      "-=0.15"
    )
    // Citation fades in
    .to(citeRef.current,
      { opacity: 1, duration: 0.35, ease: "power2.out" },
      "-=0.2"
    );

    // Continuous halo breathing — slow, divine pulse
    gsap.to(haloRef.current, {
      boxShadow: "0 0 32px rgba(255,240,140,0.30), 0 0 8px rgba(255,240,140,0.12) inset",
      duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      {/* Sacred lamp icon */}
      <div className="relative mb-4 flex flex-col items-center">
        <div
          ref={haloRef}
          className="absolute"
          style={{
            width: "72px", height: "72px",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "1px solid rgba(255,248,180,0.15)",
            boxShadow: "0 0 8px rgba(255,240,140,0.06)",
          }}
        />
        <div
          className="relative flex h-14 w-14 items-center justify-center"
          style={{
            borderRadius: "50%",
            border: "1px solid rgba(220,195,110,0.45)",
            background: "radial-gradient(ellipse at 40% 30%, rgba(255,248,180,0.12) 0%, rgba(220,195,110,0.06) 60%, transparent 100%)",
            boxShadow: "0 0 16px rgba(255,240,140,0.18), 0 0 4px rgba(255,240,140,0.12) inset",
          }}
        >
          <BookOpen size={24} strokeWidth={1} style={{ color: "rgba(255,248,180,0.88)" }} />
        </div>
      </div>

      {/* Label */}
      <p
        className="relative mb-1 font-serif uppercase"
        style={{ fontSize: "10px", letterSpacing: "0.38em", color: "rgba(220,195,110,0.5)" }}
      >
        Versículo del Día
      </p>

      {/* Divider — extends from center on mount */}
      <div
        ref={dividerRef}
        className="relative mb-5 mt-2"
        style={{
          width: "80px", height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,248,180,0.45) 30%, rgba(255,255,200,0.7) 50%, rgba(255,248,180,0.45) 70%, transparent 100%)",
          boxShadow: "0 0 6px rgba(255,240,140,0.3)",
        }}
      />

      {/* The Word — revealed word by word */}
      <blockquote className="relative flex flex-col items-center w-full px-4">
        <p
          className="font-serif italic text-center leading-loose"
          style={{ fontSize: "15.5px", color: "rgba(255,250,235,0.85)", textShadow: "0 1px 8px rgba(255,240,140,0.08)" }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              data-word
              className="inline-block"
              style={{ marginRight: i < words.length - 1 ? "0.25em" : 0, opacity: 0, transform: "translateY(5px)" }}
            >
              {word}
            </span>
          ))}
        </p>

        <cite
          ref={citeRef}
          className="mt-5 flex items-center gap-2.5 not-italic font-serif"
          style={{ fontSize: "12px", color: "rgba(220,195,110,0.65)", letterSpacing: "0.22em", opacity: 0 }}
        >
          <span style={{ fontSize: "9px", color: "rgba(255,248,180,0.4)" }}>✝</span>
          {reference}
          <span style={{ fontSize: "9px", color: "rgba(255,248,180,0.4)" }}>✝</span>
        </cite>
      </blockquote>
    </div>
  );
}
