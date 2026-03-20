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
  title: "GeekOnDemand",
  description: "Your One-Stop Solution for Professional IT Services",
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
