"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PageBanner from "@/app/components/PageBanner";
import GlobalSkeleton from "@/app/components/Sekeletn";
import { getCategoryPages } from "@/features/categoryPage/categoryPageSlice";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { CategoryPageData } from "@/utils/categoryPage";

const CategoryPagesListing = () => {
  const dispatch = useAppDispatch();

  const pages = useSelector((state: RootState) => state.categoryPage?.pages) as CategoryPageData[];
  const isLoading = useSelector((state: RootState) => state.categoryPage?.isLoading);

  useEffect(() => {
    dispatch(getCategoryPages());
  }, [dispatch]);

  useEffect(() => {
    document.title = "Category Pages | GeekOnDemand";
  }, []);

  const publishedPages = (pages?.filter((page) => page.isPublished) ?? []).sort(
    (a, b) => (a.category?.priority ?? 0) - (b.category?.priority ?? 0)
  );

  return (
    <section className="w-full flex flex-col justify-center items-center bg-gray-50">
      <PageBanner title="Category Pages" crumbs={[{ label: "Category Pages" }]} />

      <div className="w-full flex justify-center items-center px-3 py-10">
        <div className="w-full max-w-7xl mx-auto">
          {isLoading ? (
            <GlobalSkeleton cards={9} cols={1} lgCols={3} />
          ) : publishedPages.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No category pages available right now.</p>
          ) : (
            <div className="w-full grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
              {publishedPages.map((page) => (
                <Link
                  href={`/category-pages/${page.slug}`}
                  key={page._id}
                  className="border border-gray-200 bg-white group relative shadow-sm hover:shadow-md transition-shadow rounded-lg flex flex-col overflow-hidden"
                >
                  <div className="relative w-full h-[180px] bg-teal-50 overflow-hidden">
                    {page.hero?.image?.url ? (
                      <Image
                        src={page.hero.image.url}
                        alt={page.hero.alt || page.hero.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-teal-600 font-semibold">
                        {page.category?.title}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-5">
                    {/* {page.hero?.badge && (
                      <span className="self-start bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                        {page.hero.badge}
                      </span>
                    )} */}
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                      {page?.category?.title || page.hero?.title || "Untitled"}
                    </h2>
                    {page.hero?.subtitle && (
                      <p className="text-sm text-gray-600 line-clamp-2">{page.hero.subtitle}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryPagesListing;
