"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Independence Day special popup — shows for 7 days after launch, once per browser session.
const CAMPAIGN_START = new Date("2026-08-14T00:00:00");
const CAMPAIGN_END = new Date("2026-08-21T23:59:59");
const SESSION_KEY = "iday_banner_seen";

const IndependenceDayPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const now = new Date();
    if (now < CAMPAIGN_START || now > CAMPAIGN_END) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    setShow(true);
  }, []);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-2xl sm:max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src="/assets/Independence_day_Banner.png"
            alt="Happy Independence Day — Meet Gigi x Geek Genie"
            width={1672}
            height={941}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default IndependenceDayPopup;
