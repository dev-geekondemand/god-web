"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { getInnerAds, Ad } from "@/features/banners/bannersSlice";
import { url } from "@/utils/url";

export const AD_SIZES: Record<string, { width: number; height: number; label: string }> = {
  wide_banner:      { width: 2000, height: 400,  label: "Wide Banner (2000×400)" },
  medium_rectangle: { width: 900,  height: 1200, label: "Medium Rectangle (900×1200)" },
};

const SIZE_TOLERANCE = 100;

const PLACEHOLDER_SRC = "/assets/god-banner.png";

interface Props {
  placement: string;
  wide_banner?: boolean;
  medium_rectangle?: boolean;
  className?: string;
  stretch?: boolean;
  priority?: boolean;
}

type SizeKey = keyof typeof AD_SIZES;


function matchesSize(ad: Ad, sizeKey: SizeKey) {
  const { width, height } = AD_SIZES[sizeKey];
  return (
    ad.width  !== undefined && Math.abs(ad.width  - width)  <= SIZE_TOLERANCE &&
    ad.height !== undefined && Math.abs(ad.height - height) <= SIZE_TOLERANCE
  );
}

function AdSlot({ ad, sizeKey, className, stretch, priority }: { ad: Ad; sizeKey: SizeKey; className: string; stretch?: boolean; priority?: boolean }) {
  const { width: w, height: h } = AD_SIZES[sizeKey];
  const imgUrl = ad.image?.url || PLACEHOLDER_SRC;
  const link = ad.link ? `${url}ad/${ad._id}/click` : undefined;

  const banner = stretch ? (
    <div className={`relative w-full h-full overflow-hidden bg-gray-100 ${className}`}>
      <Image src={imgUrl} alt="Advertisement" fill priority={priority} className="object-cover" sizes="100vw" />
    </div>
  ) : (
    <div
      className={`relative w-full overflow-hidden bg-gray-100 ${className}`}
      style={{ aspectRatio: `${w}/${h}` }}
    >
      <Image src={imgUrl} alt="Advertisement" width={w} height={h} priority={priority} className="object-cover w-full h-full" />
    </div>
  );

  return (
    <div className={`w-full ${stretch ? "h-full" : ""}`}>
      {link ? (
        <Link href={link} target="_blank" rel="noopener noreferrer" className={stretch ? "block h-full" : ""}>
          {banner}
        </Link>
      ) : (
        banner
      )}
    </div>
  );
}

const InnerBannerAd = ({ placement, wide_banner, medium_rectangle, className = "", stretch, priority }: Props) => {
  const dispatch = useAppDispatch();
  const innerAds = useSelector((state: RootState) => state.banners?.innerAds) as Ad[];

  const placementAds = innerAds?.filter((a) => a.placement === placement) ?? [];

  useEffect(() => {
    dispatch(getInnerAds(placement));
  }, [dispatch, placement]);

  const enabledSizes: SizeKey[] = [
    ...(wide_banner      ? ["wide_banner"      as SizeKey] : []),
    ...(medium_rectangle ? ["medium_rectangle" as SizeKey] : []),
  ];

  if (enabledSizes.length === 0) return null;

  return (
    <section className={`w-full flex flex-col items-center gap-4 ${stretch ? "h-full" : ""}`}>
      {enabledSizes.map((sizeKey) =>
        placementAds
          .filter((ad) => matchesSize(ad, sizeKey))
          .map((ad) => (
            <AdSlot key={ad._id} ad={ad} sizeKey={sizeKey} className={className} stretch={stretch} priority={priority} />
          ))
      )}
    </section>
  );
};

export default InnerBannerAd;
