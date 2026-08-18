"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryPageService } from "@/features/categoryPage/categoryPageService";
import { CategoryPageData } from "@/utils/categoryPage";

interface Props {
  currentSlug: string;
  limit?: number;

}

const OtherCategoryPagesSection = ({ currentSlug, limit = 5,  }: Props) => {
  const [pages, setPages] = useState<CategoryPageData[]>([]);

  useEffect(() => {
    let cancelled = false;

    categoryPageService.getCategoryPages().then((allPages: CategoryPageData[]) => {
      if (cancelled) return;
      const others = (allPages || []).filter((p) => p.isPublished && p.slug !== currentSlug);
      const sorted = [...others].sort((a, b) => (a.category?.priority ?? 0) - (b.category?.priority ?? 0));
      setPages(sorted.slice(0, limit));
    }).catch(() => {
      if (!cancelled) setPages([]);
    });

    return () => {
      cancelled = true;
    };
  }, [currentSlug, limit]);

  console.log("OtherCategoryPagesSection pages:", pages);

  if (!pages.length) return null;

  return (
    <section className="sm:py-8 sm:px-6 px-3 py-4 w-full bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto w-full">
         <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-8">
            <div className="w-10 h-0.5 bg-yellow-500 rounded-full" />
          <span className="text-xl md:text-2xl font-bold  tracking-wide text-teal-800">
            Related IT Services
          </span>
            <div className="w-10 h-0.5 bg-yellow-500 rounded-full" />

          </div>
          
        </div>
        <div className="flex w-full flex-wrap overflow-x-scroll custom-scrollbar justify-center gap-4">
          {pages.map((page) => (
            <Link
              href={`/category-pages/${page.slug}`}
              key={page._id}
              className="flex w-fit items-center  gap-3 bg-gray-50 hover:bg-teal-50 rounded-xl sm:px-5 sm:py-3 px-2 py-1.5 border border-gray-200 hover:border-teal-300 transition-colors"
            >
              {page.category?.smallBanner?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page?.category?.smallBanner?.url} alt="" className="w-8 h-6 object-contain rounded-full" />
              ) : (
                <div className="w-8 h-6 rounded-full bg-teal-50" />
              )}
              <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                {page.hero?.badge}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherCategoryPagesSection;
