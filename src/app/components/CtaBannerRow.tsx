"use client";

import Image from "next/image";
import Link from "next/link";
import InnerBannerAd from "./InnerBannerAd";

const CtaBannerRow = () => {
  return (
    <section className="w-full px-3 py-12  flex h-full justify-center">
      <div className="max-w-7xl  w-full grid grid-cols-1 sm:grid-cols-3 xxs:grid-cols-1 xs:grid-cols-2 gap-8">

        {/* Left CTA – Book a Geek */}
        <Link
          href="/categories"
          className="col-span-1 flex flex-col items-center gap-3 w-full h-full"
        >
          <div className="relative w-full flex-1 min-h-[200px] rounded-lg overflow-hidden">
            <Image
              src="/assets/New-Img/book_geek.png"
              alt="Book a verified Geek for doorstep IT support in Hyderabad"
              fill
              className="object-contain sm:object-fill w-full rounded-lg"
            />
          </div>
          <button className="text-sm bg-teal-700 rounded-xl text-white py-2 px-6 hover:bg-teal-800">
            Book a Geek
          </button>
        </Link>

        <div className="col-span-1 xs:hidden sm:block flex flex-col items-center gap-3 w-full h-full">
          <InnerBannerAd placement="home" stretch={false} className="md:max-h-[76vh] object-contain" medium_rectangle />
        </div>

        {/* Right CTA – Become a Geek */}
        <Link
          href="/register?type=geek"
          className="col-span-1 flex flex-col items-center gap-3 w-full  h-full"
        >
          <div className="relative w-full flex-1 min-h-[200px] rounded-lg overflow-hidden">
          <Image
            src="/assets/New-Img/become_geek.png"
            alt="Earn as a freelance IT expert with GeekOnDemand"
            fill
            className="object-contain sm:object-fill rounded-lg w-full"
          />
          </div>
          <button className="text-sm bg-teal-700 rounded-xl text-white py-2 px-8 hover:bg-teal-800">
            Become a Geek
          </button>
        </Link>

        

      </div>
    </section>
  );
};

export default CtaBannerRow;
