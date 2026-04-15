export default function DashboardLoading() {
  return (
    <div className="w-full px-8 pt-8 pb-6 flex flex-col gap-6 animate-pulse">
      <div className="h-40 bg-[#131720]" />
      <div className="grid grid-cols-[3fr_1fr] gap-4">
        <div className="h-32 bg-[#131720]" />
        <div className="h-32 bg-[#131720]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-56 bg-[#131720]" />
        <div className="h-56 bg-[#131720]" />
        <div className="h-56 bg-[#131720]" />
      </div>
    </div>
  );
}
