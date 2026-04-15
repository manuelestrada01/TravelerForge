"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Sword, BookOpen, Users, Shield, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",                   label: "Inicio",    icon: LayoutDashboard },
  { href: "/misiones",           label: "Misiones",  icon: Sword },
  { href: "/laminas",            label: "Láminas",   icon: BookOpen },
  { href: "/comunidad",          label: "Comunidad", icon: Users },
  { href: "/clases-formativas",  label: "Clases",    icon: Shield },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16"
      style={{
        background: "linear-gradient(180deg, #141109 0%, #0e0c08 100%)",
        borderTop: "1px solid rgba(160,125,55,0.28)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.6)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-2 py-2 transition-colors"
          >
            <Icon
              size={19}
              strokeWidth={1.4}
              className={isActive ? "text-[#c8a84b]" : "text-[rgba(136,153,170,0.6)]"}
            />
            <span
              className={`text-[9px] font-serif uppercase tracking-[0.15em] ${
                isActive ? "text-[#c8a84b]" : "text-[rgba(136,153,170,0.5)]"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex flex-col items-center gap-1 px-2 py-2 transition-colors"
      >
        <LogOut size={19} strokeWidth={1.4} className="text-[rgba(136,153,170,0.6)]" />
        <span className="text-[9px] font-serif uppercase tracking-[0.15em] text-[rgba(136,153,170,0.5)]">
          Salir
        </span>
      </button>
    </nav>
  );
}
