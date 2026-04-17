export default function ComunidadLoading() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 px-4 pt-4 md:px-8 md:pt-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 pb-6">
        <div className="h-3 w-48 bg-[rgba(160,125,55,0.1)] border border-[rgba(160,125,55,0.1)]" />
        <div className="h-10 w-72 bg-[rgba(160,125,55,0.1)] border border-[rgba(160,125,55,0.12)]" />
        <div className="h-px w-32 bg-[rgba(160,125,55,0.2)]" />
        <div className="h-4 w-80 bg-[rgba(160,125,55,0.07)]" />
        <div className="h-4 w-64 bg-[rgba(160,125,55,0.05)]" />
      </div>

      {/* Tu posición */}
      <div className="h-12 bg-[rgba(160,125,55,0.07)] border border-[rgba(160,125,55,0.15)] border-l-2 border-l-[rgba(160,125,55,0.3)]" />

      {/* Column headers */}
      <div className="grid grid-cols-[40px_1fr_90px] md:grid-cols-[44px_1fr_140px_80px_120px] gap-3 md:gap-4 px-4 md:px-5">
        {[40, 80, 60, 48, 64].map((w, i) => (
          <div
            key={i}
            className={`h-3 bg-[rgba(160,125,55,0.08)] ${i >= 2 && i <= 3 ? "hidden md:block" : ""}`}
            style={{ width: `${w}%` }}
          />
        ))}
      </div>

      {/* Ranking rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[40px_1fr_90px] md:grid-cols-[44px_1fr_140px_80px_120px] gap-3 md:gap-4 items-center px-4 md:px-5 py-3 md:py-3.5"
          style={{
            background: "linear-gradient(170deg, #0d0c08 0%, #090806 100%)",
            border: "1px solid rgba(160,125,55,0.12)",
            borderLeft: "2px solid rgba(160,125,55,0.15)",
          }}
        >
          {/* Position */}
          <div className="flex justify-center">
            <div className="h-5 w-6 bg-[rgba(160,125,55,0.1)]" />
          </div>
          {/* Student */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex-shrink-0 bg-[rgba(160,125,55,0.08)] border border-[rgba(160,125,55,0.15)]" />
            <div className="h-4 w-32 bg-[rgba(160,125,55,0.1)]" />
          </div>
          {/* Class */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[rgba(160,125,55,0.08)]" />
            <div className="h-3 w-16 bg-[rgba(160,125,55,0.08)]" />
          </div>
          {/* Level */}
          <div className="hidden md:block h-4 w-10 bg-[rgba(160,125,55,0.08)]" />
          {/* XP */}
          <div className="flex flex-col gap-1.5 items-end">
            <div className="h-4 w-16 bg-[rgba(160,125,55,0.1)]" />
            <div className="h-1 w-full bg-[rgba(160,125,55,0.07)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
