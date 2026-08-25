import { getAllBlogsServer } from '@/features/blogs/blogServerService';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageBanner from '@/app/components/PageBanner';

export const revalidate = 3600;

const PAGE_SIZE = 9;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geekondemand.in";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1);
  const title = pageNum > 1 ? `Blogs — Page ${pageNum} | GeekOnDemand` : 'Blogs | GeekOnDemand';
  return {
    title,
    description: 'Read the latest IT support, tech tips, and how-to guides from GeekOnDemand.',
    alternates: {
      canonical: pageNum > 1 ? `${SITE_URL}/blogs?page=${pageNum}` : `${SITE_URL}/blogs`,
    },
  };
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
  if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const Blogs = async ({ searchParams }: PageProps) => {
  const { page } = await searchParams;
  const blogs = await getAllBlogsServer();

  const totalPages = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const requestedPage = Math.max(1, parseInt(page ?? '1', 10) || 1);
  if (blogs.length > 0 && requestedPage > totalPages) notFound();
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedBlogs = blogs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageHref = (p: number) => (p <= 1 ? '/blogs' : `/blogs?page=${p}`);

  return (
    <section className='w-full flex flex-col justify-center items-center bg-gray-50'>
        <PageBanner title="Blogs" crumbs={[{ label: 'Blogs' }]} />

        <div className='w-full flex flex-col gap-6 justify-center items-center py-0 px-3'>
           {blogs.length === 0 ? (
             <p className='text-gray-500 py-16'>No blog posts available right now. Please check back soon.</p>
           ) : (
            <>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-8 gap-y-16 max-w-7xl'>
            {paginatedBlogs.map((blog, index) => (
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
                <nav className='flex items-center gap-2 my-4' aria-label='Blog pagination'>
                    {currentPage === 1 ? (
                        <span className='px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-600 opacity-40 cursor-not-allowed'>
                            ← Prev
                        </span>
                    ) : (
                        <Link
                            href={pageHref(currentPage - 1)}
                            className='px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition'
                        >
                            ← Prev
                        </Link>
                    )}

                    {getPageNumbers(currentPage, totalPages).map((p, i) =>
                        p === '...' ? (
                            <span key={`ellipsis-${i}`} className='px-2 text-gray-400 select-none'>…</span>
                        ) : (
                            <Link
                                key={p}
                                href={pageHref(p as number)}
                                className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition ${
                                    currentPage === p
                                        ? 'bg-teal-600 text-white border border-teal-600'
                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {p}
                            </Link>
                        )
                    )}

                    {currentPage === totalPages ? (
                        <span className='px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-600 opacity-40 cursor-not-allowed'>
                            Next →
                        </span>
                    ) : (
                        <Link
                            href={pageHref(currentPage + 1)}
                            className='px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition'
                        >
                            Next →
                        </Link>
                    )}
                </nav>
            )}
            </>
           )}
        </div>
    </section>
  )
}

export default Blogs;
