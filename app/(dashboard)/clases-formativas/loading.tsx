export default function ClasesFormativasLoading() {
  return (
    <div className="px-6 py-8 animate-pulse">
      {/* Icon + header */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-[rgba(160,125,55,0.1)] border border-[rgba(160,125,55,0.15)]" />
        <div className="h-3 w-40 bg-[rgba(160,125,55,0.08)]" />
        <div className="h-8 w-52 bg-[rgba(160,125,55,0.12)] border border-[rgba(160,125,55,0.1)]" />
        <div className="h-px w-32 bg-[rgba(160,125,55,0.2)]" />
        <div className="h-4 w-64 bg-[rgba(160,125,55,0.07)]" />
        <div className="h-4 w-48 bg-[rgba(160,125,55,0.05)]" />
      </div>

      {/* "Tu clase activa" label */}
      <div className="flex justify-center mb-4">
        <div className="h-3 w-36 bg-[rgba(160,125,55,0.08)]" />
      </div>

      {/* Active class card */}
      <div className="max-w-lg mx-auto mb-8">
        <div
          className="p-6 flex flex-col gap-4"
          style={{
            background: "linear-gradient(170deg, #17130a 0%, #120f06 100%)",
            border: "1px solid rgba(200,168,75,0.28)",
            borderLeft: "2px solid rgba(200,168,75,0.5)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[rgba(160,125,55,0.1)] border border-[rgba(160,125,55,0.2)]" />
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="h-4 w-14 bg-[rgba(160,125,55,0.15)]" />
                <div className="h-4 w-20 bg-[rgba(160,125,55,0.1)]" />
              </div>
              <div className="h-7 w-36 bg-[rgba(160,125,55,0.15)]" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-[rgba(160,125,55,0.1)]" />
                <div className="h-5 w-12 bg-[rgba(160,125,55,0.1)]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full bg-[rgba(160,125,55,0.07)]" />
            <div className="h-3 w-5/6 bg-[rgba(160,125,55,0.07)]" />
            <div className="h-3 w-4/6 bg-[rgba(160,125,55,0.05)]" />
          </div>
          <div className="h-3 w-32 bg-[rgba(160,125,55,0.08)] self-end" />
        </div>
      </div>

      {/* "Todas las clases" label */}
      <div className="flex justify-center mb-4">
        <div className="h-3 w-28 bg-[rgba(160,125,55,0.08)]" />
      </div>

      {/* Grid of class cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-5 flex flex-col gap-3"
            style={{
              background: "linear-gradient(170deg, #0d0c08 0%, #090806 100%)",
              border: "1px solid rgba(160,125,55,0.15)",
              borderLeft: "2px solid rgba(160,125,55,0.18)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-[rgba(160,125,55,0.08)] border border-[rgba(160,125,55,0.15)]" />
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1.5">
                  <div className="h-4 w-12 bg-[rgba(160,125,55,0.1)]" />
                  <div className="h-4 w-10 bg-[rgba(160,125,55,0.08)]" />
                </div>
                <div className="h-5 w-24 bg-[rgba(160,125,55,0.12)]" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-full bg-[rgba(160,125,55,0.06)]" />
              <div className="h-3 w-5/6 bg-[rgba(160,125,55,0.06)]" />
              <div className="h-3 w-4/6 bg-[rgba(160,125,55,0.05)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
