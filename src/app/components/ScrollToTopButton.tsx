"use client"

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercent = (scrolled / height) * 100;
    setScrollY(scrolledPercent);
    setShowButton(scrolled > 100); // Only show after 100px scroll
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const strokeDashOffset=(((100 - scrollY) / 100) * 2 * Math.PI * 24).toString();
            

  return (
    <>

      

    <div
      className={`fixed bottom-6 right-6 z-50 transition-opacity ${
        showButton ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={scrollToTop}
        className="relative w-14 h-14 rounded-full bg-white  text-teal-600 shadow-lg flex items-center justify-center cursor-pointer group"
      >
        {/* Circular Progress Background */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="oklch(70.4% 0.14 182.503)"
            strokeWidth="4"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="#d1d5dc"
            strokeWidth="2"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={strokeDashOffset}
            strokeLinecap="round"
          />
        </svg>
        <ArrowUp className="text-teal-600 w-5 h-5 group-hover:scale-110 transition-transform" />
      </div>
    </div>
    </>
  );
};

export default ScrollToTopButton;
