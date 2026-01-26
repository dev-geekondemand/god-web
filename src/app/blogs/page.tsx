"use client"

import { getAllBlogs } from '@/features/blogs/blogSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import Blog from '@/utils/Blog';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import GlobalSkeleton from '../components/Sekeletn';

const Blogs = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);


    const blogs = useSelector((state: RootState) => state.blog?.blogs) as Blog[];
    const isLoading = useSelector((state:RootState)=>state.blog?.isLoading)
const azureLoader = ({ src }:{src:string}) => src;
    

  return (
    <section className='w-full flex flex-col justify-center items-center bg-gray-50'>
        <div className='w-full relative breadcrumb-bg-2 '>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-gray-100'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>Blogs</h2>
                            <div className='flex gap-2 items-center'>
                            <Link href="/" className='cursor-pointer'>
                        <svg className='w-4 h-4 ' 
                        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         stroke="#009689"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                         <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                         <g id="SVGRepo_iconCarrier"> 
                          <path d="M22 22L2 22" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M4 22V9.5" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M20 22V9.5" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#009689" strokeWidth="1.5"></path> 
                          </g>
                          </svg>
                        </Link>

                                <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                                </svg>
                                <p className=' text-gray-600'>Blogs</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
        </div>

        <div className='w-full flex flex-col gap-6 justify-center items-center py-20 px-3'>
           {isLoading ?<GlobalSkeleton cards={9} cols={1} lgCols={3} /> :  <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-x-8 gap-y-16 max-w-7xl '>

            {blogs && blogs?.map((blog,index)=>(
                <Link href={`/blogs/${blog?.slug}`} key={index} className='bg-white border-none p-0 shadow  rounded-md'>
                    <div className="flex flex-col group gap-2 items-start justify-start h-fit">
                        <div className=' w-full h-[240px] relative rounded-t-md overflow-hidden'>
                        <Image loader={azureLoader}  objectFit="cover" src={blog?.coverImage?.url} alt='Blog Image' className='object-cover rounded-t-md group-hover:scale-110 transition transform duration-500' layout='fill' />
                        </div>
                       <div className='px-5 py-4 flex flex-col gap-3 h-full w-full justify-end'>
                            {/* <div className='flex gap-3 items-center'>
                                    <button className={` cursor-pointer px-3 rounded-lg  text-teal-600  bg-purple-50   py-1 text-sm`}>Category</button>
                                </div> */}
                                
                                <div className='flex gap-2 text-gray-600 text-sm items-center'>
                                    <div className='w-7 relative h-7 rounded-full'>
                                        <Image src="/assets/logo-big.webp" className='rounded-full object-contain' layout='fill' alt='Blog Author Image' />
                                    </div>
                                    <p className=" ">{blog?.author}</p>
                                    <span>{new Date(blog?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                                </div>

                            <div className='flex flex-col gap-1'>
                                <h2 className="text-xl hover:text-teal-600 transition transform duration-300 cursor-pointer font-medium text-gray-800">{blog?.title}</h2>
                            </div>
                            <p className="body-2 text-gray-600">{blog?.summary}</p>

                            {/* <div className='w-full flex justify-start'>
                                <button className='bg-pink-600 px-4 py-2 text-white rounded-sm text-sm'>Read More</button>
                            </div> */}
                       </div>

                    
                    
                    </div>
                </Link>
            ))
                
            }




               

            </div>}
        </div>
    </section>
  )
}

export default Blogs;
