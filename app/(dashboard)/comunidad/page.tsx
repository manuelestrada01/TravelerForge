import { auth } from "@/auth";
import { getVisibleCourseIds, getCoursesByIds } from "@/lib/supabase/courses";
import { getCourseRanking } from "@/lib/supabase/comunidad";
import DashboardAnimatedWrapper from "@/dashboard/components/DashboardAnimatedWrapper";
import RankingList from "@/comunidad/components/RankingList";
import { DEMO_EMAIL, DEMO_RANKING } from "@/lib/demo/data";

export default async function ComunidadPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  if (email === DEMO_EMAIL) {
    return (
      <DashboardAnimatedWrapper>
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <header className="pb-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60 mb-1">
              ◆ 1 | Tecnología de la Representación ◆
            </p>
            <h1 className="font-serif text-4xl text-cream tracking-tight">
              Gremio del Conocimiento
            </h1>
            <div className="mt-3 gold-divider w-32 mx-auto" />
            <p className="mt-4 text-[16px] font-serif text-[rgba(160,125,55,0.5)] max-w-md mx-auto leading-relaxed">
              Ranking de resonancia del gremio. Solo XP y nivel son visibles — el recorrido de cada uno es personal.
            </p>
          </header>
          <RankingList entries={DEMO_RANKING} currentEmail={DEMO_EMAIL} />
        </div>
      </DashboardAnimatedWrapper>
    );
  }

  const visibleIds = await getVisibleCourseIds();
  const [ranking, courses] = await Promise.all([
    getCourseRanking(visibleIds),
    getCoursesByIds(visibleIds),
  ]);

  const courseName = courses[0]?.name ?? "Curso";

  return (
    <DashboardAnimatedWrapper>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <header className="pb-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60 mb-1">
            ◆ {courseName} ◆
          </p>
          <h1 className="font-serif text-4xl text-cream tracking-tight">
            Gremio del Conocimiento
          </h1>
          <div className="mt-3 gold-divider w-32 mx-auto" />
          <p className="mt-4 text-[16px] font-serif text-[rgba(160,125,55,0.5)] max-w-md mx-auto leading-relaxed">
            Ranking de resonancia del gremio. Solo XP y nivel son visibles — el recorrido de cada uno es personal.
          </p>
        </header>

        <RankingList entries={ranking} currentEmail={email} />
      </div>
    </DashboardAnimatedWrapper>
  );
}
