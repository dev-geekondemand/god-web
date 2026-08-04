"use client";

import { useState } from "react";
import Script from "next/script";
import { CategoryPageFaq } from "@/utils/categoryPage";

interface CategoryFaqSectionProps {
  faqs: CategoryPageFaq[];
  heading?: string;
  categoryTitle?: string;
  schemaId?: string;
}

const CategoryFaqSection = ({
  faqs,
  heading = "FAQs",
  categoryTitle,
  schemaId = "category-faq-schema",
}: CategoryFaqSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  if (!faqs?.length) return null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? -1 : i);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="w-full pt-8 sm:pt-12">
      <Script
        id={schemaId}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-gray-50 p-6 rounded-md">
        <div className="flex flex-col gap-1 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wide text-teal-800">
            Frequently Asked Questions
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {heading}
          
        </h2>
      </div>

      <div className="flex flex-col">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className={`transition-colors ${isOpen ? "bg-teal-50/40" : "bg-white"} mb-3 shadow-xs py-3 px-5 rounded-md`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-start justify-between gap-4 cursor-pointer text-left group"
                aria-expanded={isOpen}
              >
                <span
                  className={`text-xs sm:text-sm font-semibold leading-snug ${
                    isOpen ? "text-teal-800" : "text-gray-800 group-hover:text-teal-700"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 mt-0.5 text-lg font-bold leading-none ${
                    isOpen ? "text-teal-800" : "text-gray-400"
                  }`}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                }`}
                style={{ display: "grid" }}
              >
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-l-2 border-teal-500 pl-3">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
};

export default CategoryFaqSection;
