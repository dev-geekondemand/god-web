"use client";

import Image from "next/image";
import Link from "next/link";
import InnerBannerAd from "./InnerBannerAd";

const CtaBannerRow = () => {
  return (
    <section className="w-full px-3 py-4 flex h-full justify-center">
      <div className="max-w-7xl w-full items-start grid grid-cols-1 md:grid-cols-3 gap-8 md:min-h-[80vh] ">

        {/* Left CTA – Book a Geek */}
        <Link
          href="/categories"
          className="col-span-1 flex flex-col items-center gap-3 w-full "
        >
          <Image
            src="/assets/images/book_geek.png"
            alt="Book a Geek"
            width={500}
            height={400}
            className="w-full min-h-[250px] md:min-h-[400px] object-cover rounded-lg"
          />
          <button className="text-sm bg-teal-700 rounded-xl text-white py-2 px-6  hover:bg-teal-800">
            Book a Geek
          </button>
        </Link>

        {/* Left CTA – Book a Geek */}
        <Link
          href="/register?type=geek"
          className="col-span-1 flex flex-col items-center gap-3 w-full "
        >
          <Image
            src="/assets/images/become_geek.png"
            alt="Book a Geek"
            width={500}
            height={400}
            className="w-full min-h-[250px] md:min-h-[400px] object-cover rounded-lg"
          />
          <button className="text-sm bg-teal-700 rounded-xl text-white py-2 px-8  hover:bg-teal-800">
            Become a Geek
          </button>
        </Link>

        <InnerBannerAd placement="home" medium_rectangle />
        

      </div>
    </section>
  );
};

export default CtaBannerRow;
