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

export default function Sidebar({ studentName, studentImage, level, formativeClassTitle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="group flex h-full w-16 hover:w-[220px] flex-shrink-0 flex-col bg-hud-base border-r border-hud-border transition-all duration-300 ease-in-out overflow-hidden">

      {/* Brand mark — only icon when collapsed */}
      <div className="flex h-14 items-center px-4 border-b border-hud-border flex-shrink-0">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center octagon bg-gold/20">
          <span className="text-gold text-xs font-bold font-serif">{level}</span>
        </div>
        <div className="ml-3 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <p className="text-[11px] font-semibold text-cream leading-tight truncate">{studentName}</p>
          <p className="text-[9px] uppercase tracking-widest text-sage truncate">{formativeClassTitle}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col py-3 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`relative flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? "text-gold bg-gold/[0.08]"
                  : "text-sage hover:text-cream hover:bg-hud-card/60"
              }`}
            >
              {/* Active left indicator */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-gold shadow-gold-glow-sm rounded-r-full" />
              )}
              <Icon
                size={18}
                strokeWidth={1.5}
                className="flex-shrink-0"
              />
              <span className="text-[11px] font-semibold uppercase tracking-widest truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Avatar + Logout */}
      <div className="border-t border-hud-border p-3 space-y-2">
        {/* Avatar mini */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/20 border border-gold/30 overflow-hidden">
            {studentImage ? (
              <Image src={studentImage} alt={studentName} width={32} height={32} className="h-full w-full object-cover" />
            ) : (
              <GraduationCap size={16} strokeWidth={1.5} className="text-gold" />
            )}
          </div>
          <p className="text-[10px] text-sage uppercase tracking-widest truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Nivel {level}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Cerrar sesión"
          className="flex w-full items-center gap-3 px-1 py-2 text-[11px] font-semibold uppercase tracking-widest text-sage transition-colors hover:text-danger rounded-sm"
        >
          <LogOut size={18} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
