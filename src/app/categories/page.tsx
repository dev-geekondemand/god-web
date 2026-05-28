"use client"

import { getCategories } from '@/features/category/categorySlice'
import { Category } from '@/interfaces/Category'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PageBanner from '@/app/components/PageBanner'

const Categories = () => {

    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(getCategories());
    },[dispatch])


    const categories = useSelector((state: RootState) => state.category?.categories) as Category[];
    console.log(categories);
    

  return (
    <section className='w-full flex flex-col justify-center items-center'>
        <PageBanner title="Service Categories" crumbs={[{ label: 'Categories' }]} />

        <div className='w-full flex justify-center items-center px-3 py-20'>
            <div className='w-full flex justify-center items-center max-w-7xl mx-auto '>
                <div className='w-full grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 justify-center items-center'>
                    {
                        categories?.map((c) => (
                            <Link href={`/categories/${c.slug || c._id}/brands`} key={c._id} className='border border-gray-300 bg-white group relative shadow-xs hover:border cursor-pointer rounded-lg flex'>
                        
                        <div className="flex flex-col  rounded-t-md w-full items-start overflow-hidden">
                                <div className=' rounded-t-md relative overflow-hidden'>
                                    <Image
                                   
                                     width={340}
                                     height={180}
                                     className='object-cover w-full rounded-t-md hover:scale-110 transition transform duration-500' src={c.image?.url} alt='Category Image' />
                                    
                                </div>                            
                               
                            <div className='w-full flex gap-2 justify-between items-center px-5 py-5'>
                                <div className='w-full flex items-center gap-4'>
                                <div className='bg-purple-200 rounded-full p-2'>
                                {c.smallBanner &&<Image src={c.smallBanner?.url} alt='Category Banner' width={30} height={30} />}
                                </div>
                                <p className='text-sm text-start font-semibold text-gray-800'>{c.title?.length > 32 ? `${c.title?.slice(0, 32)}...` : c.title }</p>
                                </div>
                                {/* <p className='flex gap-1  text-nowrap text-xs text-gray-700 items-center'>
                                    {c.totalGeeks} Geeks
                                </p> */}
                            </div>
                          
                    </div>
                    </Link>
                        ))
                    }
                </div>
            </div>

        </div>
    </section>
  )
}

export default Categories
