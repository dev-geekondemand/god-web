"use client";

import Image from "next/image";
import React from "react";
import Chat from "./Chat";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";

const Genie = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.seeker.isAuthenticated);

  const handleClick=()=>{
    if(isAuthenticated){
      setIsOpen(true);
    }else{
      toast.dismiss();
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Not Logged in as a Seeker."
          message="Login as a Seeker to start a conversation."
          avatar="/assets/logo-big.webp"
        />
      ));
    }
  }

  return (
    <>
      {/* Floating Genie Button */}
      {!isOpen && (
        <div className="fixed bottom-25 right-6  z-50 group floating">
          <button
            onClick={handleClick}
            className="rounded-full flex items-center justify-center"
          >
            <Image
              src="/assets/icons/genie-logo.png"
              width={100}
              height={100}
              alt="AI Genie"
            />
          </button>

          {/* Hover Tooltip */}
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 mb-2  transition bg-black text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
            Chat with Geek Genie ✨
          </div>
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
