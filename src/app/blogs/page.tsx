"use client"

import { getAllBlogs } from '@/features/blogs/blogSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import Blog from '@/utils/Blog';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import GlobalSkeleton from '../components/Sekeletn';
import PageBanner from '@/app/components/PageBanner';

const PAGE_SIZE = 9;

const Blogs = () => {

    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);

    const blogs = useSelector((state: RootState) => state.blog?.blogs) as Blog[];
    const isLoading = useSelector((state: RootState) => state.blog?.isLoading);

    useEffect(() => {
        if (!blogs?.length) {
            dispatch(getAllBlogs());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const totalPages = Math.ceil((blogs?.length || 0) / PAGE_SIZE);
    const paginatedBlogs = blogs?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

  return (
    <section className='w-full flex flex-col justify-center items-center bg-gray-50'>
        <PageBanner title="Blogs" crumbs={[{ label: 'Blogs' }]} />

        <div className='w-full flex flex-col gap-6 justify-center items-center py-10 px-3'>
           {isLoading ? <GlobalSkeleton cards={9} cols={1} lgCols={3} /> : (
            <>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-8 gap-y-16 max-w-7xl'>
            {paginatedBlogs && paginatedBlogs.map((blog, index) => (
                <Link href={`/blogs/${blog?.slug}`} key={index} className='bg-white border-none p-0 shadow rounded-md'>
                    <div className="flex flex-col group gap-2 items-start justify-start h-fit">
                        <div className='w-full h-[240px] relative rounded-t-md overflow-hidden'>
                        <Image fill src={blog?.coverImage?.url} alt='Blog Image' className='object-cover rounded-t-md group-hover:scale-110 transition transform duration-500' sizes="(max-width: 768px) 100vw, 400px" />
                        </div>
                       <div className='px-5 py-4 flex flex-col gap-3 h-full w-full justify-end'>

                                <div className='flex gap-2 text-gray-600 text-sm items-center'>
                                    <div className='w-7 relative h-7 rounded-full'>
                                        <Image src="/assets/logo-big.webp" className='rounded-full object-contain' fill alt='Blog Author Image' sizes="28px" />
                                    </div>
                                    <p className=" ">{blog?.author}</p>
                                    <span>{new Date(blog?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                                </div>

                            <div className='flex flex-col gap-1'>
                                <h2 className="text-xl hover:text-teal-600 transition transform duration-300 cursor-pointer font-medium text-gray-800">{blog?.title}</h2>
                            </div>
                            <p className="body-2 text-gray-600">{blog?.summary && blog?.summary.length > 280 ? blog?.summary.slice(0, 280) + "..." : blog?.summary}
                            {blog?.summary && blog?.summary.length > 280 && <span className="body-2 text-xs text-teal-500"> Read More</span>}
                            </p>
                       </div>
                    </div>
                </Link>
            ))}
            </div>

            {totalPages > 1 && (
                <div className='flex items-center gap-2 mt-4'>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition'
                    >
                        ← Prev
                    </button>

                    {getPageNumbers().map((page, i) =>
                        page === '...' ? (
                            <span key={`ellipsis-${i}`} className='px-2 text-gray-400 select-none'>…</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`w-9 h-9 rounded-md text-sm font-medium transition ${
                                    currentPage === page
                                        ? 'bg-teal-600 text-white border border-teal-600'
                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className='px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition'
                    >
                        Next →
                    </button>
                </div>
            )}
            </>
           )}
        </div>
    </section>
  )
}

export default Blogs;
