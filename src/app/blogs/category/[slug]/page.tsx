"use client"

import { getAllBlogs, getCategories } from '@/features/blogs/blogSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import Blog, { BlogCategory } from '@/utils/Blog';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import GlobalSkeleton from '@/app/components/Sekeletn';
import PageBanner from '@/app/components/PageBanner';

const BlogCategoryPage = () => {
    const params = useParams();
    const categorySlug = params.slug?.toString() || '';

    const dispatch = useAppDispatch();

    const blogs = useSelector((state: RootState) => state.blog?.blogs) as Blog[];
    const allCategories = useSelector((state: RootState) => state.blog?.categories) as BlogCategory[];
    const isLoading = useSelector((state: RootState) => state.blog?.isLoading);

    useEffect(() => {
        dispatch(getAllBlogs());
        dispatch(getCategories());
    }, [dispatch]);

    const currentCategory = allCategories?.find(c => c.slug === categorySlug);

    const filteredBlogs = blogs?.filter(blog => {
        const cats = blog.categories as (BlogCategory | string)[] | undefined;
        return cats?.some(c =>
            typeof c === 'string'
                ? c === currentCategory?._id
                : c._id === currentCategory?._id || c.slug === categorySlug
        );
    });

    return (
        <section className='w-full flex flex-col justify-center items-center bg-gray-50'>
            <PageBanner
                title={currentCategory?.name || 'Category'}
                crumbs={[
                    { label: 'Blogs', href: '/blogs' },
                    { label: currentCategory?.name || categorySlug },
                ]}
            />

            <div className='w-full flex flex-col gap-6 justify-center items-center py-10 px-3'>
                {isLoading ? <GlobalSkeleton cards={9} cols={1} lgCols={3} /> : (
                    <>
                        {filteredBlogs && filteredBlogs.length > 0 ? (
                            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-8 gap-y-16 max-w-7xl'>
                                {filteredBlogs.map((blog, index) => (
                                    <Link href={`/blogs/${blog?.slug}`} key={index} className='bg-white border-none p-0 shadow rounded-md'>
                                        <div className="flex flex-col group gap-2 items-start justify-start h-fit">
                                            <div className='w-full h-[240px] relative rounded-t-md overflow-hidden'>
                                                <Image fill src={blog?.coverImage?.url} alt={blog?.coverImage?.alt || blog?.title || 'Blog Image'} className='object-cover rounded-t-md group-hover:scale-110 transition transform duration-500' sizes="(max-width: 768px) 100vw, 400px" />
                                            </div>
                                            <div className='px-5 py-4 flex flex-col gap-3 h-full w-full justify-end'>
                                                <div className='flex gap-2 text-gray-600 text-sm items-center'>
                                                    <div className='w-7 relative h-7 rounded-full'>
                                                        <Image src="/assets/logo-big.webp" className='rounded-full object-contain' fill alt='Blog Author Image' sizes="28px" />
                                                    </div>
                                                    <p>{blog?.author}</p>
                                                    <span>{new Date(blog?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                                                </div>
                                                <div className='flex flex-col gap-1'>
                                                    <h2 className="text-xl hover:text-teal-600 transition transform duration-300 cursor-pointer font-medium text-gray-800">{blog?.title}</h2>
                                                </div>
                                                <p className="body-2 text-gray-600">
                                                    {blog?.summary && blog?.summary.length > 280 ? blog?.summary.slice(0, 280) + "..." : blog?.summary}
                                                    {blog?.summary && blog?.summary.length > 280 && <span className="body-2 text-xs text-teal-500"> Read More</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center gap-4 py-16 text-gray-500'>
                                <p className='text-lg'>No blogs found in this category.</p>
                                <Link href='/blogs' className='text-teal-600 hover:underline text-sm'>← Back to all blogs</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default BlogCategoryPage;
