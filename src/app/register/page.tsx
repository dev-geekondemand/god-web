"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Register = dynamic(() => import('../components/Register'), { ssr: false }); // disable SSR

const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Register />
    </Suspense>
  );
};

export default Page;