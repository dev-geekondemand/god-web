"use client";

import { usePathChangeLoader } from "@/lib/usePathChangeLoader";

export default function GlobalLoader() {
  const { loading } = usePathChangeLoader();

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-teal-100 overflow-hidden">
      <div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-teal-500 to-teal-400"
        style={{ animation: "loader-sweep 0.85s ease-in-out infinite" }}
      />
    </div>
  );
}
