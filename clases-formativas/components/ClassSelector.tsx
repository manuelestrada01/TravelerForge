"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Axe, Music, HeartHandshake, Shield, Leaf, BookOpen,
  Check, LogOut, type LucideIcon,
} from "lucide-react";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

const CLASS_ICONS: Record<string, LucideIcon> = {
  barbaro: Axe,
  bardo: Music,
  clerigo: HeartHandshake,
  paladin: Shield,
  druida: Leaf,
  erudito: BookOpen,
};

const CLIP = "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)";
const CLIP_BTN = "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))";

export default function ClassSelector({
  email,
  classes,
}: {
  email: string;
  classes: FormativeClassEntry[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const selectedClass = classes.find((c) => c.slug === selected);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/student/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formativeClass: selected }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  void email;

  if (classes.length === 0) {
    return (
      <p className="text-center font-serif italic text-[#8899aa] text-sm">
        No hay clases formativas disponibles por el momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Class grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const isSelected = selected === cls.slug;
          const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
          const [attr1, attr2] = cls.attributes;

          return (
            /* Gradient border wrapper */
            <div
              key={cls.slug}
              style={{
                padding: "1px",
                clipPath: CLIP,
                background: isSelected
                  ? "linear-gradient(135deg, rgba(212,160,23,0.7) 0%, rgba(28,32,48,0.6) 40%, rgba(212,160,23,0.4) 100%)"
                  : "linear-gradient(135deg, rgba(212,160,23,0.3) 0%, rgba(28,32,48,0.4) 50%, rgba(212,160,23,0.15) 100%)",
                boxShadow: isSelected
                  ? "0 0 28px rgba(212,160,23,0.15), 0 4px 24px rgba(0,0,0,0.7)"
                  : "0 4px 24px rgba(0,0,0,0.7)",
                transition: "all 0.2s",
              }}
            >
              <button
                onClick={() => { setSelected(cls.slug); setConfirming(false); }}
                className="relative flex flex-col gap-3 p-5 text-left w-full h-full transition-all hover:brightness-110"
                style={{
                  clipPath: CLIP,
                  background: isSelected
                    ? "linear-gradient(170deg, #1c1f2e 0%, #131720 100%)"
                    : "#131720",
                }}
              >
                {/* Watermark icon */}
                <ClassIcon
                  size={90}
                  strokeWidth={0.4}
                  className="absolute -top-2 -right-2 pointer-events-none"
                  style={{ color: "rgba(212,160,23,0.06)" }}
                />

                {/* Selected indicator */}
                {isSelected && (
                  <span
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 text-[8px] font-serif uppercase tracking-[0.2em]"
                    style={{
                      background: "rgba(212,160,23,0.15)",
                      border: "1px solid rgba(212,160,23,0.4)",
                      color: "#d4a017",
                    }}
                  >
                    <Check size={7} strokeWidth={3} />
                    Elegida
                  </span>
                )}

                {/* Icon + title */}
                <div className="relative flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center"
                    style={{
                      clipPath: "polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
                      background: isSelected ? "rgba(212,160,23,0.18)" : "rgba(212,160,23,0.08)",
                      outline: `1px solid ${isSelected ? "rgba(212,160,23,0.45)" : "rgba(212,160,23,0.2)"}`,
                    }}
                  >
                    <ClassIcon
                      size={17}
                      strokeWidth={1.4}
                      style={{ color: isSelected ? "#d4a017" : "rgba(212,160,23,0.5)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="font-serif text-[15px] font-bold leading-tight"
                      style={{ color: isSelected ? "#d4a017" : "#f5f0e8" }}
                    >
                      {cls.title}
                    </p>
                    <p className="text-[9px] font-serif uppercase tracking-[0.22em] mt-0.5" style={{ color: "rgba(136,153,170,0.6)" }}>
                      {cls.inspiration}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="relative w-full"
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.2) 50%, transparent 100%)",
                  }}
                />

                {/* Description */}
                <p className="relative text-[11px] leading-relaxed" style={{ color: "#8899aa" }}>
                  {cls.description}
                </p>

                {/* Attribute chips */}
                <div className="relative flex gap-1.5 flex-wrap mt-auto pt-1">
                  {[attr1, attr2].filter(Boolean).map((attr) => (
                    <span
                      key={attr}
                      className="px-2 py-0.5 text-[8px] font-serif uppercase tracking-[0.18em]"
                      style={{
                        border: "1px solid rgba(212,160,23,0.25)",
                        background: "rgba(212,160,23,0.06)",
                        color: "rgba(212,160,23,0.6)",
                      }}
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Select CTA */}
      {selected && !confirming && (
        <div className="flex justify-center">
          <button
            onClick={() => setConfirming(true)}
            className="px-10 py-3 font-serif text-sm font-bold transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(160deg, #d4a017, #a87828)",
              clipPath: CLIP_BTN,
              boxShadow: "0 0 20px rgba(212,160,23,0.3)",
              color: "#07080c",
            }}
          >
            Elegir {selectedClass?.title}
          </button>
        </div>
      )}

      {/* Confirmation panel */}
      {confirming && (
        <div
          className="relative flex flex-col items-center gap-4 p-6 text-center"
          style={{
            background: "#07080c",
            clipPath: CLIP,
            outline: "1px solid rgba(212,160,23,0.3)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at top, rgba(212,160,23,0.04) 0%, transparent 60%)" }}
          />

          <p className="relative font-serif text-base" style={{ color: "#f5f0e8" }}>
            ¿Confirmás que tu clase es{" "}
            <span className="font-semibold" style={{ color: "#d4a017" }}>{selectedClass?.title}</span>?
          </p>
          <p className="relative text-xs font-serif italic" style={{ color: "rgba(136,153,170,0.6)" }}>
            Esta decisión no se puede cambiar.
          </p>

          <div className="relative flex gap-3">
            <button
              onClick={() => setConfirming(false)}
              className="px-5 py-2.5 text-sm font-serif transition-colors hover:brightness-110"
              style={{
                border: "1px solid rgba(212,160,23,0.2)",
                background: "rgba(212,160,23,0.04)",
                color: "#8899aa",
              }}
            >
              Volver
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-serif font-bold transition-all hover:brightness-110 disabled:opacity-50"
              style={{
                background: "linear-gradient(160deg, #d4a017, #a87828)",
                clipPath: CLIP_BTN,
                color: "#07080c",
              }}
            >
              {loading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}

      {/* Logout link */}
      <div className="flex justify-center">
        <button
          onClick={() => signOut({ redirectTo: "/login" })}
          className="flex items-center gap-1.5 text-[10px] font-serif uppercase tracking-[0.2em] transition-colors hover:text-[#d4a017]/70"
          style={{ color: "rgba(136,153,170,0.35)" }}
        >
          <LogOut size={10} />
          Salir
        </button>
      </div>

    </div>
  );
}
