"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryPageService } from "@/features/categoryPage/categoryPageService";
import { CategoryPageData } from "@/utils/categoryPage";

interface Props {
  currentSlug: string;
  limit?: number;
}

const OtherCategoryPagesSection = ({ currentSlug, limit = 5 }: Props) => {
  const [pages, setPages] = useState<CategoryPageData[]>([]);

  useEffect(() => {
    let cancelled = false;

    categoryPageService.getCategoryPages().then((allPages: CategoryPageData[]) => {
      if (cancelled) return;
      const others = (allPages || []).filter((p) => p.isPublished && p.slug !== currentSlug);
      const shuffled = [...others].sort(() => Math.random() - 0.5);
      setPages(shuffled.slice(0, limit));
    }).catch(() => {
      if (!cancelled) setPages([]);
    });

    return () => {
      cancelled = true;
    };
  }, [currentSlug, limit]);

  if (!pages.length) return null;

  return (
    <section className="py-12 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
         <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-8">
            <div className="w-10 h-0.5 bg-yellow-500 rounded-full" />
          <span className="text-sm font-bold uppercase tracking-wide text-teal-800">
            RELATED IT SERVICES
          </span>
            <div className="w-10 h-0.5 bg-yellow-500 rounded-full" />

          </div>
          
        </div>
        <div className="flex flex-nowrap overflow-scroll custom-scrollbar justify-center gap-4">
          {pages.map((page) => (
            <Link
              href={`/category-pages/${page.slug}`}
              key={page._id}
              className="flex items-center gap-3 bg-gray-50 hover:bg-teal-50 rounded-full px-5 py-3 border border-gray-200 hover:border-teal-300 transition-colors"
            >
              {page.hero?.image?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.hero.image.url} alt="" className="w-6 h-6 object-contain rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-teal-50" />
              )}
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
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
