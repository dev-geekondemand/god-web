"use client"

import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import { popularJobs } from '@/utils/PopularJobs'
import Image from 'next/image';
import Link from 'next/link';

const PopularJobs = () => {
    const [showAll, setShowAll] = useState(false);
      
      // Limit to the first 12 categories
      const displayedJobs = showAll ? popularJobs : popularJobs.slice(0, 5);
  return (
 <section className='w-full flex justify-center p-3 bg-gray-100'>
       <div className='max-w-7xl w-full mx-auto py-20'>
           <div className='flex w-full'>
            <div className='flex flex-col gap-5 w-full'>
                <div className='py-5 flex flex-col gap-4'>
                    <h1 className='h2 text-center'>Our Featured <span className='colored'>Services</span></h1>
                    <p className="body-2 text-gray-700 text-center max-w-2xl mx-auto">Each listing is designed to be clear and concise, providing customers.</p>
    
                </div>

                <Swiper
                     breakpoints={{
                        300: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                          },
                        600: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        950: {
                          slidesPerView: 3,
                          spaceBetween: 30,
                        },
                        1200:{
                            slidesPerView: 3,
                            spaceBetween: 70,
                        }
                      }}
                    spaceBetween={30}
                    freeMode={true}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    modules={[FreeMode, Pagination]}
                    className="mySwiper w-full flex items-center justify-center"
                >
                    {displayedJobs.map((job) => (
                    <SwiperSlide key={job.GUID} className='border border-white bg-white group relative shadow-xs hover:border cursor-pointer rounded-lg flex'>
                        
                        <Link href={`/services/${job.GUID}`} className="flex flex-col rounded-t-md w-full items-start overflow-hidden">
                                <div className='w-[400px] h-[250px] rounded-t-md relative overflow-hidden'>
                                    <Image
                                     layout="fill"
                                     objectFit="cover"
                                     className='object-cover w-full rounded-t-md hover:scale-110 transition transform duration-500' src={"/assets/images/jobs/laptop-repair.webp"} alt='Category Image' />
                                    
                                </div>                            
                                {/* <Image src={c.Banner} alt='Category Banner' width={60} height={40} /> */}
                            <div className=' flex flex-col gap-2 items-start justify-center p-3'>
                                <p className='text-base text-start font-bold text-gray-800'>{job.jobtitle}</p>
                            
                                <p className='font-normal block text-gray-700 text-sm'>{job.category_name}</p>
                                <p className='flex gap-1 text-xs text-gray-700 items-center'>
                                    <Image src={"/assets/icons/location.svg"} width={15} height={15} alt='Location' />
                                    {job.jobtype}
                                </p>
                            </div>
                          
                    </Link>
                    </SwiperSlide>
                ))}
                </Swiper>
    
                {/* "View All" Button */}
                {!showAll && popularJobs.length > 12 && (
                    <div className='w-full flex justify-center '>
                        <button 
                        onClick={() => setShowAll(true)} 
                        className="mt-4 flex items-center cursor-pointer gap-1 w-fit px-6 py-2 bg-gray-900 text-sm text-white rounded-md"
                        >
                            View All 
                            <svg  height="12" strokeLinejoin="round" viewBox="0 0 16 16" width="12">
                                <path 
                                    fillRule="evenodd" 
                                    clipRule="evenodd" 
                                    d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z" 
                                    fill="currentColor">
                                </path>
                            </svg>
                        </button>
                    </div>
                )}
    
                {/* "View Less" Button (if showing all, user can toggle back) */}
                {showAll && (
                     <div className='w-full flex justify-center '>
                        <button 
                        onClick={() => setShowAll(false)} 
                        className="mt-4 flex items-center cursor-pointer gap-1 w-fit px-6 py-2 bg-gray-900 text-sm text-white rounded-md"
                        >
                            View Less
                            <svg height="12" strokeLinejoin="round" viewBox="0 0 16 16" width="12">
                                <path 
                                    fillRule="evenodd" 
                                    clipRule="evenodd" 
                                    d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z" 
                                    fill="currentColor">
                                </path>
                            </svg>
                        </button>
                    </div>
                )}
                </div>
           </div>
        </div>
 </section>
  )
}

export default PopularJobs
