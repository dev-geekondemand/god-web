"use client";

export default function GlobalSkeleton({cards,cols,lgCols}:{cards:number,cols:number,lgCols:number}) {
  return (
    <div className="p-4 space-y-6 animate-pulse w-full">

      {/* Header */}
      <div className="h-12 bg-gray-200  md:hidden" />

      {/* Stat Cards */}
      <div className={`grid grid-cols-${cols} md:grid-cols-${lgCols} gap-6`}>
        {[...Array(cards)].map((_, i) => (
          <div
            key={i}
            className="h-30 bg-gray-200 -lg"
          />
        ))}
      </div>
    </div>
  );
}
