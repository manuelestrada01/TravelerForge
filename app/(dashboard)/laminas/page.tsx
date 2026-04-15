import { auth } from "@/auth";
import { getVisibleCourseIds, getCourseworkConfig } from "@/lib/supabase/courses";
import { getAllDeliveriesForStudentByCourses, getStrikesForStudentByCourses } from "@/lib/supabase/game";
import { getStudentGameStateByEmail } from "@/lib/supabase/game";
import LaminasList from "@/laminas/components/LaminasList";
import DashboardAnimatedWrapper from "@/dashboard/components/DashboardAnimatedWrapper";
import type { Lamina, LaminaStatus } from "@/laminas/types";
import { DEMO_EMAIL, DEMO_BIMESTRE, DEMO_LAMINAS } from "@/lib/demo/data";

function mapStatus(s: "OK" | "LATE" | "MISSING" | "PENDING"): LaminaStatus {
  if (s === "OK") return "entregada";
  if (s === "LATE") return "tardía";
  if (s === "PENDING") return "pendiente";
  return "no_entregada";
}

function PageShell({ bimestre, children }: { bimestre: string; children: React.ReactNode }) {
  return (
    <DashboardAnimatedWrapper>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <header className="pb-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60 mb-1">
            ◆ Registro de Producción · {bimestre} ◆
          </p>
          <h1 className="font-serif text-4xl text-cream tracking-tight">
            Láminas & Entregas
          </h1>
          <div className="mt-3 gold-divider w-32 mx-auto" />
        </header>
        {children}
      </div>
    </DashboardAnimatedWrapper>
  );
}

export default async function LaminasPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  if (email === DEMO_EMAIL) {
    return (
      <PageShell bimestre={DEMO_BIMESTRE}>
        <LaminasList laminas={DEMO_LAMINAS} activeBimestre={DEMO_BIMESTRE} />
      </PageShell>
    );
  }

  const visibleIds = await getVisibleCourseIds();

  const [deliveries, strikes, gameStates] = await Promise.all([
    getAllDeliveriesForStudentByCourses(email, visibleIds),
    getStrikesForStudentByCourses(email, visibleIds),
    getStudentGameStateByEmail(email),
  ]);

  const activeBimestre = gameStates.length > 0 ? gameStates[0].bimestre : "B1";

  const courseIds = [...new Set(deliveries.map((d) => d.course_id))];
  const configArrays = await Promise.all(courseIds.map((id) => getCourseworkConfig(id)));
  const nameMap = new Map<string, string>();
  for (const configs of configArrays) {
    for (const c of configs) {
      nameMap.set(c.classroom_coursework_id, c.name);
    }
  }

  const strikeSet = new Set(
    strikes
      .filter((s) => s.classroom_coursework_id !== null)
      .map((s) => s.classroom_coursework_id as string)
  );

  const laminas: Lamina[] = deliveries.map((d) => ({
    id: d.id,
    productionType: d.tipo,
    title: nameMap.get(d.classroom_coursework_id) ?? d.tipo,
    bimestre: d.bimestre,
    dueDate: d.due_at ? new Date(d.due_at) : null,
    submittedAt: d.submitted_at ? new Date(d.submitted_at) : undefined,
    status: mapStatus(d.status),
    xpEarned: d.xp_base + d.xp_bonus > 0 ? d.xp_base + d.xp_bonus : undefined,
    isEarly: d.is_early,
    strikeAdded: strikeSet.has(d.classroom_coursework_id),
  }));

  return (
    <PageShell bimestre={activeBimestre}>
      <LaminasList laminas={laminas} activeBimestre={activeBimestre} />
    </PageShell>
  );
}
