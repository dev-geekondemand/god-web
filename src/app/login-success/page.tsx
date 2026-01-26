"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import your client component
const LoginSuccess = dynamic(() => import('../components/LoginSuccess'), { ssr: false });

const LoginSuccessPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginSuccess />
    </Suspense>
  );
};

export default LoginSuccessPage;
