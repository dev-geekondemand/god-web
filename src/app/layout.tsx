import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import CustomCursor from "./components/CustomCursor";
import ReduxProvider from '../lib/Provider';
import AuthInitializer from "./components/AuthInitializer";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import GlobalLoader from "./components/GlobalLoader";
import Head from "next/head";
import Script from "next/script";



const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ['400','500','700']
});


export const metadata: Metadata = {
  title: "GeekOnDemand – On-Demand IT Tech Support & Repair at Home",
  description: "GeekOnDemand is India's first on-demand IT tech support platform. Book verified Geeks for laptop repair, printer, router, software, antivirus & more — anytime, anywhere, at your doorstep.",
  alternates: {
    canonical: "https://geekondemand.in/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/vercel.svg" />
      </Head>
      <body
        className={`${robotoMono.variable} ${robotoMono.variable} antialiased`}
      >
        <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-0RR8QZQ3CZ"
      strategy="afterInteractive"
    />

    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-0RR8QZQ3CZ');
      `}
    </Script>

    <Script id="schema-org" type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "GeekOnDemand Pvt Ltd",
          "url": "https://www.geekondemand.in",
          "logo": "https://www.geekondemand.in/logo.png",
          "description": "Your One-Stop Solution for Professional IT Services — 24/7 tech support, laptop & desktop repair, software, networking, cloud, and cybersecurity services across India.",
          "telephone": "+918374374117",
          "email": "hello@geekondemand.in",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Level 1, Suite # 11, Tourism Plaza, Begumpet, Greenlands",
            "addressLocality": "Hyderabad",
            "addressRegion": "Telangana",
            "postalCode": "500016",
            "addressCountry": "IN"
          },
          "sameAs": [
            "https://www.facebook.com/geekondemand",
            "https://www.instagram.com/geekondemandpvtltd/",
            "https://x.com/GeekOnDemandin",
            "https://www.youtube.com/@GeekOnDemandService",
            "https://www.linkedin.com/company/geekondemand-pvt-ltd/"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "GeekOnDemand Pvt Ltd",
          "image": "https://www.geekondemand.in/logo.png",
          "url": "https://www.geekondemand.in",
          "telephone": "+918374374117",
          "email": "hello@geekondemand.in",
          "priceRange": "$$",
          "description": "Professional on-demand IT services and tech support in Hyderabad and across India. Laptop repair, printer support, networking, cloud solutions, cybersecurity, and more.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Level 1, Suite # 11, Tourism Plaza, Begumpet, Greenlands",
            "addressLocality": "Hyderabad",
            "addressRegion": "Telangana",
            "postalCode": "500016",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 17.4400,
            "longitude": 78.4738
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "00:00",
            "closes": "23:59"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "IT Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laptop & Desktop Repair" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Printer Service & Repair" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Router & Networking Support" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Software Installation & Update" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Antivirus Installation & Support" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud Solutions" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cybersecurity Services" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Server Support" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "24/7 Remote Tech Support" } }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "GeekOnDemand",
          "url": "https://www.geekondemand.in",
          "description": "Your Trusted Partner for IT Solutions – 24/7, Anywhere in the World",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.geekondemand.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        }
      ])}
    </Script>
        <ReduxProvider>
        <Toaster position="top-right" />

          <AuthInitializer />
         <CustomCursor />
        <Navbar />
        <div className="w-full h-full min-h-screen relative">
          
        {children}

        <div className="absolute bottom-10 right-10">
          <GlobalLoader />
          <ScrollToTopButton />
        </div>
        </div> 
        <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
