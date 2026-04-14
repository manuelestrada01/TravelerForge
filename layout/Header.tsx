"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";

interface CourseTab {
  id: string;
  name: string;
}

interface HeaderProps {
  courses: CourseTab[];
  studentName: string;
  studentImage?: string | null;
}

export default function Header({ courses, studentName, studentImage }: HeaderProps) {
  const searchParams = useSearchParams();
  const activeCourseId = searchParams.get("courseId") ?? courses[0]?.id ?? "";

  return (
    <header
      className="flex h-14 items-center justify-between px-5"
      style={{
        background: "linear-gradient(180deg, #141109 0%, #100e07 100%)",
        borderBottom: "1px solid rgba(160,125,55,0.22)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
        zIndex: 10,
        position: "relative",
      }}
    >
      {/* ── Left: brand + course tabs ── */}
      <div className="flex items-center gap-5">
        {/* Logo */}
        <div className="flex flex-col leading-none select-none">
          <span className="font-serif text-sm font-bold tracking-[0.06em] text-[#c8a84b] gold-glow-sm">
            LEVELUP
          </span>
          <span className="text-[7px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.45)]">
            Visor Académico
          </span>
        </div>

        {/* Vertical divider */}
        {courses.length > 0 && (
          <div className="h-5 w-px bg-gradient-to-b from-transparent via-[rgba(160,125,55,0.3)] to-transparent" />
        )}

        {/* Course tabs — straight edges, medieval */}
        <nav className="flex items-center gap-1">
          {courses.map(({ id, name }) => {
            const isActive = id === activeCourseId;
            return (
              <Link
                key={id}
                href={`/?courseId=${id}`}
                className={`relative px-3.5 py-1 text-[10px] font-serif font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
                  isActive
                    ? "text-[#1a1000] bg-[#c8a84b]"
                    : "text-[rgba(136,153,170,0.7)] hover:text-[rgba(232,224,208,0.85)] hover:bg-[rgba(200,168,75,0.06)]"
                }`}
                style={isActive ? {
                  boxShadow: "0 0 10px rgba(200,168,75,0.3)",
                } : {
                  border: "1px solid rgba(160,125,55,0.18)",
                }}
              >
                {name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Right: bell + avatar ── */}
      <div className="flex items-center gap-2">
        {/* Bell — square button */}
        <button
          className="relative flex h-7 w-7 items-center justify-center text-[rgba(136,153,170,0.5)] hover:text-[#c8a84b] hover:bg-[rgba(200,168,75,0.06)] transition-colors"
          style={{ border: "1px solid rgba(160,125,55,0.12)" }}
        >
          <Bell size={14} strokeWidth={1.4} />
        </button>

        {/* Avatar — square heraldic frame */}
        <div
          className="flex h-7 w-7 items-center justify-center overflow-hidden"
          style={{
            border: "1px solid rgba(160,125,55,0.4)",
            background: "rgba(160,125,55,0.1)",
          }}
        >
          {studentImage ? (
            <Image src={studentImage} alt={studentName} width={28} height={28} className="h-full w-full object-cover" />
          ) : (
            <span className="font-serif text-xs font-semibold text-[#c8a84b]">
              {studentName.charAt(0)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
