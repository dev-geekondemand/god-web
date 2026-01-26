"use client"

import React, { useEffect, useRef } from "react";

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (dotRef.current) {
        dotRef.current.style.left = `${clientX}px`;
        dotRef.current.style.top = `${clientY}px`;
      }

      if (ringRef.current) {
        ringRef.current.animate(
          {
            left: `${clientX}px`,
            top: `${clientY}px`,
          },
          {
            duration: 150,
            fill: "forwards",
          }
        );
      }
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] w-12 h-12 border-2 border-teal-500 rounded-full -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] w-3.5 h-3.5 bg-teal-500 rounded-full -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

export default CustomCursor;