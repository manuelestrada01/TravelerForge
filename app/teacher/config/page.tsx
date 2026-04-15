import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ResetClassesButton from "@/docente/components/ResetClassesButton";

export default async function ConfigMacroPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const { data: courses } = await supabase
    .from("courses")
    .select("id")
    .eq("teacher_email", email)
    .limit(1);

  if (!courses?.length) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-1 text-[10px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.5)]">✦ ✦ ✦</p>
        <h1 className="font-serif text-2xl text-[rgba(232,224,208,0.9)]">Configuración Macro</h1>
        <p className="mt-1 text-sm text-[rgba(160,125,55,0.6)]">Ajustes globales del sistema</p>
      </div>

      <section className="chronicle-stone relative p-6">
        <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[rgba(200,168,75,0.4)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[rgba(200,168,75,0.4)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[rgba(200,168,75,0.4)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[rgba(200,168,75,0.4)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-serif text-base uppercase tracking-[0.12em] text-[rgba(232,224,208,0.85)]">Clases Formativas</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
          </div>
          <p className="mb-6 text-sm text-[rgba(160,125,55,0.6)]">
            Reinicia las clases formativas de todos los alumnos del sistema para permitirles elegir
            una nueva al inicio de cada bimestre.
          </p>
          <ResetClassesButton />
        </div>
      </section>
    </div>
  );
}
