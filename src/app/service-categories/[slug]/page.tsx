"use client"
// import ServiceCard from '@/app/components/ServiceCard'
import { categories } from '@/utils/categories'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const Service = () => {

    const slug = usePathname().split("/")[2];

    const curCategory = categories.find((category) => category.urlpath === slug);

    const router = useRouter();
    

  return (
    <section className='w-full flex flex-col justify-center items-center'>
        <div className='w-full relative breadcrumb-bg-2'>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>{curCategory?.category_name}</h2>
                            <div className='flex gap-2 items-center'>
                            <button onClick={()=>{router.push("/")}} className='cursor-pointer'>
                            <svg className='w-4 h-4 ' 
                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            stroke="#f708ab"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> 
                            <path d="M22 22L2 22" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                            <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                            <path d="M4 22V9.5" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                            <path d="M20 22V9.5" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                            <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ee0b8b" strokeWidth="1.5"></path> 
                            </g>
                            </svg>
                            </button>

                            <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                            </svg>
                            <Link href='/service-categories' className='cursor-pointer hover:text-teal-600 transition transform duration-300'>Categories</Link>
                            <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                            </svg>
                            <p className=' text-gray-600'>{curCategory?.category_name}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div className='w-full justify-center flex py-20 px-3'>
            <div className='max-w-6xl mx-auto flex flex-col gap-12 justify-center w-full'>
            {/* <ServiceCard  col={12 } />
            <ServiceCard  col={12 } />
            <ServiceCard  col={12 } /> */}
            </div>

        </div>
    </section>
  )
}

export default Service
