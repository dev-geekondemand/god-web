"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const VerifyOTP = dynamic(() => import('../components/VerifyOTP'), { ssr: false }); // disable SSR

const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyOTP />
    </Suspense>
  );
};

export default Page;
