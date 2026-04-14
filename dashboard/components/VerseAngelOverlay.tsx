"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Wing root in SVG coords — pivot point for rotation
const ROOT = "150 185";

const MOTES = [
  { left: "8%",  delay: 0.0, dur: 5.5, size: 2.0, drift:  5 },
  { left: "20%", delay: 1.8, dur: 6.8, size: 1.5, drift: -4 },
  { left: "35%", delay: 0.5, dur: 5.2, size: 2.5, drift:  3 },
  { left: "50%", delay: 2.4, dur: 6.0, size: 1.8, drift: -6 },
  { left: "63%", delay: 1.0, dur: 5.8, size: 2.2, drift:  4 },
  { left: "76%", delay: 3.2, dur: 6.5, size: 1.5, drift: -3 },
  { left: "87%", delay: 0.8, dur: 5.0, size: 2.0, drift:  5 },
  { left: "44%", delay: 4.0, dur: 6.2, size: 1.8, drift: -4 },
];

// ── Left wing paths (root at 150,185) ───────────────────────────────────────

// Outer silhouette — inner edge (root→tip) + scalloped feather edge (tip→root)
const LEFT_CONTOUR = `
  M 150,185
  C 140,165 126,140 108,112
  C 90,85   70,60   48,42
  C 30,26   12,22   5,38
  C 0,50    2,68    12,82
  C 4,95    0,112   10,122
  C 18,128  30,126  38,116
  C 44,124  48,140  55,144
  C 62,150  74,148  80,136
  C 86,144  91,158  98,162
  C 106,166 116,164 120,152
  C 126,158 130,170 134,170
  C 138,172 141,172 143,166
  C 145,168 148,176 150,185
  Z
`;

// Feather tier lines (3 layers — from lowest to highest)
const LEFT_TIER1 = "M 38,116 C 58,106 80,96 104,86 C 124,78 138,74 148,72";
const LEFT_TIER2 = "M 14,78  C 34,62  56,48  80,36  C 102,26 124,20 146,18";
const LEFT_TIER3 = "M 5,48   C 24,30  48,16  74,8   C 98,2   122,-2  146,2";

// ── Right wing paths (mirror: x → 300-x) ────────────────────────────────────

const RIGHT_CONTOUR = `
  M 150,185
  C 160,165 174,140 192,112
  C 210,85  230,60  252,42
  C 270,26  288,22  295,38
  C 300,50  298,68  288,82
  C 296,95  300,112 290,122
  C 282,128 270,126 262,116
  C 256,124 252,140 245,144
  C 238,150 226,148 220,136
  C 214,144 209,158 202,162
  C 194,166 184,164 180,152
  C 174,158 170,170 166,170
  C 162,172 159,172 157,166
  C 155,168 152,176 150,185
  Z
`;

const RIGHT_TIER1 = "M 262,116 C 242,106 220,96 196,86 C 176,78 162,74 152,72";
const RIGHT_TIER2 = "M 286,78  C 266,62  244,48  220,36 C 198,26 176,20 154,18";
const RIGHT_TIER3 = "M 295,48  C 276,30  252,16  226,8  C 202,2  178,-2  154,2";

// ────────────────────────────────────────────────────────────────────────────

