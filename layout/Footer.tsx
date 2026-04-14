export default function Footer() {
  return (
    <footer
      className="border-t border-[rgba(160,125,55,0.22)] px-8 py-4 flex items-center justify-between shrink-0"
      style={{ background: "linear-gradient(180deg, #0f0e0d 0%, #0c0b0a 100%)" }}
    >
      <p className="font-serif text-[11px] uppercase tracking-widest text-[rgba(160,125,55,0.45)]">
        Visor Académico · ECEA 2026
      </p>
      <a
        href="https://m-estrada.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 font-serif text-sm text-[rgba(160,125,55,0.55)] hover:text-[rgba(232,224,208,0.85)] transition-colors"
      >
        <span>Diseñado y desarrollado por</span>
        <span className="font-semibold text-[#c8a84b] group-hover:text-[#d4b45a] transition-colors underline underline-offset-2 decoration-[rgba(200,168,75,0.35)] group-hover:decoration-[rgba(200,168,75,0.7)]">
          Manuel Estrada
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[rgba(200,168,75,0.45)] group-hover:text-[#c8a84b] transition-colors"
        >
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      </a>
    </footer>
  );
}
