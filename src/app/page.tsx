"use client"

import Image from 'next/image.js';
import Categories from './components/Categories.tsx';
import FeaturedGeeks from './components/FeaturedGeeks.tsx';
import HeroSectionTen from './components/Hero.tsx'
import Reviews from './components/Reviews.tsx';
import BlogsSection from './components/BlogsSection.tsx';
import Buisness from './components/Buisness.tsx';
import { useEffect, useState } from 'react';
import Chat from './components/Chat.tsx';
import Genie from './components/Genie.tsx';
import { useSelector } from 'react-redux';
import Brand from '@/interfaces/Brand.ts';
import Marquee from 'react-fast-marquee';
import { useAppDispatch } from '@/lib/hooks.ts';
import { getBrands } from '@/features/brands/brandsSlice.ts';
import GlobalSkeleton from './components/Sekeletn.tsx';
import CtaBannerRow from './components/CtaBannerRow.tsx';
import InnerBannerAd from './components/InnerBannerAd.tsx';
import FAQSection from './components/FAQSection.tsx';



export default function Home() {

  const [openChat,setOpenChat] = useState(false);
  const [userType, setUserType] = useState("seeker");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }else{
      setUserType("");
    }
  }, []);

  useEffect(()=>{
    if(!brands.length){
      dispatch(getBrands());
    }
  },[])

  const brands = useSelector((state: any) => state.brand?.brands);

  return (
    <>
      <div>

        {/* Hero */}
        <HeroSectionTen />

        {/* 3-panel CTA banners: Book a Geek | centre photo | Become a Geek */}
        <CtaBannerRow />

        {/* All Categories */}
        <Categories />

        <div hidden={!openChat || userType !== "seeker"} className='fixed inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>
        {openChat && userType === "seeker" && (
          <div className='fixed h-[90vh] flex top-5 overflow-y-scroll custom-scrollbar bottom-5 right-0 left-0 items-center justify-center max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300'>
            <Chat isExpanded={openChat} setIsExpanded={setOpenChat} setOpenChat={setOpenChat} />
          </div>
        )}

        {/* Tech Support in 3 Simple Steps */}
        <section className='xxs:pt-4 xs:pt-6 sm:pt-8 max-w-7xl mx-auto grid grid-cols-12 xxs:p-2 xs:p-3 w-full justify-center gap-4 xs:gap-6 sm:gap-8 items-start'>
          <div className='col-span-4 h-full hidden lg:flex justify-center items-center'>
            <InnerBannerAd placement="home" medium_rectangle  />
          </div>
          <div className='max-w-5xl h-full col-span-12 lg:col-span-8 w-full flex flex-col justify-center items-center xxs:py-6 xs:py-8 sm:py-8 xxs:px-3 xs:px-4 sm:px-3 bg-amber-800/10 relative rounded-3xl'>

            <div className='flex flex-col text-white max-w-2xl items-center justify-center w-full mx-auto gap-2 xs:gap-3'>
              <h2 className="xxs:text-xl xs:text-2xl sm:text-3xl mmd:text-4xl font-bold text-center text-gray-600">
                How GeekOnDemand Works — Book IT Support in <span className='text-teal-700'>3 Easy Steps</span>
              </h2>
              <p className="xxs:text-[10px] xs:text-xs font-medium text-gray-700 text-center">
                From booking to resolution, getting expert IT Tech support has never been easier.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 w-full px-3'>

              <div className='flex w-full text-center text-black gap-3 justify-center items-center bg-white rounded-2xl py-6'>
                <div className='flex flex-col items-center justify-center text-center w-full'>
                  <div className='h-[50%] w-full flex items-center justify-center'>
                    <Image src={"/assets/images/search.jpeg"} className='mb-4 w-[80%] rounded-lg' alt='Finding a verified IT support Geek near you' width={200} height={70} />
                  </div>
                  <h4 className="text-xs font-bold">1. Find a Verified IT Expert Near You</h4>
                  <p className='text-[12px] max-w-[220px] font-medium'>
                    Browse verified Geeks by service type, location, and star ratings. Find the right expert for your laptop, printer, router or software issue.
                  </p>
                </div>
              </div>

              <div className='flex w-full text-black gap-3 justify-center items-center bg-white rounded-2xl py-6'>
                <div className='flex flex-col items-center justify-center text-center w-full'>
                 <div className='h-[50%] w-full flex items-center justify-center'>
                    <Image src={"/assets/images/book.jpeg"} className='mb-4 w-[80%] rounded-lg' alt='Booking a Geek for doorstep IT support' width={200} height={70} />
                  </div>
                  <h4 className="text-xs font-bold">2. Book Your Geek &amp; Get the Job Done</h4>
                  <p className='text-xs max-w-[220px] font-medium'>
                    Confirm your booking in seconds. Your Geek arrives at your home or office and resolves the issue on the spot — no waiting, no jargon.
                  </p>
                </div>
              </div>

              <div className='flex w-full text-center text-black gap-3 justify-center items-center bg-white rounded-2xl py-6'>
                <div className='flex flex-col items-center justify-center text-center w-full'>
                  <div className='h-[50%] w-full flex items-center justify-center'>
                    <Image src={"/assets/images/rate.jpeg"} className='mb-4 w-[80%] rounded-lg' alt='Rating and reviewing Geek service' width={200} height={70} />
                  </div>
                  <h4 className="text-xs font-bold">3. Rate Your Geek &amp; Help Others Choose</h4>
                  <p className='text-xs max-w-[220px] font-medium'>
                    Share your experience. Your rating keeps our Geek community accountable and helps other Seekers make confident decisions.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Brands Served */}
        <section className='dark:text-gray-200 w-full max-w-7xl mx-auto mt-10'>
          <div className='flex flex-col gap-2 max-w-7xl mb-8 relative justify-center items-center mx-auto'>
            <h2 className='h2 px-2 text-center'>Our Geeks Support These Leading Device Brands</h2>
            <p className="text-xs text-gray-600 text-center max-w-2xl">HP, Dell, Lenovo, Canon, Epson, D-Link, TP-Link, Quick Heal and more — certified support at your doorstep.</p>
            <span className="mt-1 inline-block text-xs font-semibold text-teal-700 border border-teal-300 bg-teal-50 px-3 py-1 rounded-full">
              Official Quick Heal Service Partner
            </span>
          </div>
          {brands?.length > 0 ? (
            <Marquee className='bg-gray-100 dark:bg-gray-900'>
              <div className='flex gap-16 p-6'>
                {brands?.map((brand: Brand) => (
                  <Image
                   
                    key={brand?._id}
                    width={100}
                    height={80}
                    className='object-contain'
                    src={brand?.image?.url ? brand?.image?.url : "/assets/images/plc.webp"}
                    alt={`${brand?.name || 'Brand'} logo`}
                  />
                ))}
              </div>
            </Marquee>
          ) : (
            <div className='w-full h-36 overflow-hidden'>
              <GlobalSkeleton cards={1} cols={1} lgCols={1} />
            </div>
          )}
        </section>

        {/* Brands text block — indexable by Google, complements logo carousel */}
        <div className='max-w-5xl mx-auto px-4 py-6 text-center'>
          <p className='text-xs text-gray-500 leading-relaxed'>
            <span className='font-semibold text-gray-700'>Brands We Repair &amp; Support:</span>{' '}
            HP, Dell, Lenovo, Acer, ASUS, Apple MacBook, Canon, Epson, Brother, D-Link, TP-Link, Netgear, Quick Heal, Kaspersky, Microsoft, Samsung, and more — doorstep service in Hyderabad.
          </p>
        </div>

        <div className='max-w-6xl mx-auto my-5'>
          <InnerBannerAd placement="home" wide_banner />
        </div>
        

        {/* Top Geeks */}
        <div className='w-full p-3 flex flex-col items-center justify-center'>
          <FeaturedGeeks />
        </div>

        {/* Testimonials */}
        <div className='w-full px-3'>
          <Reviews />
        </div>

        {/* Inner banner ad – second slot */}
          <div className='w-full max-w-[86rem]  mx-auto'>
        <InnerBannerAd placement="home" wide_banner />

          </div>
      </div>

      {/* FAQ */}
      {/* <FAQSection /> */}

      {/* Blogs */}
      <BlogsSection />

      {/* Grow Your Business */}
      <Buisness />

      <Genie />
    </>
  );
}
