import { auth } from "@/auth";
import { getVisibleCourseIds } from "@/lib/supabase/courses";
import { getDistinctionsForStudentByCourses } from "@/lib/supabase/teacher";
import { ALL_DISTINCTIONS, EarnedBadge } from "@/distinciones/types";
import BadgesGrid from "@/distinciones/components/BadgesGrid";

export default async function DistincionesPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const visibleIds = await getVisibleCourseIds();
  const grants = await getDistinctionsForStudentByCourses(email, visibleIds);

  const earnedIds = new Set(grants.map((g) => g.distinction_id));

  const earned: EarnedBadge[] = grants
    .map((g) => {
      const def = ALL_DISTINCTIONS.find((d) => d.id === g.distinction_id);
      if (!def) return null;
      return {
        ...def,
        earnedAt: new Date(g.granted_at),
        grantedBy: g.granted_by,
      };
    })
    .filter((b): b is EarnedBadge => b !== null);

  const locked = ALL_DISTINCTIONS.filter((d) => !earnedIds.has(d.id));

  return (
    <div className="w-full px-6 py-6 flex flex-col gap-8">
      <div className="text-center">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60">
          ◆ Logros del Gremio ◆
        </p>
        <h1 className="font-serif text-3xl text-cream">
          Distinciones
        </h1>
        <div className="mt-3 gold-divider w-28 mx-auto mb-3" />
        <p className="text-sm text-sage max-w-lg mx-auto">
          Insignias obtenidas a lo largo de tu recorrido. Cada distinción refleja un patrón de constancia, calidad o participación sostenida.
        </p>
      </div>

      <BadgesGrid earned={earned} locked={locked} />
    </div>
  );
}
