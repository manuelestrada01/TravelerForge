"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Sword,
  BookOpen,
  Users,
  Shield,
  LogOut,
  GraduationCap,
} from "lucide-react";

interface SidebarProps {
  studentName: string;
  studentImage?: string | null;
  level: number;
  formativeClassTitle: string;
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/misiones", label: "Misiones", icon: Sword },
  { href: "/laminas", label: "Láminas", icon: BookOpen },
  { href: "/comunidad", label: "Comunidad", icon: Users },
  { href: "/clases-formativas", label: "Clases Formativas", icon: Shield },
];

// SVG stone noise for sidebar background
const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

export default function Sidebar({ studentName, studentImage, level, formativeClassTitle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="group hidden md:flex h-full w-16 hover:w-[220px] flex-shrink-0 flex-col transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        background: `${STONE_NOISE}, linear-gradient(180deg, #141109 0%, #0e0c08 100%)`,
        borderRight: "1px solid rgba(160,125,55,0.28)",
      }}
    >
      {/* ── Brand / identity strip ── */}
      <div
        className="flex h-14 items-center px-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(160,125,55,0.18)" }}
      >
        {/* Square heraldic level seal */}
        <div
          className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center"
          style={{
            background: "linear-gradient(160deg, #c8a84b 0%, #a07828 100%)",
            border: "1px solid rgba(200,168,75,0.6)",
          }}
        >
          <div className="pointer-events-none absolute inset-[2px] border border-[rgba(255,220,100,0.2)]" />
          <span className="text-[#1a1000] text-[11px] font-bold font-serif relative z-10">{level}</span>
        </div>

        <div className="ml-3 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <p className="text-[17px] font-serif font-semibold text-[rgba(232,224,208,0.92)] leading-tight truncate">
            {studentName}
          </p>
          <p className="text-[13px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.65)] truncate mt-0.5">
            {formativeClassTitle}
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-col py-2 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`relative flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? "text-[#c8a84b] bg-[rgba(200,168,75,0.06)]"
                  : "text-[rgba(136,153,170,0.7)] hover:text-[rgba(232,224,208,0.85)] hover:bg-[rgba(200,168,75,0.04)]"
              }`}
            >
              {/* Active left bar — straight edge, no border-radius */}
              {isActive && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{ background: "linear-gradient(180deg, transparent, #c8a84b 30%, #c8a84b 70%, transparent)" }}
                />
              )}
              <Icon size={17} strokeWidth={1.4} className="flex-shrink-0" />
              <span className="text-[10px] font-serif font-semibold uppercase tracking-[0.22em] truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Avatar + Logout ── */}
      <div
        className="p-3 space-y-1"
        style={{ borderTop: "1px solid rgba(160,125,55,0.18)" }}
      >
        {/* Avatar — square frame */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden"
            style={{
              border: "1px solid rgba(160,125,55,0.35)",
              background: "rgba(160,125,55,0.08)",
            }}
          >
            {studentImage ? (
              <Image src={studentImage} alt={studentName} width={32} height={32} className="h-full w-full object-cover" />
            ) : (
              <GraduationCap size={15} strokeWidth={1.4} className="text-[#c8a84b]" />
            )}
          </div>
          <p className="text-[9px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.45)] truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Nivel {level}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Cerrar sesión"
          className="flex w-full items-center gap-3 px-1 py-2 text-[10px] font-serif font-semibold uppercase tracking-[0.2em] text-[rgba(136,153,170,0.5)] transition-colors hover:text-danger"
        >
          <LogOut size={16} strokeWidth={1.4} className="flex-shrink-0" />
          <span className="truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
