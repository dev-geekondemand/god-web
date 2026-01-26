"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { getCategories } from '@/features/category/categorySlice';
import { useAppDispatch } from '@/lib/hooks';
import { Category } from '@/interfaces/Category';
import GlobalSkeleton from './Sekeletn';


const Categories = () => {
  // Initial state to control the number of categories shown
  const [showAll, setShowAll] = useState(false);
    const [displayCategories, setDisplayCategories] = useState<Category[]>([]);
  
  const dispatch = useAppDispatch();

  useEffect(()=>{
    dispatch(getCategories());
  },[dispatch])

  const catState = useSelector((state:RootState) => state.category?.categories) as Category[];
  const isCatLoading = useSelector((state:RootState) => state.category?.isPending);
  
  // Limit to the first 12 categories
  const azureLoader = ({ src }:{src:string}) => src;

  useEffect(()=>{
    if (typeof window === "undefined") return;
    if(showAll){
      setDisplayCategories(catState);
    }else{
      if(window?.innerWidth < 786){
        const slicedCategories = catState.slice(0,6);
        setDisplayCategories(slicedCategories);
      }else if(window?.innerWidth > 786 && window?.innerWidth < 1024){
        const slicedCategories = catState.slice(0,9);
        setDisplayCategories(slicedCategories);
      }else if(window?.innerWidth > 1280){
        const slicedCategories = catState.slice(0,10);
        setDisplayCategories(slicedCategories);
      }
    }
  },[showAll, catState]);



  return (
    <div className='w-full p-3 bg-gray-50 flex justify-center'>
        <div className='max-w-6xl w-full mx-auto'>
       <div className='flex w-full'>
        <div className='flex flex-col gap-5 w-full'>
            <div className='py-5 flex flex-col gap-4'>
                <h1 className='h2 text-center text-gray-600'>One Platform. <span className='text-teal-700'>All IT Tech Needs.</span></h1>
                <p className="text-xs font-bold text-gray-700 text-center max-w-2xl mx-auto">From laptop repairs to cloud solutions — find the right geek for every tech challenge.</p>

            </div>
            {isCatLoading ? <GlobalSkeleton cards={8} cols={2} lgCols={4} /> : <div className='grid lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-9 gap-3'>
            {displayCategories?.map((c) => (
                <div  className="border border-white bg-white group relative shadow-sm hover:border min-h-[160px] hover:border-teal-500 transition transform duration-200 cursor-pointer rounded-lg flex py-2 px-4" key={c._id}>
                    <div className="flex flex-col items-center w-full">
                        <Image className='mb-4 mt-3' src={c.smallBanner?.url} alt='Category Image' width={50} height={50} loader={azureLoader} />
                        {/* <Image src={c.Banner} alt='Category Banner' width={60} height={40} /> */}
                        <p className='text-xs text-center font-bold text-gray-800'>{c.title}</p>
                       
                        <span className='font-normal block text-gray-700 group-hover:hidden text-xs mt-2 transition transform duration-200'>{c.totalGeeks}+ Listings</span>
                        <Link href={`/categories/${c._id}/brands`} className='hidden mt-2 transition transform duration-200 group-hover:flex text-xs underline text-teal-600'>View All</Link>

                      
                    </div>
                </div>
            ))}
            </div>}

            {/* "View All" Button */}
            {!showAll && catState.length > 12 && (
                <div className='w-full flex justify-center '>
                    <button 
                    onClick={() => setShowAll(true)} 
                    className="mt-4 flex items-center cursor-pointer gap-1 w-fit px-6 py-2 bg-teal-700 text-base text-white rounded-md"
                    >
                        View All 
                        
                    </button>
                </div>
            )}

            {/* "View Less" Button (if showing all, user can toggle back) */}
            {showAll && (
                 <div className='w-full flex justify-center '>
                    <button 
                    onClick={() => setShowAll(false)} 
                    className="mt-4 flex items-center cursor-pointer gap-1 w-fit px-6 py-2 bg-teal-700 text-sm text-white rounded-md"
                    >
                        View Less
                        
                    </button>
                </div>
            )}
            </div>
       </div>
    </div>
    </div>
  );
};

export default Categories;
