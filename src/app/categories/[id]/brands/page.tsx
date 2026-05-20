"use client"

import GlobalSkeleton from '@/app/components/Sekeletn'
import {  getBrandsByCategory } from '@/features/brands/brandsSlice'
import Brand from '@/interfaces/Brand'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PageBanner from '@/app/components/PageBanner'

interface BrandsByCategory {
    count: number;
    category: {id: string, name: string};
    brands: Brand[];
}

const Brands = () => {
    const categoryId = useParams().id as string || "682af19ccd7ba362b7afbb02"; 

    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(getBrandsByCategory(categoryId));
    },[dispatch,categoryId])


    const brandState = useSelector((state: RootState) => state.brand?.brandsByCategory as BrandsByCategory);
    const isLoading = useSelector((state: RootState) => state.brand?.isLoading);
    const brands = brandState?.brands as Brand[];
    const category = brandState.category
    
    

  return (
    <section className='w-full flex flex-col justify-center items-center'>
        <PageBanner title={category?.name || 'Brands'} crumbs={[{ label: category?.name || 'Brands' }]} />

        <div className='w-full flex justify-center items-center px-3 py-20'>
            <div className='w-full flex justify-center items-center max-w-7xl mx-auto '>
                {isLoading ? <GlobalSkeleton cards={15} cols={3} lgCols={5} /> :<div className='w-full grid md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 sm:grid-cols-3 grid-cols-2 gap-10 justify-center items-center'>
                    {
                       brands?.length > 0  && brands?.map((c) => (
                            <Link href={`/categories/${category?.id}/brands/${c._id}`} key={c._id} className='border border-gray-300 h-42 w-full bg-white group relative p-2 shadow-xs hover:border cursor-pointer rounded-lg flex'>
                        
                        <div className="flex flex-col  rounded-t-md w-full h-full items-center justify-center">
                                <div className='rounded-t-md relative w-full '>
                                    <Image
                                    
                                     width={150}
                                     height={100}
                                     className='object-cover w-full rounded-t-md hover:scale-110 transition transform duration-500' src={c.image?.url || "/assets/images/placeholder.webp"} alt='Brand Image' />
                                    
                                </div>                            
                               
                            <div className='w-full flex gap-2 justify-between items-center '>
                                <div className='w-full flex items-center gap-4'>

                                <p className='text-base w-full text-center font-semibold text-gray-800'>{c.name?.length > 20 ? `${c.name?.slice(0, 20)}...` : c.name }</p>
                                </div>
                               
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

export default Brands
