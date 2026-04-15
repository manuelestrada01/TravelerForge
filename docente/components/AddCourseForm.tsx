"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { classroom_v1 } from "googleapis";

interface Props {
  availableCourses: classroom_v1.Schema$Course[];
}

export default function AddCourseForm({ availableCourses }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroom_id: selectedId, year: 1 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al agregar curso");
      }
      const course = await res.json();
      router.push(`/teacher/courses/${course.id}/setup`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="mb-1 block text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.6)]">
          Curso de Classroom
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          required
          className="w-full border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
          style={{ colorScheme: "dark" }}
        >
          <option value="" style={{ background: "#0c0d11" }}>Seleccioná un curso...</option>
          {availableCourses.map((c) => (
            <option key={c.id} value={c.id!} style={{ background: "#0c0d11" }}>
              {c.name} {c.section ? `— ${c.section}` : ""}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-[#c0392b]">{error}</p>}

      <button
        type="submit"
        disabled={loading || !selectedId}
        className="border border-[rgba(200,168,75,0.45)] bg-[rgba(200,168,75,0.1)] px-5 py-2 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(200,168,75,0.9)] transition-opacity hover:bg-[rgba(200,168,75,0.15)] disabled:opacity-40"
      >
        {loading ? "Registrando..." : "Registrar curso"}
      </button>
    </form>
  );
}
