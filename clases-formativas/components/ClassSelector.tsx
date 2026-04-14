"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

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

  // Suppress unused variable warning — email is passed from parent for future use
  void email;

  if (classes.length === 0) {
    return (
      <p className="text-center font-serif italic text-[rgba(160,125,55,0.45)] text-sm">
        No hay clases formativas disponibles por el momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const isSelected = selected === cls.slug;
          return (
            <button
              key={cls.slug}
              onClick={() => { setSelected(cls.slug); setConfirming(false); }}
              className="relative flex flex-col gap-3 p-5 text-left transition-all hover:brightness-110"
              style={{
                background: `${STONE_NOISE}, linear-gradient(170deg, ${isSelected ? "#1c1408" : "#121109"} 0%, #0c0b07 100%)`,
                border: `1px solid ${isSelected ? "rgba(160,125,55,0.52)" : "rgba(160,125,55,0.2)"}`,
                boxShadow: isSelected ? "0 0 24px rgba(200,168,75,0.08)" : "none",
              }}
            >
              {/* Inner frame */}
              <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.07)]" />

              <div className="relative">
                <p className={`font-serif text-base font-bold ${isSelected ? "text-[#c8a84b]" : "text-[rgba(232,224,208,0.85)]"}`}>
                  {cls.title}
                </p>
                <p className="text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.4)] mt-0.5">
                  {cls.inspiration}
                </p>
              </div>
              <p className="relative text-xs font-serif leading-relaxed text-[rgba(160,125,55,0.5)]">
                {cls.description}
              </p>
              <div className="relative flex gap-1.5 flex-wrap mt-1">
                {cls.attributes.map((attr) => (
                  <span
                    key={attr}
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.06)] px-2 py-0.5 text-[8px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Select CTA ── */}
      {selected && !confirming && (
        <div className="flex justify-center">
          <button
            onClick={() => setConfirming(true)}
            className="px-10 py-3 font-serif text-sm font-semibold text-[#1a1000] transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(160deg, #c8a84b, #a87828)",
              border: "1px solid rgba(200,168,75,0.7)",
              boxShadow: "0 0 14px rgba(200,168,75,0.2)",
            }}
          >
            Elegir {selectedClass?.title}
          </button>
        </div>
      )}

      {/* ── Confirmation panel ── */}
      {confirming && (
        <div
          className="relative flex flex-col items-center gap-4 p-6 text-center"
          style={{
            background: `${STONE_NOISE}, linear-gradient(170deg, #1a1408 0%, #120e07 100%)`,
            border: "1px solid rgba(160,125,55,0.38)",
          }}
        >
          <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.08)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,140,60,0.06)_0%,transparent_55%)]" />

          <p className="relative font-serif text-base text-[rgba(232,224,208,0.85)]">
            ¿Confirmás que tu clase es{" "}
            <span className="text-[#c8a84b] font-semibold">{selectedClass?.title}</span>?
          </p>
          <p className="relative text-xs font-serif italic text-[rgba(160,125,55,0.45)]">
            Esta decisión no se puede cambiar.
          </p>
          <div className="relative flex gap-3">
            <button
              onClick={() => setConfirming(false)}
              className="px-5 py-2.5 text-sm font-serif text-[rgba(160,125,55,0.6)] transition-colors hover:text-[rgba(200,168,75,0.9)]"
              style={{ border: "1px solid rgba(160,125,55,0.22)", background: "rgba(160,125,55,0.04)" }}
            >
              Volver
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-serif font-semibold text-[#1a1000] transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: "linear-gradient(160deg, #c8a84b, #a87828)", border: "1px solid rgba(200,168,75,0.6)" }}
            >
              {loading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
