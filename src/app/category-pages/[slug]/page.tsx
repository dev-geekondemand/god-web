"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import CategoryPageHero from "@/app/components/category-page/CategoryPageHero";
import ProblemsSection from "@/app/components/category-page/ProblemsSection";
import HowItWorksSection from "@/app/components/category-page/HowItWorksSection";
import WhyChooseUsSection from "@/app/components/category-page/WhyChooseUsSection";
import OtherCategoryPagesSection from "@/app/components/category-page/OtherCategoryPagesSection";
import CategoryFaqSection from "@/app/components/category-page/CategoryFaqSection";
import GlobalSkeleton from "@/app/components/Sekeletn";
import { getCategoryPageBySlug } from "@/features/categoryPage/categoryPageSlice";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { CategoryPageData } from "@/utils/categoryPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geekondemand.in";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'
import { X } from 'lucide-react'

const TOTAL = 8

export const Reviews = () => {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className='flex justify-center w-full pt-12'>
      <div className='max-w-7xl w-full flex flex-col justify-center items-center rounded-md'>
        <div className='flex flex-col max-w-2xl items-start justify-start w-full mx-auto gap-1'>
          <h2 className="text-sm uppercase font-bold text-teal-700 text-center">Customer Proof</h2>
          <p className="h3 text-gray-700">What people say</p>
        </div>

        <Carousel
          opts={{ align: "start" }}
          className="w-full py-4 relative"
        >
          <CarouselContent>
            {Array.from({ length: TOTAL }, (_, i) => (
              <CarouselItem key={i} className="md:basis-1/4 sm:basis-1 lg:basis-1/2 h-72">
                <button
                  onClick={() => setSelected(i + 1)}
                  className="w-full h-full rounded-md overflow-hidden border border-gray-200 hover:ring-2 hover:ring-teal-500 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <Image
                    src={`/assets/testimonials/${i + 1}.jpeg`}
                    width={500}
                    height={500}
                    alt={`Testimonial ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='cursor-pointer -left-3 hover:bg-teal-500 hover:text-white' />
          <CarouselNext className='cursor-pointer -right-3 hover:bg-teal-500 hover:text-white' />
        </Carousel>
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-xl w-full max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute hover:cursor-pointer top-3 right-3 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <Image
              src={`/assets/testimonials/${selected}.jpeg`}
              width={1000}
              height={1200}
              alt={`Testimonial ${selected}`}
              className="w-full h-auto object-contain"
              quality={100}
            />
          </div>
        </div>
      )}
    </section>
  )
}





const CategoryLandingPage = () => {
  const params = useParams();
  const slug = params.slug?.toString() || "";

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (slug) dispatch(getCategoryPageBySlug(slug));
  }, [dispatch, slug]);

  const page = useSelector((state: RootState) => state.categoryPage?.page) as CategoryPageData | null;
  const isLoading = useSelector((state: RootState) => state.categoryPage?.isLoading);

  useEffect(() => {
    if (!page) return;

    document.title = page.seo?.metaTitle || page.hero?.title || "GeekOnDemand";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", page.seo?.metaDescription || page.hero?.subtitle || "");

    const keywords = [
      page.seo?.primaryKeyword,
      ...(page.seo?.secondaryKeywords || []),
      ...(page.seo?.nearMeKeywords || []),
      ...(page.seo?.brandKeywords || []),
    ].filter(Boolean) as string[];
    if (keywords.length) {
      setMeta("keywords", keywords.join(", "));
    }
  }, [page]);

  if (isLoading) {
    return (
      <div className="w-full px-3 py-10">
        <GlobalSkeleton cards={6} cols={1} lgCols={3} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="w-full flex justify-center items-center py-24">
        <p className="text-gray-500">Page not found.</p>
      </div>
    );
  }

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.hero?.title,
    provider: {
      "@type": "LocalBusiness",
      name: "GeekOnDemand",
      url: SITE_URL,
      telephone: "+918374374117",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Hyderabad",
    },
    description: page.seo?.metaDescription || page.hero?.subtitle,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <main className="w-full">
        <CategoryPageHero hero={page.hero} />
        <ProblemsSection problems={page.problems} categoryTitle={page.category?.title} />
        <HowItWorksSection />
        <WhyChooseUsSection />
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-12 mx-auto">
          <Reviews />
          
          {page.faqs?.length > 0 && (
          <CategoryFaqSection
            faqs={page.faqs}
            categoryTitle={page.category?.title || page.hero?.title}
            schemaId={`faq-schema-${page.slug}`}
          />
        )}
        </div>
        <OtherCategoryPagesSection currentSlug={page.slug} />
      </main>
    </>
  );
};

export default CategoryLandingPage;
