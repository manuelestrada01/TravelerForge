"use client";

import { useState } from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";

interface Props {
  courseId?: string;
  label?: string;
}

export default function ResetClassesButton({ courseId, label }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/reset-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al reiniciar");
      setResult({ count: data.count });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setOpen(true); setResult(null); setError(null); }}
          className="flex items-center gap-2 border border-[rgba(200,168,75,0.4)] px-4 py-2 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(200,168,75,0.85)] transition-colors hover:bg-[rgba(200,168,75,0.08)]"
        >
          <RotateCcw size={13} />
          {label ?? "Reiniciar clases formativas"}
        </button>
        {result !== null && (
          <span className="text-xs text-[rgba(160,125,55,0.7)]">
            {result.count === 0
              ? "No había clases asignadas."
              : `${result.count} alumno${result.count !== 1 ? "s" : ""} reiniciado${result.count !== 1 ? "s" : ""}.`}
          </span>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="chronicle-stone relative w-full max-w-md p-6 shadow-2xl">
            <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />

            <div className="relative z-10">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-0 top-0 text-[rgba(160,125,55,0.5)] hover:text-[rgba(232,224,208,0.7)]"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[rgba(200,168,75,0.8)]" />
                <div>
                  <h2 className="font-serif text-base uppercase tracking-[0.1em] text-[rgba(232,224,208,0.9)]">
                    Reiniciar clases formativas
                  </h2>
                  <p className="mt-2 text-sm text-[rgba(160,125,55,0.65)]">
                    {courseId
                      ? "Esto eliminará la clase formativa activa de todos los alumnos de este curso. Cada alumno deberá elegir nuevamente."
                      : "Esto eliminará la clase formativa activa de todos los alumnos del sistema. Cada alumno deberá elegir nuevamente."}
                  </p>
                  <p className="mt-1 text-sm text-[rgba(160,125,55,0.5)]">
                    El historial de clases anteriores se conserva.
                  </p>
                </div>
              </div>

              {error && (
                <p className="mt-4 border border-[#c0392b]/30 bg-[#c0392b]/10 px-3 py-2 text-sm text-[#c0392b]">
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(160,125,55,0.55)] hover:text-[rgba(232,224,208,0.7)] disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex items-center gap-2 border border-[rgba(200,168,75,0.45)] bg-[rgba(200,168,75,0.12)] px-4 py-2 text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(200,168,75,0.9)] transition-opacity hover:bg-[rgba(200,168,75,0.18)] disabled:opacity-50"
                >
                  {loading ? (
                    <RotateCcw size={13} className="animate-spin" />
                  ) : (
                    <RotateCcw size={13} />
                  )}
                  Confirmar reinicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
