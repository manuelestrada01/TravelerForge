import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profiles";
import { getFormativeClasses } from "@/lib/supabase/classes";
import ClassSelector from "@/clases-formativas/components/ClassSelector";
import { DEMO_EMAIL } from "@/lib/demo/data";

export default async function ElegirClasePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // Demo users have a predefined class — send them straight to dashboard
  if (session.user.email === DEMO_EMAIL) redirect("/");

  const profile = await getProfile(session.user.email);
  if (profile) redirect("/");

  const classes = await getFormativeClasses(true);

  return (
    <main className="min-h-screen bg-[#07080c] flex items-center justify-center px-4 py-16 relative overflow-hidden scanlines">

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-[#d4a017]/[0.05] blur-[120px] animate-void-breathe" />
        <div className="absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-[#00c9a7]/[0.03] blur-[100px] animate-void-breathe [animation-delay:2.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#d4a017]/[0.03] blur-[80px]" />
      </div>

      {/* Fine grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(rgba(212,160,23,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Corner ornaments */}
      <div className="pointer-events-none absolute top-6 left-8 text-[#d4a017]/20 text-sm">◆</div>
      <div className="pointer-events-none absolute top-6 right-8 text-[#d4a017]/20 text-sm">◆</div>
      <div className="pointer-events-none absolute bottom-6 left-8 text-[#d4a017]/15 text-sm">◇</div>
      <div className="pointer-events-none absolute bottom-6 right-8 text-[#d4a017]/15 text-sm">◇</div>

      {/* Top line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4a017]/50 font-serif">
            Bienvenido al Visor
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#f5f0e8] gold-glow-sm">
            Elegí tu Clase Formativa
          </h1>
          <div className="flex items-center gap-3 my-1">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4a017]/35" />
            <span className="text-[#d4a017]/30 text-[8px]">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4a017]/35" />
          </div>
          <p className="text-[13px] text-[#8899aa] max-w-md leading-relaxed">
            Esta elección define tu identidad en el visor. Refleja quién sos como estudiante.
            Solo podés elegir una vez.
          </p>
        </div>

        {/* Selector */}
        <ClassSelector email={session.user.email} classes={classes} />

      </div>
    </main>
  );
}
