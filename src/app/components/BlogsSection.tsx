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
import InnerBannerAd from "./InnerBannerAd";




  
const BlogsSection = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);


    const blogs = useSelector((state: RootState) => state.blog?.blogs) as Blog[];
    const isLoading = useSelector((state:RootState) => state.blog?.isLoading);

  return (
    <section className='bg-white w-full px-4 py-10 sm:px-6 lg:px-10'>
      <div className='max-w-screen-xl mx-auto flex flex-col gap-4'>

        {/* Heading — full width, above the carousel+sidebar row */}
        <div className='flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-3'>
          <h1 className="h3 text-center">Insights &amp; <span className='text-teal-700'>Updates</span></h1>
          <p className="body-2 text-gray-600 text-center">Stay informed with useful guides, trends, and expert advice.</p>
        </div>

        {/* Carousel + Ad — side by side, ad stretches to carousel height */}
        <div className='flex flex-col lg:flex-row gap-6 items-stretch w-full'>

          {/* Carousel + View All */}
          <div className='flex flex-col items-center flex-1 min-w-0'>
            {isLoading
              ? <GlobalSkeleton cards={3} cols={1} lgCols={3} />
              : (
                <Carousel
                  opts={{ align: "start" }}
                  className="w-full py-8 px-6 relative"
                >
                  <CarouselContent className="-ml-3">
                    {blogs.map((blog, index) => (
                      <CarouselItem key={index} className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3">
                        <Card className='bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden h-full'>
                          <CardContent className="flex flex-col group gap-0 p-0 items-start justify-start h-full">
                            <div className='w-full h-[180px] relative overflow-hidden'>
                              <Image
                               
                                src={blog?.coverImage?.url || "/assets/images/blog.png"}
                                alt='Blog Image'
                                className='object-cover group-hover:scale-105 transition-transform duration-500'
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            </div>

                            <div className='flex gap-4 text-gray-500 text-xs items-center px-4 pt-3'>
                              <p>{blog.author}</p>
                              <ul className='list-disc'>
                                <li>{new Date(blog?.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</li>
                              </ul>
                            </div>

                            <div className='flex flex-col gap-2 px-4 py-3 flex-1'>
                              <Link
                                href={`/blogs/${blog?.slug}`}
                                className="text-sm font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-200 leading-snug line-clamp-2"
                              >
                                {blog.title}
                              </Link>
                              <p className="text-xs leading-5 text-gray-500 line-clamp-3">{blog.summary}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className='cursor-pointer -left-1 hover:bg-teal-500 hover:text-white' />
                  <CarouselNext className='cursor-pointer -right-1 hover:bg-teal-500 hover:text-white' />
                </Carousel>
              )}

            <Link
              href='/blogs'
              className="mt-2 flex items-center gap-2 w-fit px-6 py-2.5 bg-gray-900 hover:bg-gray-700 transition-colors duration-200 text-sm text-white rounded-lg"
            >
              View All
              <svg height="12" strokeLinejoin="round" viewBox="0 0 16 16" width="12">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>

          {/* Ad — inside the carousel container, same height via flex stretch */}
          <aside className='w-full lg:w-1/4 flex flex-col'>
            <div className='flex-1 overflow-hidden '>
              <InnerBannerAd placement="home" medium_rectangle stretch />
            </div>
          </aside>

        </div>
      </div>
    </section>
  )
}

export default BlogsSection
