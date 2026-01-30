"use client"
import BlogContent from '@/app/components/BlogContent';
import { getAllBlogs, getBlogFromSlug } from '@/features/blogs/blogSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import Blog from '@/utils/Blog';
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const BlogPage = () => {

const params = useParams();
const slug = params.slug?.toString() || '';



  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getBlogFromSlug(slug));
    dispatch(getAllBlogs());
  },[dispatch, slug]);

  const blog = useSelector((state: RootState) => state.blog?.blog) as unknown as Blog;
  const allBlogs = useSelector((state: RootState) => state.blog?.blogs) as Blog[];

  console.log(allBlogs);
  

  const recentBlogs = allBlogs?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  console.log(recentBlogs);
  
  
  const azureLoader = ({ src }:{src:string}) => src;

  return (
    <section className='w-full flex flex-col justify-center items-center'>
            <div className='w-full relative py-20 bg-teal-500/10 rounded-br-[60%]' >
                <div className='w-full   relative flex justify-center items-center py-10  text-center'>
                    <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                        <div className='flex flex-wrap w-full'>
                            <div className='w-full flex flex-col gap-3 items-center justify-center'>
                                <h2 className='text-3xl max-w-2xl font-bold text-black'>{blog?.title}</h2>
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
                                <Link href={'/blogs'} className=' text-gray-600 hover:text-teal-600 transition transform duration-300'>Blogs</Link>

                                <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                    <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                                </svg>
                                <p className=' text-gray-600'>{blog?.title?.slice(0,20) + '...'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className='w-full flex flex-col gap-8 items-center justify-center pt-6 px-3 bg-white'>
                        <div className='max-w-7xl  mx-auto w-full flex flex-col items-center justify-center'>
                            <div className='w-full grid grid-cols-12 gap-8'>
            
                                <div className='flex md:col-span-8 col-span-12 flex-col gap-5 h-fit bg-white rounded-lg px-5 py-8'>
                            

                                    <div className='w-full flex flex-col gap-6'>
                                      <h2 className="h2">{blog?.title}</h2>

                                      <div className='flex gap-4'>
                                        <div className='flex gap-3 items-center text-gray-500'>
                                          <div className='w-8 h-8 rounded-full border border-gray-300'>
                                            <Image src="/assets/logo-big.webp" alt='Author' className='object-contain w-8 h-8 rounded-full' width={40} height={40} />
                                          </div>
                                          {blog?.author}
                                        </div>

                                        <div className='flex gap-2 items-center text-gray-500'>
                                        <svg
                                            fill={'oklch(70.4% 0.14 182.503)'}
                                            className='w-5 h-5'
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z" />
                                          </svg>
                                              {new Date(blog?.createdAt).toLocaleDateString("en-US",{day: "numeric", month: "long", year: "numeric"})}
                                        </div>

                                        
                                      </div>

                                    </div>


                                    <div className='w-full  relative'>
                                        <Image loader={azureLoader} src={blog?.coverImage?.url ? blog?.coverImage?.url : "/assets/images/blog.png"} width={800} height={800} className='rounded-lg' alt="Blog Image" />
                                    </div>

                                   <BlogContent html={blog?.description ? blog?.description?.toString() : ""} />
                                </div>
            
{/*             
                                <div className='flex md:col-span-4 col-span-12 sm:col-span-8 flex-col gap-3  p-4'>
                                    <div className='w-full bg-gray-100 px-6 rounded-md py-6'>
                                      <form action="" className='w-full'>
                                          <input type="text" placeholder='Search...' className='w-full text-gray-600 text-sm bg-white outline-none border border-gray-100 rounded p-3' />
                                      </form>
                                    </div>
                                    <div className='w-full bg-gray-100 flex flex-col gap-5 px-6 rounded-md py-6'>
                                          <h6 className='text-gray-800 font-medium text-2xl'> Blog Categories</h6>
                                          <div className='flex flex-col gap-3'>
                                            <p className="body-2 text-gray-600">Laptop Repair</p>
                                            <p className="body-2 text-gray-600">Geeks and Market</p>
                                            <p className="body-2 text-gray-600">Seekers and Market</p>
                                          </div>
                                    </div>

                                    <div className='w-full bg-gray-100 flex flex-col gap-5 px-6 rounded-md py-4'>
                                          <h6 className='text-gray-800 font-medium text-2xl'>Tags</h6>
                                          <div className='flex gap-3'>
                                            <p className="body-2 bg-white py-2 px-3 rounded-md text-gray-600">Laptop Repair</p>
                                            <p className="body-2 bg-white py-2 px-3 rounded-md text-gray-600">Geeks and Market</p>
                                          </div>
                                    </div>
                                </div> */}

                                {/* RIGHT SIDEBAR - Related Blogs */}
                                  <div className='flex md:col-span-4 col-span-12 flex-col gap-5 mt-28 h-fit'>
                                    
                                    <div className='w-full  px-6 py-6 rounded-md'>
                                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Blogs</h3>

                                      <div className="flex flex-col gap-4">
                                        {recentBlogs?.length > 0 ? (
                                          recentBlogs.map((item: Blog,index: number) => (
                                            <Link 
                                              href={`/blogs/${item.slug}`} 
                                              key={index+1}
                                              className="flex flex-col gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
                                            >
                                              {/* <div className="w-full h-48 rounded overflow-hidden">
                                                <Image
                                                  src={item.coverImage?.url || "/assets/images/blog.png"}
                                                  width={80}
                                                  height={80}
                                                  className="object-cover w-full h-full"
                                                  alt={item.title}
                                                />
                                              </div> */}

                                              <div className="flex flex-col justify-center gap-4 mt-3">
                                                <span className="text-xs font-bold text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                                <p className="font-semibold text-gray-800 text-base">
                                                  {item.title}
                                                </p>
                                                <div className='flex gap-3 items-center text-gray-500'>
                                                  <div className='w-8 h-8 rounded-full border border-gray-300'>
                                                    <Image src="/assets/logo-big.webp" alt='Author' className='object-contain w-8 h-8 rounded-full' width={40} height={40} />
                                                  </div>
                                                  {blog?.author}
                                                </div>
                                              </div>
                                            </Link>
                                          ))
                                        ) : (
                                          <p className="text-gray-500 text-sm">No recent blogs found.</p>
                                        )}
                                      </div>
                                    </div>

                                  </div>

            
                            </div>
                        </div>
                    </div>


      </section>
  )
}

export default BlogPage
