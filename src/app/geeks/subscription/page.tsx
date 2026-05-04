"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SubscriptionPlans = dynamic(
  () => import("../../components/SubscriptionPlans"),
  { ssr: false }
);

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="w-full py-20 text-center text-gray-400 text-sm">Loading…</div>}>
      <SubscriptionPlans />
    </Suspense>
  );
}
