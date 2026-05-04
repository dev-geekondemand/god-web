"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CorporateRegister = dynamic(() => import("../../components/CorporateRegister"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CorporateRegister />
    </Suspense>
  );
}