export default function VerseAngelOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftBodyRef  = useRef<SVGGElement>(null);
  const leftTipsRef  = useRef<SVGGElement>(null);
  const rightBodyRef = useRef<SVGGElement>(null);
  const rightTipsRef = useRef<SVGGElement>(null);
  const motesRef     = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // ── Wing beat ──────────────────────────────────────────────────────────
    // Downstroke (spread):  1.8s power2.in  — powerful
    // Upstroke   (fold):    2.6s power1.out — slow, majestic
    // Tips lag 0.22s and have 78% amplitude — flexible feather physics

    function beatWing(
      bodyEl: SVGGElement | null,
      tipsEl: SVGGElement | null,
      spreadAngle: number,  // rotation when fully open
      foldAngle: number     // rotation when folded toward body
    ) {
      if (!bodyEl || !tipsEl) return;

      const tl = gsap.timeline({ repeat: -1 });
      tl
        .fromTo(bodyEl,
          { svgOrigin: ROOT, rotation: foldAngle,   opacity: 0.28 },
          { svgOrigin: ROOT, rotation: spreadAngle, opacity: 0.68,
            duration: 1.8, ease: "power2.in" }
        )
        .to(bodyEl,
          { svgOrigin: ROOT, rotation: foldAngle, opacity: 0.28,
            duration: 2.6, ease: "power1.out" }
        );

      const tipAmp = 0.78;
      const tl2 = gsap.timeline({ repeat: -1, delay: 0.22 });
      tl2
        .fromTo(tipsEl,
          { svgOrigin: ROOT, rotation: foldAngle   * tipAmp },
          { svgOrigin: ROOT, rotation: spreadAngle * tipAmp,
            duration: 1.8, ease: "power2.in" }
        )
        .to(tipsEl,
          { svgOrigin: ROOT, rotation: foldAngle * tipAmp,
            duration: 2.6, ease: "power1.out" }
        );
    }

    // Left wing: spread = rotate counter-clockwise (tips go upper-left)
    // Right wing: mirror
    beatWing(leftBodyRef.current,  leftTipsRef.current,  -14,  10);
    beatWing(rightBodyRef.current, rightTipsRef.current,  14, -10);

    // ── Ascending motes ────────────────────────────────────────────────────
    motesRef.current.forEach((mote, i) => {
      if (!mote) return;
      const { dur, delay, drift } = MOTES[i];
      gsap.to(mote, {
        keyframes: [
          { opacity: 0,    y: 0,    x: 0,            scale: 1.0, duration: 0            },
          { opacity: 0.95, y: -22,  x: drift * 0.15, scale: 1.1, duration: 0.75, ease: "power2.out" },
          { opacity: 0.7,  y: -105, x: drift * 0.6,  scale: 0.75, duration: dur * 0.5, ease: "none"       },
          { opacity: 0,    y: -208, x: drift,         scale: 0.2, duration: dur * 0.5, ease: "power1.in"  },
        ],
        repeat: -1,
        delay,
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* ── Angel wings ── */}
      <svg
        viewBox="0 0 300 200"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* ── LEFT WING ── */}

        {/* Body: contour silhouette + lower two feather tiers */}
        <g ref={leftBodyRef}>
          {/* Filled silhouette — very subtle glow */}
          <path
            d={LEFT_CONTOUR}
            fill="rgba(255,248,180,0.028)"
            stroke="rgba(255,248,180,0.88)"
            strokeWidth="1.1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Feather tier 1 — lower (just above scallops) */}
          <path
            d={LEFT_TIER1}
            stroke="rgba(255,248,180,0.55)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          {/* Feather tier 2 — middle */}
          <path
            d={LEFT_TIER2}
            stroke="rgba(255,248,180,0.40)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </g>

        {/* Tips: upper feather tier — lags behind on beat */}
        <g ref={leftTipsRef}>
          <path
            d={LEFT_TIER3}
            stroke="rgba(255,248,180,0.28)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </g>

        {/* ── RIGHT WING ── */}

        <g ref={rightBodyRef}>
          <path
            d={RIGHT_CONTOUR}
            fill="rgba(255,248,180,0.028)"
            stroke="rgba(255,248,180,0.88)"
            strokeWidth="1.1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={RIGHT_TIER1}
            stroke="rgba(255,248,180,0.55)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d={RIGHT_TIER2}
            stroke="rgba(255,248,180,0.40)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </g>

        <g ref={rightTipsRef}>
          <path
            d={RIGHT_TIER3}
            stroke="rgba(255,248,180,0.28)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* ── Ascending divine light motes ── */}
      {MOTES.map((m, i) => (
        <div
          key={i}
          ref={(el) => { motesRef.current[i] = el; }}
          style={{
            position: "absolute",
            left: m.left,
            bottom: "8%",
            width:  `${m.size}px`,
            height: `${m.size}px`,
            borderRadius: "50%",
            background: "rgba(255,252,205,0.95)",
            boxShadow: `0 0 ${m.size * 3}px rgba(255,240,140,0.85), 0 0 ${m.size * 7}px rgba(255,248,180,0.3)`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
