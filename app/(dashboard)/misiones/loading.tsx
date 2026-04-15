export default function MisionesLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 flex flex-col gap-8 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="h-3 w-24 bg-[#131720]" />
        <div className="h-10 w-72 bg-[#131720]" />
        <div className="h-px w-32 bg-[#131720]" />
      </div>
      <div className="h-20 bg-[#131720]" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-[#131720]" />
        ))}
      </div>
      <div className="h-48 bg-[#131720]" />
    </div>
  );
}
