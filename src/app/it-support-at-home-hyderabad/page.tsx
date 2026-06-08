import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IT Support at Home in Hyderabad — GeekOnDemand",
  description:
    "Same-day IT support at home in Hyderabad. Book a verified Geek for laptop repair, printer setup, router troubleshooting, antivirus & software — at your doorstep.",
  alternates: {
    canonical: "https://geekondemand.in/it-support-at-home-hyderabad",
  },
};

const services = [
  { name: "Laptop & Desktop Repair", slug: "laptop-desktop-repair" },
  { name: "Printer Service & Repair", slug: "printer-service-repair" },
  { name: "Router Setup & Troubleshooting", slug: "router-setup" },
  { name: "Antivirus Setup & Protection", slug: "antivirus" },
  { name: "Software Installation & Support", slug: "software" },
  { name: "Scanner Service & Repair", slug: "scanner-service-repair" },
];

const faqs = [
  {
    q: "Do you provide IT support at home in Hyderabad on the same day?",
    a: "Yes. GeekOnDemand offers same-day doorstep IT support across Hyderabad. Book online or via the app and a verified Geek will arrive at your home or office.",
  },
  {
    q: "Which areas in Hyderabad does GeekOnDemand serve?",
    a: "We serve all major areas in Hyderabad including Banjara Hills, Jubilee Hills, Hitech City, Gachibowli, Madhapur, Begumpet, Secunderabad, Kukatpally, and more.",
  },
  {
    q: "How much does IT support at home in Hyderabad cost?",
    a: "Pricing depends on the service and device. All charges are transparent — you see the estimate before confirming. No hidden fees.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support at Home in Hyderabad",
  provider: {
    "@type": "LocalBusiness",
    name: "GeekOnDemand",
    url: "https://www.geekondemand.in",
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
  description:
    "Same-day IT support at home in Hyderabad. Verified Geeks for laptop repair, printer setup, router troubleshooting, antivirus and software support.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HyderabadITSupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="w-full">
        {/* Hero */}
        <section className="bg-teal-700 text-white py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              IT Support at Home in Hyderabad
            </h1>
            <p className="text-base sm:text-lg text-teal-100">
              Same-day doorstep service for laptop repair, printer, router, antivirus &amp; software — by verified IT experts.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Link
                href="/categories"
                className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Book a Geek
              </Link>
              <Link
                href="/geeks"
                className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Browse Geeks
              </Link>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-14 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              IT Services We Offer at Home in Hyderabad
            </h2>
            <p className="text-center text-gray-500 text-sm mb-10">
              Our Geeks are trained across all major service categories and device brands.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href="/categories"
                  className="border border-gray-200 rounded-xl px-4 py-5 text-center text-sm font-semibold text-gray-700 hover:border-teal-500 hover:text-teal-700 transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why GoD */}
        <section className="py-14 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
              Why Choose GeekOnDemand for IT Support in Hyderabad?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "Verified & Background-Checked", body: "Every Geek is Aadhaar-verified before being listed on the platform." },
                { title: "Same-Day Doorstep Service", body: "Book in seconds. Your Geek arrives at your home or office — no waiting." },
                { title: "Transparent Pricing", body: "See the estimate before you confirm. No surprise charges, no jargon." },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              Brands We Repair &amp; Support in Hyderabad
            </h2>
            <p className="text-sm text-gray-600">
              HP, Dell, Lenovo, Acer, ASUS, Apple, Canon, Epson, Brother, D-Link, TP-Link, Netgear, Quick Heal, Kaspersky, Microsoft, Samsung, and more.
            </p>
            <p className="mt-3 text-xs text-teal-700 font-medium">
              Official Quick Heal Service Partner &nbsp;·&nbsp; Authorised service for all leading device brands
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white px-5 py-4">
                  <p className="font-semibold text-gray-800 text-sm mb-1">{faq.q}</p>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-6 bg-teal-700 text-white text-center">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Ready for IT Support at Home in Hyderabad?
            </h2>
            <p className="text-teal-100 text-sm">
              Book a verified Geek in seconds. Same-day service. Transparent pricing.
            </p>
            <Link
              href="/categories"
              className="self-center bg-white text-teal-700 font-semibold px-10 py-3 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Book a Geek Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
