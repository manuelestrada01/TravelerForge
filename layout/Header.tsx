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
      className="flex h-14 items-center justify-between border-b border-hud-border bg-hud-base/95 backdrop-blur-sm px-4"
      style={{ zIndex: 10, position: "relative" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-4">
        <span
          className="font-serif text-base font-semibold text-gold tracking-tight gold-glow-sm select-none"
        >
          Visor Académico
        </span>

        {/* Divider */}
        {courses.length > 0 && (
          <span className="h-4 w-px bg-hud-border" />
        )}

        {/* Course tabs — pill style */}
        <nav className="flex items-center gap-1">
          {courses.map(({ id, name }) => {
            const isActive = id === activeCourseId;
            return (
              <Link
                key={id}
                href={`/?courseId=${id}`}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-gold text-hud-base shadow-gold-glow-sm"
                    : "text-sage hover:text-cream hover:bg-hud-card"
                }`}
              >
                {name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button className="relative flex h-7 w-7 items-center justify-center rounded text-sage hover:text-gold hover:bg-hud-card transition-colors">
          <Bell size={15} strokeWidth={1.5} />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 border border-gold/40 overflow-hidden">
          {studentImage ? (
            <Image src={studentImage} alt={studentName} width={28} height={28} className="h-full w-full object-cover" />
          ) : (
            <span className="text-gold text-xs font-semibold font-serif">
              {studentName.charAt(0)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
