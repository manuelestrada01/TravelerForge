import { auth } from "@/auth";
import { getProfile } from "@/lib/supabase/profiles";
import { getStudentGameStateByEmail, getDeliveriesByStudentEmail, getStrikesForStudentByCourses, type Strike } from "@/lib/supabase/game";
import { getTalentsForStudent } from "@/lib/supabase/teacher";
import { getVisibleCourseIds } from "@/lib/supabase/courses";
import { getFormativeClasses } from "@/lib/supabase/classes";
import { getLevelRange, XP_THRESHOLDS } from "@/xp/engine";
import HeroSection from "@/dashboard/components/HeroSection";
import ActivityFeed from "@/dashboard/components/ActivityFeed";
import VerseOfDay from "@/dashboard/components/VerseOfDay";
import DashboardAnimatedWrapper from "@/dashboard/components/DashboardAnimatedWrapper";
import SyncTrigger from "@/dashboard/components/SyncTrigger";
import StatusBar from "@/dashboard/components/StatusBar";
import TalentsCard from "@/talentos/components/TalentsCard";
import { ALL_TALENTS } from "@/talentos/types";
import { ActivityEntry } from "@/xp/types";
import {
  DEMO_EMAIL, DEMO_NAME, DEMO_CLASS,
  DEMO_XP, DEMO_LEVEL, DEMO_LEVEL_NAME,
  DEMO_XP_CURRENT_LEVEL, DEMO_XP_NEXT_LEVEL,
  DEMO_STRIKES, DEMO_BLOCKED, DEMO_TALENTS, DEMO_ACTIVITY, DEMO_STRIKE_DETAILS,
} from "@/lib/demo/data";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;
  const session = await auth();
  const email = session?.user?.email ?? "";
  const defaultName = session?.user?.name?.split(" ")[0] ?? "Estudiante";

  // Demo mode — return mock data directly, no Supabase/Classroom calls
  if (email === DEMO_EMAIL) {
    return (
      <DashboardAnimatedWrapper>
        <HeroSection
          studentName={DEMO_NAME.split(" ")[0]}
          classEntry={DEMO_CLASS}
          level={DEMO_LEVEL}
          levelName={DEMO_LEVEL_NAME}
          talents={DEMO_TALENTS}
        />
        <StatusBar
          xp={DEMO_XP}
          xpCurrentLevel={DEMO_XP_CURRENT_LEVEL}
          xpNextLevel={DEMO_XP_NEXT_LEVEL}
          level={DEMO_LEVEL}
          levelName={DEMO_LEVEL_NAME}
          studentName={DEMO_NAME.split(" ")[0]}
          blocked={DEMO_BLOCKED}
          strikes={DEMO_STRIKES}
          strikeDetails={DEMO_STRIKE_DETAILS}
        />
        <div className="grid grid-cols-3 gap-4 items-stretch">
          <ActivityFeed entries={DEMO_ACTIVITY} />
          <VerseOfDay />
          <TalentsCard talents={DEMO_TALENTS} />
        </div>
      </DashboardAnimatedWrapper>
    );
  }

  let studentName = defaultName;
  let formativeClassSlug = "erudito";
  let xp = 0;
  let xpCurrentLevel = 0;
  let xpNextLevel = 520;
  let level = 1;
  let levelName = "Iniciación";
  let nextLevelName = "Fundamentos";
  let strikes = 0;
  let blocked = false;
  let strikeDetails: Strike[] = [];
  let activity: ActivityEntry[] = [];
  let grantedTalentIds: string[] = [];

  if (email) {
    const [profile, allGameStates, deliveries, visibleIds] = await Promise.all([
      getProfile(email),
      getStudentGameStateByEmail(email),
      getDeliveriesByStudentEmail(email, 5),
      getVisibleCourseIds(),
    ]);

    const allStrikes = await getStrikesForStudentByCourses(email, visibleIds);
    strikeDetails = allStrikes.filter((s) => s.active);

    const visibleGameStates = allGameStates.filter((s) => visibleIds.includes(s.course_id));
    const gameStates = courseId
      ? visibleGameStates.filter((s) => s.course_id === courseId)
      : visibleGameStates;

    if (profile) {
      formativeClassSlug = profile.formative_class;
      studentName = profile.display_name ?? defaultName;
    }

    if (gameStates.length > 0) {
      const state = gameStates[0];
      xp = state.xp_total;
      level = state.level;
      strikes = strikeDetails.length;
      blocked = state.blocked;
      xpCurrentLevel = XP_THRESHOLDS[level - 1] ?? 0;
      xpNextLevel = XP_THRESHOLDS[level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
      const range = getLevelRange(level);
      levelName = range.title;
      nextLevelName = range.nextTitle;

      try {
        const talentGrants = await getTalentsForStudent(state.course_id, email);
        grantedTalentIds = talentGrants.map((t) => t.talent_id);
      } catch {
        // no talents yet
      }
    }

    activity = deliveries.map((d) => ({
      id: d.id,
      type: d.is_early ? ("xp_silent" as const) : ("xp_base" as const),
      description: `${d.tipo} entregada`,
      xpDelta: d.xp_base + d.xp_bonus,
      timestamp: d.submitted_at ? new Date(d.submitted_at) : new Date(d.synced_at),
      productionType: d.tipo as ActivityEntry["productionType"],
    }));
  }

  const [publishedClasses] = await Promise.all([getFormativeClasses(true)]);
  const activeClassEntry = publishedClasses.find((c) => c.slug === formativeClassSlug) ?? null;

  const talents = ALL_TALENTS.filter((t) => grantedTalentIds.includes(t.id));

  return (
    <DashboardAnimatedWrapper>
      <SyncTrigger />
      <HeroSection
        studentName={studentName}
        classEntry={activeClassEntry}
        level={level}
        levelName={levelName}
        talents={talents}
      />

      <StatusBar
        xp={xp}
        xpCurrentLevel={xpCurrentLevel}
        xpNextLevel={xpNextLevel}
        level={level}
        levelName={levelName}
        studentName={studentName}
        blocked={blocked}
        strikes={strikes}
        strikeDetails={strikeDetails}
      />

      <div className="grid grid-cols-3 gap-4 items-stretch">
        <ActivityFeed entries={activity} />
        <VerseOfDay />
        <TalentsCard talents={talents} />
      </div>
    </DashboardAnimatedWrapper>
  );
}
