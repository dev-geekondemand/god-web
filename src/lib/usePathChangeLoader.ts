"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function usePathChangeLoader(minDuration = 300) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Route change START
    startTimeRef.current = Date.now();
    setLoading(true);

    return () => {
      // Route change END
      const elapsed = Date.now() - (startTimeRef.current ?? 0);
      const remaining = Math.max(minDuration - elapsed, 0);

      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, remaining);
    };
  }, [pathname, minDuration]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { loading, pathname };
}
