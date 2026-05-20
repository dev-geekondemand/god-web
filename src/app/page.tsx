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
        <section className='pt-8 max-w-7xl mx-auto grid grid-cols-12 p-3 w-full  justify-center gap-8 items-start'>
          <div className='col-span-4 h-full hidden lg:flex justify-center items-center'>
            <InnerBannerAd placement="home" medium_rectangle  />

          </div>
          <div className='max-w-5xl h-full col-span-12 lg:col-span-8 w-full flex flex-col justify-center items-center py-12 sm:px-10 px-4 bg-amber-800/10 relative rounded-3xl'>
            
            <div className='flex flex-col text-white max-w-2xl items-center justify-center w-full mx-auto gap-3'>
              <h1 className="text-4xl font-bold text-center text-gray-600">
                Tech Support in <span className='text-teal-700'>3 Simple Steps</span>
              </h1>
              <p className="text-xs font-medium text-gray-700 text-center">
                From booking to resolution, getting expert IT Tech support has never been easier.
              </p>
            </div>

            <div className='flex lg:flex-row flex-col mt-12 gap-6 justify-center items-between w-full'>

              <div className='flex w-full text-center text-black gap-3 justify-center items-center bg-white rounded-2xl py-6'>
                <div className='flex flex-col items-center justify-center text-center w-full'>
                  <div className='h-[50%] w-full flex items-center justify-center'>
                    <Image src={"/assets/images/search.jpeg"} className='mb-4 w-[80%] rounded-lg' alt='Work-01' width={200} height={70} />
                  </div>
                  <h4 className="text-xs font-bold">1. Search for Geeks.</h4>
                  <p className='text-xs max-w-[220px] font-medium'>
                    Search for IT Tech Support Geeks near your location that best fit your needs.
                  </p>
                </div>
              </div>

              <div className='flex w-full text-black gap-3 justify-center items-center bg-white rounded-2xl py-6'>
                <div className='flex flex-col items-center justify-center text-center w-full'>
                 <div className='h-[50%] w-full flex items-center justify-center'>
                    <Image src={"/assets/images/book.jpeg"} className='mb-4 w-[80%] rounded-lg' alt='Work-02' width={200} height={70} />
                  </div>
                  <h4 className="text-xs font-bold">2. Getting Booked & Job done.</h4>
                  <p className='text-xs max-w-[220px] font-medium'>
                    Once you find a Geek that best fits your needs, get booked and get your job done.
                  </p>
                </div>
              </div>

              <div className='flex w-full text-center text-black gap-3 justify-center items-center bg-white rounded-2xl py-6'>
                <div className='flex flex-col items-center justify-center text-center w-full'>
                  <div className='h-[50%] w-full flex items-center justify-center'>
                    <Image src={"/assets/images/rate.jpeg"} className='mb-4 w-[80%] rounded-lg' alt='Work-03' width={200} height={70} />
                  </div>
                  <h4 className="text-xs font-bold">3. Rate and Review the service.</h4>
                  <p className='text-xs max-w-[220px] font-medium'>
                    After your job is complete, you can rate and review the Geeks according to your experience so that others can know about them.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Brands Served */}
        <section className='dark:text-gray-200 w-full max-w-7xl mx-auto mt-10'>
          <div className='flex flex-col gap-5 max-w-7xl mb-12 relative justify-center items-center mx-auto'>
            <h1 className='h2'>Brands Served by our Geeks</h1>
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
                    alt="brand image"
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

      {/* Blogs */}
      <BlogsSection />

      {/* Grow Your Business */}
      <Buisness />

      <Genie />
    </>
  );
}
