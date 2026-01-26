// components/GlobalLoader.tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { usePathChangeLoader } from "@/lib/usePathChangeLoader";

export default function GlobalLoader() {
  const overlayRef = useRef(null);
  const { loading, pathname } = usePathChangeLoader();

  useEffect(() => {
    if (loading) {
      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [loading]);

  // You can define route-specific loaders here
  const renderRouteLoader = () => {
    if (pathname.startsWith("/about")) {
      return <div className="text-white text-xl animate-pulse">Loading About Us...</div>;
    }

    if (pathname.startsWith("/dashboard")) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin"></div>
          <p className="text-white">Loading Dashboard...</p>
        </div>
      );
    }

    // Default loader
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 bg-white rounded-full animate-bounce" />
        <p className="text-white">Loading...</p>
      </div>
    );
  };

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-black opacity-0"
    >
      {renderRouteLoader()}
    </div>
  );
}
