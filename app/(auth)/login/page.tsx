import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-hud-base flex items-center justify-center px-4 relative overflow-hidden scanlines">

      {/* Ambient gold radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full bg-gold/8 blur-[60px]" />
      </div>

      {/* Corner rune ornaments */}
      <div className="pointer-events-none absolute top-6 left-8 text-gold/20 text-sm">◆</div>
      <div className="pointer-events-none absolute top-6 right-8 text-gold/20 text-sm">◆</div>
      <div className="pointer-events-none absolute bottom-6 left-8 text-gold/15 text-sm">◇</div>
      <div className="pointer-events-none absolute bottom-6 right-8 text-gold/15 text-sm">◇</div>

      {/* Top line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-sm w-full">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 flex items-center justify-center bg-gold/10 border border-gold/30 mb-2"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          >
            <span className="font-serif text-2xl font-bold text-gold gold-glow">L</span>
          </div>
          <span className="font-serif text-4xl font-bold text-cream tracking-tight gold-glow-sm">
            LevelUp
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-sage/70">
            Visor Académico · ECEA 2026
          </span>
        </div>

        {/* Login card */}
        <div className="hud-panel rune-corners w-full p-8 flex flex-col gap-6 backdrop-blur-sm">
          {/* Top ornamental line */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-24 gold-divider" />

          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-xl text-cream">Ingresar al Visor</h2>
            <p className="text-xs text-sage leading-relaxed">
              Usá tu cuenta institucional Google para acceder a tu progreso académico.
            </p>
          </div>

          <div className="gold-divider w-full" />

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-gold hover:bg-gold/90 text-hud-base font-bold text-sm py-3 px-6 transition-all shadow-gold-glow"
              style={{ clipPath: "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))" }}
            >
              {/* Google icon */}
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#080d0a" fillOpacity=".8"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#080d0a" fillOpacity=".8"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#080d0a" fillOpacity=".8"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#080d0a" fillOpacity=".8"/>
              </svg>
              Continuar con Google
            </button>
          </form>

          <p className="text-[9px] text-sage/40 leading-relaxed">
            Solo cuentas <span className="text-sage/70">@fecea.edu.ar</span> tienen acceso al visor.
          </p>
        </div>

        {/* Footer */}
        <p className="text-[9px] text-sage/30 uppercase tracking-widest">
          Tecnología de la Representación · 2026
        </p>
      </div>
    </main>
  );
}
