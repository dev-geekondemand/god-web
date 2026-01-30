"use client"

import { getCategories } from '@/features/category/categorySlice'
import { Category } from '@/interfaces/Category'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import GlobalSkeleton from '../components/Sekeletn'

const Categories = () => {

    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(getCategories());
    },[dispatch])


    const categories = useSelector((state: RootState) => state.category?.categories) as Category[];
    const isLoading = useSelector((state:RootState) => state.category?.isPending);
    
    const azureLoader = ({ src }:{src:string}) => src;

  return (
    <section className='w-full flex flex-col justify-center items-center'>
        <div className='w-full relative breadcrumb-bg-2'>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>Service Categories</h2>
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
                            <p className=' text-gray-600'>Categories</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div className='w-full flex justify-center items-center px-3 py-10'>
            <div className='w-full flex justify-center items-center max-w-7xl mx-auto '>
                {isLoading ? <GlobalSkeleton cards={9} cols={1} lgCols={3} /> :<div className='w-full grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 justify-center items-center'>
                    {
                        categories?.map((c) => (
                            <Link href={`/categories/${c._id}/brands`} key={c._id} className='border border-gray-300 bg-white group relative shadow-xs hover:border cursor-pointer rounded-lg flex'>
                        
                        <div className="flex flex-col  rounded-t-md w-full items-start overflow-hidden">
                                <div className=' rounded-t-md relative overflow-hidden max-h-[500px] w-full'>
                                    <Image
                                    loader={azureLoader}
                                     width={340}
                                     height={180}
                                     className='object-cover flex items-center justify-center w-full rounded-t-md hover:scale-110 transition transform duration-500' src={c.image?.url} alt='Category Image' />
                                </div>                            
                               
                            <div className='w-full flex gap-2 justify-between items-center px-5 py-5'>
                                <div className='w-full flex items-center gap-4'>
                                <div className='bg-purple-200 rounded-full p-2'>
                                {c.smallBanner &&<Image loader={azureLoader} src={c.smallBanner?.url} alt='Category Banner' width={30} height={30} />}
                                </div>
                                <p className='text-sm text-start font-semibold text-gray-800'>{c.title?.length > 25 ? `${c.title?.slice(0, 25)}...` : c.title }</p>
                                </div>
                                <p className='flex gap-1  text-nowrap text-xs text-gray-700 items-center'>
                                    {c.totalGeeks} Geeks
                                </p>
                            </div>
                          
                    </div>
                    </Link>
                        ))
                    }
                </div>}
            </div>

        </div>
    </section>
  )
}

export default Categories
