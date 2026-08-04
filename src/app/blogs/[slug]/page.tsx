"use client"
import BlogContent from '@/app/components/BlogContent';
import { getAllBlogs, getBlogFromSlug, getTags, getCategories } from '@/features/blogs/blogSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import Blog, { BlogTag, BlogCategory } from '@/utils/Blog'
// BlogTag and BlogCategory used in useSelector type annotations below;
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import { useEffect } from 'react'
import { useSelector } from 'react-redux';

const BlogPage = () => {

const params = useParams();
const slug = params.slug?.toString() || '';

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getBlogFromSlug(slug));
    dispatch(getAllBlogs());
    dispatch(getTags());
    dispatch(getCategories());
  },[dispatch, slug]);

  const blog = useSelector((state: RootState) => state.blog?.blog) as unknown as Blog;
  const allBlogs = useSelector((state: RootState) => state.blog?.blogs) as Blog[];
  const allTags = useSelector((state: RootState) => state.blog?.tags) as BlogTag[];
  const allCategories = useSelector((state: RootState) => state.blog?.categories) as BlogCategory[];

  // Resolve tags — handle both populated objects and plain ID strings
  const resolvedTags = (blog?.tags as (BlogTag | string)[] | undefined)
    ?.map(item =>
      typeof item === 'string'
        ? allTags?.find(t => t._id === item)
        : item
    )
    .filter((t): t is BlogTag => !!t && typeof t === 'object' && !!t.name);

  // Resolve categories — handle both populated objects and plain ID strings
  const resolvedCategories = (blog?.categories as (BlogCategory | string)[] | undefined)
    ?.map(item =>
      typeof item === 'string'
        ? allCategories?.find(c => c._id === item)
        : item
    )
    .filter((c): c is BlogCategory => !!c && typeof c === 'object' && !!c.name);

  // Inject SEO meta tags
  useEffect(() => {
    if (!blog) return;

    document.title = blog.seo?.metaTitle || blog.title || 'Blog | GeekOnDemand';

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', blog.seo?.metaDescription || blog.summary || '');
    if (blog.seo?.metaKeywords?.length) {
      setMeta('keywords', blog.seo.metaKeywords.join(', '));
    }
  }, [blog]);

  // Related blogs: share a category or tag with the current blog, exclude self
  const currentTagIds = resolvedTags?.map(t => t._id) ?? [];
  const currentCatIds = resolvedCategories?.map(c => c._id) ?? [];

  const relatedBlogs = allBlogs
    ?.filter(b => b.slug !== blog?.slug)
    .map(b => {
      const bTagIds = (b.tags as (BlogTag | string)[])?.map(t => typeof t === 'string' ? t : t._id) ?? [];
      const bCatIds = (b.categories as (BlogCategory | string)[])?.map(c => typeof c === 'string' ? c : c._id) ?? [];
      const score =
        bTagIds.filter(id => currentTagIds.includes(id)).length +
        bCatIds.filter(id => currentCatIds.includes(id)).length;
      return { blog: b, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ blog }) => blog);


  return (
    <section className='w-full flex flex-col justify-center items-center'>
            <div className='w-full relative py-3 bg-teal-500/10 rounded-br-[60%]' >
                <div className='w-full   relative flex justify-center items-center py-4  text-center'>
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

                                <div className='flex md:col-span-8 col-span-12 flex-col gap-5 h-fit bg-white rounded-lg px-5 py-0'>

                                    <div className='w-full flex flex-col gap-6'>
                                      <h2 className="h2">{blog?.title}</h2>

                                      {/* Categories */}
                                      {resolvedCategories && resolvedCategories.length > 0 && (
                                        <div className='flex flex-wrap gap-2'>
                                          {resolvedCategories.map((cat) => (
                                            <Link key={cat._id} href={`/blogs/category/${cat.slug || cat._id}`} className='px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors'>
                                              {cat.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}

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
                                        <Image src={blog?.coverImage?.url ? blog?.coverImage?.url : "/assets/images/blog.png"} width={800} height={800} className='rounded-lg' alt={blog?.coverImage?.alt || blog?.title || "Blog Image"} />
                                    </div>

                                   <BlogContent html={blog?.description ? blog?.description?.toString() : ""} />

                                   {/* Tags */}
                                   {resolvedTags && resolvedTags.length > 0 && (
                                     <div className='flex flex-wrap gap-2 pt-4 border-t border-gray-100'>
                                       <span className='text-sm text-gray-500 font-medium'>Tags:</span>
                                       {resolvedTags.map((tag) => (
                                         <span key={tag._id} className='px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors'>
                                           #{tag.name}
                                         </span>
                                       ))}
                                     </div>
                                   )}
                                </div>

                                {/* RIGHT SIDEBAR */}
                                <div className='flex md:col-span-4 col-span-12 flex-col gap-5 mt-28 h-fit'>

                                  {/* Categories sidebar */}
                                  {resolvedCategories && resolvedCategories.length > 0 && (
                                    <div className='w-full bg-gray-50 px-6 py-6 rounded-md'>
                                      <h3 className='text-gray-800 font-semibold text-lg mb-4'>Categories</h3>
                                      <div className='flex flex-col gap-2'>
                                        {resolvedCategories.map((cat) => (
                                          <Link key={cat._id} href={`/blogs/category/${cat.slug || cat._id}`} className='text-gray-600 text-sm py-1 border-b border-gray-100 last:border-0 hover:text-teal-600 transition-colors'>
                                            {cat.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Tags sidebar */}
                                  {resolvedTags && resolvedTags.length > 0 && (
                                    <div className='w-full bg-gray-50 flex flex-col gap-4 px-6 py-6 rounded-md'>
                                      <h3 className='text-gray-800 font-semibold text-lg'>Tags</h3>
                                      <div className='flex flex-wrap gap-2'>
                                        {resolvedTags.map((tag) => (
                                          <span key={tag._id} className='bg-white py-1 px-3 rounded-md text-sm text-gray-600 border border-gray-200'>
                                            #{tag.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Related Blogs */}
                                  <div className='w-full px-6 py-6 rounded-md'>
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Related Blogs</h3>
                                    <div className="flex flex-col gap-4">
                                      {relatedBlogs?.length > 0 ? (
                                        relatedBlogs.map((item: Blog, index: number) => (
                                          <Link
                                            href={`/blogs/${item.slug}`}
                                            key={index + 1}
                                            className="flex flex-col gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
                                          >
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
                                                {item?.author}
                                              </div>
                                            </div>
                                          </Link>
                                        ))
                                      ) : (
                                        <p className="text-gray-500 text-sm">No related blogs found.</p>
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
