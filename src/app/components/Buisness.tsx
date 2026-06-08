"use client"
import Image from 'next/image'
// import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'


const Buisness = () => {
  const router = useRouter();
  // const videoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (videoRef.current) {
  //       const videoPosition = videoRef.current.getBoundingClientRect().top;
  //       const screenHeight = window.innerHeight;
  //       if (videoPosition <= screenHeight * 0.7) {
  //         (videoRef.current as HTMLVideoElement).play();
  //       }else{
  //         (videoRef.current as HTMLVideoElement).pause();
  //       }
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);


  return (
    <section className='max-w-7xl mx-5 md:mx-auto rounded-3xl mb-10 flex items-center justify-center relative z-1 p-4 bg-yellow-500/20'>
        <div className='w-full max-w-7xl mx-auto grid grid-cols-12 justify-center items-center'>
          <div className='md:col-span-5 col-span-12 p-6 gap-5 flex text-white flex-col items-start justify-center'>
              <h2 className="h2 text-gray-700">Earn as a Freelance IT Expert — Join 380+ Geeks on <span className='colored'>GeekOnDemand</span></h2>
              <p className="text-gray-900 font-medium text-xs">Are you an IT professional, hardware engineer, or tech enthusiast? Join our growing network of 380+ verified Geeks. Choose your own hours, serve clients near you, and build a steady income on your terms.</p>
               <button
                    onClick={()=>{router.push('/register?type=geek')}}
                    className="flex text-xs  items-center text-nowrap tracking-wider cursor-pointer gap-1 w-fit px-8 py-2.5 bg-teal-700 md:text-lg text-white rounded-md"
                    >
                        Register as a Geek

                    </button>
          </div>
          <div className='md:col-span-7 col-span-12  md:col-start-6 gap-5 z-10 md:flex text-white flex-col items-start justify-center relative'>
            <Image src={"/assets/New-Img/buisness.jpeg"} alt='Earn as a freelance IT expert with GeekOnDemand in Hyderabad' width={600} height={400} className='w-full rounded-3xl' />
          </div>
        </div>
    </section>
)}


export default Buisness
