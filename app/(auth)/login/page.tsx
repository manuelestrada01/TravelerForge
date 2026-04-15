import { signIn } from "@/auth";
import DemoButton from "./DemoButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

      {/* Corner ornaments */}
      <div className="pointer-events-none absolute top-6 left-8 text-[#d4a017]/20 text-sm font-serif">◆</div>
      <div className="pointer-events-none absolute top-6 right-8 text-[#d4a017]/20 text-sm font-serif">◆</div>
      <div className="pointer-events-none absolute bottom-6 left-8 text-[#d4a017]/15 text-sm font-serif">◇</div>
      <div className="pointer-events-none absolute bottom-6 right-8 text-[#d4a017]/15 text-sm font-serif">◇</div>

      {/* Top accent line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.35)] to-transparent" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Card */}
        <div className="chronicle-stone relative p-8 flex flex-col gap-0">

          {/* Corner diamond ornaments */}
          <span className="pointer-events-none absolute top-[4px] left-[4px] text-[7px] text-[rgba(160,125,55,0.25)] leading-none select-none">◆</span>
          <span className="pointer-events-none absolute top-[4px] right-[4px] text-[7px] text-[rgba(160,125,55,0.25)] leading-none select-none">◆</span>
          <span className="pointer-events-none absolute bottom-[4px] left-[4px] text-[7px] text-[rgba(160,125,55,0.25)] leading-none select-none">◆</span>
          <span className="pointer-events-none absolute bottom-[4px] right-[4px] text-[7px] text-[rgba(160,125,55,0.25)] leading-none select-none">◆</span>

          {/* Candlelight glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.05)_0%,transparent_55%)]" />

          {/* Header ornament */}
          <div className="relative flex flex-col items-center mb-7 gap-1.5" style={{ zIndex: 2 }}>
            <div className="flex items-center w-full gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.4)] to-transparent" />
              <span className="text-[rgba(160,125,55,0.4)] text-[10px] font-serif leading-none tracking-widest">✦ ✦ ✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.4)] to-transparent" />
            </div>

            {/* Logo icon */}
            <div
              className="my-3 w-14 h-14 flex items-center justify-center bg-[rgba(200,168,75,0.08)] border border-[rgba(160,125,55,0.3)]"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
              <span className="font-serif text-2xl font-bold text-[#c8a84b]" style={{ textShadow: "0 0 20px rgba(200,168,75,0.5)" }}>T</span>
            </div>

            <p className="font-serif text-3xl font-bold text-[rgba(232,224,208,0.92)] tracking-[0.04em]" style={{ textShadow: "0 0 30px rgba(200,168,75,0.2)" }}>
              TRAVELERFORGE
            </p>
            <p className="text-[13px] font-serif uppercase tracking-[0.3em] text-[rgba(160,125,55,0.5)]">
              Visor Académico
            </p>

            <div className="flex items-center w-full gap-3 mt-1">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
              <span className="text-[rgba(160,125,55,0.3)] text-[6px] font-serif leading-none">◆</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
            </div>
          </div>

          {/* Body */}
          <div className="relative flex flex-col gap-5" style={{ zIndex: 2 }}>
            <div className="text-center flex flex-col gap-1">
              <h2 className="font-serif text-lg text-[rgba(232,224,208,0.85)]">Ingresar al Visor</h2>
              <p className="text-[14px] font-serif text-[rgba(160,125,55,0.5)] leading-relaxed">
                Usá tu cuenta institucional Google para acceder a tu progreso académico.
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#c8a84b] hover:bg-[#e0bc5a] text-[#0c0d11] font-bold font-serif text-sm py-3 px-6 transition-all"
                style={{
                  clipPath: "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
                  boxShadow: "0 0 20px rgba(200,168,75,0.2)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#0c0d11" fillOpacity=".9"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#0c0d11" fillOpacity=".9"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#0c0d11" fillOpacity=".9"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#0c0d11" fillOpacity=".9"/>
                </svg>
                Continuar con Google
              </button>
            </form>

            <p className="text-center text-[14px] font-serif text-[rgba(160,125,55,0.35)] leading-relaxed">
              Solo cuentas <span className="text-[rgba(160,125,55,0.6)]">@fecea.edu.ar</span> tienen acceso al visor.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.2)] to-transparent" />
              <span className="text-[11px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.25)]">o</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.2)] to-transparent" />
            </div>

            <DemoButton />
          </div>

          {/* Bottom ornament */}
          <div className="relative flex items-center justify-center mt-7" style={{ zIndex: 2 }}>
            <span className="text-[rgba(160,125,55,0.2)] text-[10px] tracking-[0.4em] font-serif">◆ ◆ ◆</span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[11px] font-serif uppercase tracking-widest text-[rgba(160,125,55,0.25)]">
          Tecnología de la Representación · ECEA 2026
        </p>
      </div>
    </main>
  );
}
