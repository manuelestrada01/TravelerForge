"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Talent } from "@/talentos/types";
import { Plus, Minus } from "lucide-react";

interface Props {
  courseId: string;
  studentEmail: string;
  grantedTalentIds: string[];
  allTalents: Talent[];
}

export default function TalentGranter({ courseId, studentEmail, grantedTalentIds, allTalents }: Props) {
  const router = useRouter();
  const [granted, setGranted] = useState(new Set(grantedTalentIds));
  const [loading, setLoading] = useState<string | null>(null);

  async function toggle(talentId: string) {
    setLoading(talentId);
    const isGranted = granted.has(talentId);
    await fetch(`/api/students/${encodeURIComponent(studentEmail)}/talent`, {
      method: isGranted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, talent_id: talentId }),
    });
    setGranted((prev) => {
      const next = new Set(prev);
      if (isGranted) next.delete(talentId);
      else next.add(talentId);
      return next;
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {allTalents.map((talent) => {
        const isGranted = granted.has(talent.id);
        return (
          <button
            key={talent.id}
            onClick={() => toggle(talent.id)}
            disabled={loading === talent.id}
            className={`flex items-center justify-between border px-3 py-2 text-left text-xs transition-colors disabled:opacity-50 ${
              isGranted
                ? "border-[rgba(200,168,75,0.5)] bg-[rgba(200,168,75,0.1)] text-[rgba(200,168,75,0.95)]"
                : "border-[rgba(160,125,55,0.2)] bg-[rgba(160,125,55,0.03)] text-[rgba(232,224,208,0.45)] hover:border-[rgba(160,125,55,0.35)] hover:text-[rgba(232,224,208,0.7)]"
            }`}
          >
            <span>{talent.name}</span>
            {isGranted ? <Minus size={10} /> : <Plus size={10} />}
          </button>
        );
      })}
    </div>
  );
}
