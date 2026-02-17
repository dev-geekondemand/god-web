"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Providers = dynamic(() => import('../components/Geeks'), { ssr: false }); // disable SSR

const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Providers /> 
    </Suspense>
  );
};

export default Page;
