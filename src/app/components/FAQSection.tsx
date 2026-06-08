"use client";

import { useState } from "react";
import Script from "next/script";

const faqs = [
  {
    question: "How quickly can a Geek arrive at my home in Hyderabad?",
    answer:
      "Most bookings are confirmed within minutes and we offer same-day service across Hyderabad. Once your Geek is assigned, you will receive their ETA directly. Availability depends on your location and the service required.",
  },
  {
    question: "What IT services does GeekOnDemand provide at home?",
    answer:
      "Our verified Geeks handle laptop and desktop repair, printer setup and service, router installation and troubleshooting, antivirus setup and protection, software installation and support, scanner service, and more — all at your doorstep in Hyderabad.",
  },
  {
    question: "Are GeekOnDemand Geeks verified and background-checked?",
    answer:
      "Yes. Every Geek on our platform is Aadhaar-verified and goes through a background check before being listed. You can view each Geek's profile, ratings, and reviews before booking.",
  },
  {
    question: "How do I book an IT support Geek in Hyderabad?",
    answer:
      "Select your service category, choose a Geek by location and rating, and confirm your booking in seconds — all through the GeekOnDemand website or our Android and iOS app. Your Geek arrives at your home or office and resolves the issue on the spot.",
  },
  {
    question: "Which device brands does GeekOnDemand support?",
    answer:
      "Our Geeks are trained to support all major brands including HP, Dell, Lenovo, Acer, ASUS, Canon, Epson, D-Link, TP-Link, Quick Heal, and more. GeekOnDemand is also an official Quick Heal service partner.",
  },
];

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

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="w-full px-3 sm:px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="h3">
              Frequently Asked <span className="colored">Questions</span>
            </h2>
            <p className="body-2 text-gray-600 max-w-xl">
              Everything you need to know about IT support at home in Hyderabad.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl border transition-colors duration-200 overflow-hidden ${
                    isOpen
                      ? "border-teal-500 shadow-sm"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                          isOpen
                            ? "bg-teal-700 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-gray-800">
                        {faq.question}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${
                        isOpen
                          ? "bg-teal-700 text-white rotate-45"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-64 pb-5" : "max-h-0"
                    }`}
                  >
                    <div className="pl-10 pt-3 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
