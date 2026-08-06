"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Chat from "./Chat";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Genie = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.seeker.isAuthenticated);

  const handleClick=()=>{
    if(isAuthenticated){
      setIsOpen(true);
    }else{
      setShowLoginPrompt((prev) => !prev);
    }
  }

  return (
    <>
      {/* Floating Genie Button */}
      {!isOpen && (
        <div className="fixed bottom-25 lg:right-16 right-6  z-50 group floating">
          <button
            onClick={handleClick}
            className="rounded-full flex items-center justify-center"
          >
            <Image
              src="/assets/icons/genie-logo.png"
              width={100}
              height={100}
              alt="AI Genie"
              style={{ height: 'auto' }}
            />
          </button>

          {/* Hover Tooltip */}
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 mb-2  transition flex justify-center bg-black text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
            GeekGenie <span className="hidden lg:block">— Your AI IT Assistant ✨</span>
          </div>

          {/* Login Prompt Popup (shown right at the Genie button for logged-out users) */}
          {showLoginPrompt && (
            <div className="absolute bottom-full right-0 mb-4 w-[88vw] max-w-72 sm:max-w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="absolute cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-start gap-3">
                <Image
                  src="/assets/icons/genie-logo.png"
                  width={36}
                  height={36}
                  alt="GeekGenie"
                  className="rounded-full flex-shrink-0"
                  style={{ height: "36px" }}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    Meet GeekGenie 🤖
                  </p>
                  <p className="mt-1 text-xs text-gray-500 leading-snug">
                    Your AI-powered IT assistant from GeekOnDemand. Describe
                    your IT issue in simple words, and GeekGenie will guide
                    you with the right solution or connect you to a verified
                    Geek when needed.
                  </p>
                </div>
              </div>

              <Link
                href="/login/seeker"
                className="mt-3 block w-full text-center bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg py-2 transition-colors"
              >
                Login to Chat
              </Link>

              {/* Arrow pointing to the Genie button */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45" />
            </div>
          )}
        </div>
      )}

      {/* Backdrop (only when expanded) */}
      {isOpen && isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300
          ${
            isExpanded
              ? "inset-0 flex items-center justify-center"
              : "bottom-10 sm:right-6 right-0"
          }`}
        >
          <div
            className={`bg-white shadow-2xl rounded-xl overflow-hidden
            ${
              isExpanded
                ? "w-[620px] h-[98vh]"
                : "w-[360px] h-[520px]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Chat
              setOpenChat={setIsOpen}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Genie;
