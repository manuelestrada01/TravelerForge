"use client";

import { signIn } from "next-auth/react";

export default function DemoButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("credentials", { redirectTo: "/" })}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-6 border border-[#d4a017]/30 text-[#d4a017]/70 hover:text-[#d4a017] hover:border-[#d4a017]/55 hover:bg-[#d4a017]/05 transition-all text-[11px] font-serif uppercase tracking-[0.25em]"
    >
      Ver Demo
    </button>
  );
}
