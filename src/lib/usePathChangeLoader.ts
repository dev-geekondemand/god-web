"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function usePathChangeLoader(minDuration = 300) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => setLoading(false), minDuration);
    return () => clearTimeout(timer);
  }, [pathname, minDuration]);

  return { loading, pathname };
}
