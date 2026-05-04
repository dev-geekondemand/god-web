"use client";

import Image from "next/image";
import Link from "next/link";

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
            src="/assets/New-Img/Banner/image2.png"
            alt="Book a Geek"
            width={500}
            height={400}
            className="w-full min-h-[400px] object-cover rounded-lg"
          />
          <button className="text-sm bg-teal-700 rounded-xl text-white py-2 px-6  hover:bg-teal-800">
            Book a Geek
          </button>
        </Link>

        {/* Left CTA – Book a Geek */}
        <Link
          href="/categories"
          className="col-span-1 flex flex-col items-center gap-3 w-full "
        >
          <Image
            src="/assets/New-Img/Banner/image2.png"
            alt="Book a Geek"
            width={500}
            height={400}
            className="w-full min-h-[400px] object-cover rounded-lg"
          />
          <button className="text-sm bg-teal-700 rounded-xl text-white py-2 px-8  hover:bg-teal-800">
            Become a Geek
          </button>
        </Link>

        {/* Right CTA – Become a Geek */}
        <Link
          href="/register?type=geek"
          className="overflow-hidden  w-full h-[500px]"
        >
          <Image
            src="/assets/New-Img/Banner/Image2.png"
            alt="Become a Geek"
            width={500}
            height={400}
            className="w-full h-full object-cover"
          />
        </Link>

      </div>
    </section>
  );
};

export default CtaBannerRow;
