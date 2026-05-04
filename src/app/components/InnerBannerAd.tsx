"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { getInnerAds, Ad } from "@/features/banners/bannersSlice";

// Standard ad sizes used across the site
export const AD_SIZES: Record<string, { width: number; height: number; label: string }> = {
  leaderboard:      { width: 728,  height: 90,  label: "Leaderboard (728×90)" },
  large_leaderboard:{ width: 970,  height: 90,  label: "Large Leaderboard (970×90)" },
  wide_banner:      { width: 1200, height: 250, label: "Wide Banner (1200×250)" },
  medium_rectangle: { width: 300,  height: 250, label: "Medium Rectangle (300×250)" },
  half_page:        { width: 300,  height: 600, label: "Half Page (300×600)" },
  mobile_banner:    { width: 320,  height: 50,  label: "Mobile Banner (320×50)" },
};

const PLACEHOLDER_SRC = "/assets/god-banner.png";

interface Props {
  placement: string;   // e.g. "home", "category", "profile", "blog"
  index?: number;      // which ad slot to show (0 = first, 1 = second, …)
  className?: string;
}

const InnerBannerAd = ({ placement, index = 0, className = "" }: Props) => {
  const dispatch = useAppDispatch();
  const innerAds = useSelector((state: RootState) => state.banners?.innerAds) as Ad[];

  const placementAds = innerAds?.filter((a) => a.placement === placement);

  useEffect(() => {
    // Only fetch when we don't yet have enough ads for this placement
    if (placementAds.length <= index) {
      dispatch(getInnerAds(placement));
    }
  }, [dispatch, placement, index]);

  const ad = placementAds?.[0];
  console.log(innerAds);
  

  const imgUrl   = ad?.image?.url || PLACEHOLDER_SRC;
  const link     = ad?.link;
  const w        = ad?.width  || 1200;
  const h        = ad?.height || 250;
  const azLoader = ({ src }: { src: string }) => src;

  const banner = (
    <div
      className={`relative w-full overflow-hidden   bg-gray-100 ${className}`}
      style={{ aspectRatio: `${w}/${h}` }}
    >
      <Image
        loader={ad ? azLoader : undefined}
        src={imgUrl}
        alt="Advertisement"
        width={1200}
        height={250}
        
        className="object-contain w-full h-full"
        // sizes="(max-width: 768px) 100vw, 1200px" 
      />
    </div>
  );

  return (
    <section className="w-full px-3 py-4 flex justify-center">
      <div className={`${index === 0 ? "max-w-5xl" : "max-w-7xl"} w-full ${className}`}>
        {link ? (
          <Link href={link} target="_blank" rel="noopener noreferrer">
            {banner}
          </Link>
        ) : (
          banner
        )}
      </div>
    </section>
  );
};

export default InnerBannerAd;
