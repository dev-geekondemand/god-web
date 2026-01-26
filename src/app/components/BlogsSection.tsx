"use client"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'
import Link from 'next/link';
import { getAllBlogs } from '@/features/blogs/blogSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import Blog from '@/utils/Blog';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import GlobalSkeleton from "./Sekeletn";




  
const BlogsSection = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);


    const blogs = useSelector((state: RootState) => state.blog?.blogs) as Blog[];
    const azureLoader = ({ src }:{src:string}) => src;
    const isLoading = useSelector((state:RootState) => state.blog?.isLoading);

  return (
    <section className='flex justify-center bg-white w-full px-3 py-16'>
    <div className='max-w-7xl w-full flex flex-col justify-center items-center rounded-md'>
          <div className='flex flex-col max-w-2xl items-center justify-center w-full mx-auto gap-3'>
            <h1 className="h3 text-center">Insights &  <span className='text-teal-700'>Updates</span></h1>
              <p className="body-2 text-gray-700 text-center">Stay informed with useful guides, trends, and expert advice.</p>
          </div>
          
          {isLoading ? <GlobalSkeleton cards={3} cols={1} lgCols={3}  /> : <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full py-12 px-5 relative"
                >
                <CarouselContent>
                    {blogs.map((blog,index) => (
                    <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 sm:basis-1/2 mx-2 my-1">
                        <Card className='bg-white border-none p-0 shadow  rounded-md'>
                            <CardContent className="flex flex-col group gap-2 p-0 items-start justify-start">
                                <div className=' w-full h-[170px] relative rounded-md overflow-hidden'>
                                <Image loader={azureLoader} objectFit="cover" src={blog?.coverImage?.url ? blog?.coverImage?.url : "/assets/images/blog.png"} alt='Blog Image' className='object-cover rounded-md group-hover:scale-110 transition transform duration-500' layout='fill' />
                                </div>
                             
                               <div className='flex gap-6 text-gray-600 text-sm items-center px-3 pt-2'>
                                <p className=" ">{blog.author}</p>
                                <ul className='list-disc'><li>{new Date(blog?.createdAt).toLocaleDateString("en-US",{day: "numeric", month: "long", year: "numeric"})}</li></ul>
                               </div>

                            <div className='flex flex-col gap-2 px-3 pb-5 '>
                                <Link href={`/blogs/${blog?.slug}`} className="text-base hover:text-teal-600 transition transform duration-300 cursor-pointer font-bold text-gray-800">{blog.title?.slice(0,50) + '...'}</Link>
                                <p className="text-sm leading-5 text-gray-600">{blog.summary.slice(0,100)}...</p>
                            </div>

                            {/* <div className='flex gap-3 px-3 pb-3 pt-1 items-center'>
                                {blog.categories?.map((cat,i)=>{
                                   return <button key={i} className={`px-2 cursor-pointer rounded-lg ${cat==="Web Dev" ? "text-purple-500 bg-gray-200 ": " bg-gray-300 "}  py-1 text-xs`}>{cat}</button>
                                })}

                            </div> */}
                            
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='cursor-pointer -left-3 hover:bg-teal-500 hover:text-white'/>
                <CarouselNext className='cursor-pointer -right-0 hover:bg-teal-500 hover:text-white' />
            </Carousel>}

            <div className='w-full flex justify-center '>
                        <Link
                        href={'/blogs'}
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
                        </Link>
                    </div>
      </div>
    </section>
  )
}

export default BlogsSection
