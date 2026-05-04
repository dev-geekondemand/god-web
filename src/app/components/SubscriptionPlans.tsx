"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
  cancelMySubscription,
  switchPlan,
  getMySubscription,
  clearPendingCheckout,
} from "@/features/subscription/subscriptionSlice";
import { loadGeek } from "@/features/geek/geekSlice";
import toast from "react-hot-toast";

// ─── Razorpay types ───────────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void; on(e: string, cb: (r: unknown) => void): void };
  }
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

// ─── Plan definitions ─────────────────────────────────────────────────────────
const PLAN_RANK: Record<string, number> = { Startup: 0, Advance: 1, Professional: 2 };

const PLANS = [
  {
    name: "Startup" as const,
    price: 0,
    priceLabel: "Free",
    description: "Get started on the platform",
    highlight: false,
    features: [
      { label: "Basic public listing", yes: true },
      { label: "Built-in messaging", yes: true },
      { label: "Social media & website links", yes: false },
      { label: "Featured on homepage", yes: false },
      { label: "Top placement in categories", yes: false },
      { label: "Job alert notifications", yes: false },
      { label: "Verified badge", yes: false },
      { label: "Profile suggestion to buyers", yes: false },
      { label: "Direct email marketing", yes: false },
      { label: "24-hour priority support", yes: false },
    ],
    supportLabel: "Standard queue",
  },
  {
    name: "Advance" as const,
    price: 499,
    priceLabel: "₹499 / month",
    description: "For growing professionals",
    highlight: false,
    badge: "Popular",
    features: [
      { label: "Basic public listing", yes: true },
      { label: "Built-in messaging", yes: true },
      { label: "Social media & website links", yes: true },
      { label: "Featured on homepage", yes: true },
      { label: "Top placement in categories", yes: true },
      { label: "Job alert notifications", yes: true },
      { label: "Verified badge", yes: false },
      { label: "Profile suggestion to buyers", yes: false },
      { label: "Direct email marketing", yes: false },
      { label: "24-hour priority support", yes: false },
    ],
    supportLabel: "Within 3 working days",
  },
  {
    name: "Professional" as const,
    price: 999,
    priceLabel: "₹999 / month",
    description: "Maximum visibility & credibility",
    highlight: true,
    badge: "Best Value",
    features: [
      { label: "Basic public listing", yes: true },
      { label: "Built-in messaging", yes: true },
      { label: "Social media & website links", yes: true },
      { label: "Featured on homepage", yes: true },
      { label: "Top placement in categories", yes: true },
      { label: "Job alert notifications", yes: true },
      { label: "Verified badge", yes: true },
      { label: "Profile suggestion to buyers", yes: true },
      { label: "Direct email marketing", yes: true },
      { label: "24-hour priority support", yes: true },
    ],
    supportLabel: "24-hour priority",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SubscriptionPlans() {
  const dispatch = useAppDispatch();
  const geek = useSelector((state: RootState) => state.geek.geek);
  const subscription = useSelector((state: RootState) => state.subscription.subscription);
  const pendingCheckout = useSelector((state: RootState) => state.subscription.pendingCheckout);
  const isLoading = useSelector((state: RootState) => state.subscription.isLoading);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const currentPlan = (geek?.subscriptionPlan as string) || "Startup";

  useEffect(() => {
    dispatch(getMySubscription());
  }, [dispatch]);

  // When a pending checkout arrives (from switchPlan upgrade or createSubscriptionOrder), open Razorpay
  useEffect(() => {
    if (!pendingCheckout) return;
    openRazorpayCheckout(pendingCheckout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCheckout]);

  async function openRazorpayCheckout(checkout: { subscriptionId: string; razorpayKeyId: string; plan: string }) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Please refresh and try again.");
      dispatch(clearPendingCheckout());
      return;
    }

    const rzp = new window.Razorpay({
      key: checkout.razorpayKeyId,
      subscription_id: checkout.subscriptionId,
      name: "Geek on Demand",
      description: `${checkout.plan} Plan — Monthly Subscription`,
      image: "/assets/logo-big.webp",
      handler: async (response: RazorpayPaymentResponse) => {
        try {
          await dispatch(verifySubscriptionPayment(response)).unwrap();
          dispatch(loadGeek());
        } catch {
          // error toast handled by slice
        }
      },
      prefill: {
        name: geek ? `${geek.fullName.first} ${geek.fullName.last}` : "",
        email: geek?.email || "",
        contact: geek?.mobile || "",
      },
      theme: { color: "#0d9488" },
      modal: {
        ondismiss: () => {
          dispatch(clearPendingCheckout());
          setActionLoading(null);
        },
      },
    });

    rzp.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
      dispatch(clearPendingCheckout());
      setActionLoading(null);
    });

    rzp.open();
  }

  async function handleSubscribe(planName: "Advance" | "Professional") {
    setActionLoading(planName);
    try {
      await dispatch(createSubscriptionOrder(planName)).unwrap();
      // Razorpay opens via the pendingCheckout useEffect
    } catch {
      setActionLoading(null);
    }
  }

  async function handleChangePlan(newPlan: string) {
    setActionLoading(newPlan);
    try {
      await dispatch(switchPlan(newPlan)).unwrap();
      // If upgrade, pendingCheckout arrives and opens Razorpay
      // If downgrade, toast was shown by slice
      dispatch(loadGeek());
    } catch {
      // error handled by slice
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel() {
    setShowCancelConfirm(false);
    setActionLoading("cancel");
    try {
      await dispatch(cancelMySubscription()).unwrap();
      dispatch(loadGeek());
      dispatch(getMySubscription());
    } catch {
      // error handled by slice
    } finally {
      setActionLoading(null);
    }
  }

  function PlanButton({ plan }: { plan: typeof PLANS[number] }) {
    const isCurrent = currentPlan === plan.name;
    const isUpgrade = PLAN_RANK[plan.name] > PLAN_RANK[currentPlan];
    const isDowngrade = PLAN_RANK[plan.name] < PLAN_RANK[currentPlan];
    const loading = actionLoading === plan.name || (actionLoading === "cancel" && isCurrent);
    const pendingCancel = subscription?.cancelAtPeriodEnd && isCurrent;

    if (isCurrent && plan.name === "Startup") {
      return <span className="w-full py-2 text-sm text-center text-gray-400">Your current free plan</span>;
    }

    if (isCurrent && plan.name !== "Startup") {
      return (
        <div className="flex flex-col gap-2">
          {pendingCancel ? (
            <span className="w-full py-2 px-4 text-sm text-center rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200">
              Cancels at period end
            </span>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={!!actionLoading || isLoading}
              className="w-full py-2 px-4 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
              {loading ? "Cancelling…" : "Cancel Plan"}
            </button>
          )}
        </div>
      );
    }

    if (isUpgrade) {
      return (
        <button
          onClick={() => currentPlan === "Startup" ? handleSubscribe(plan.name as "Advance" | "Professional") : handleChangePlan(plan.name)}
          disabled={!!actionLoading || isLoading}
          className="w-full py-2 px-4 text-sm rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition disabled:opacity-50"
        >
          {loading ? "Processing…" : `Upgrade to ${plan.name}`}
        </button>
      );
    }

    if (isDowngrade) {
      return (
        <button
          onClick={() => handleChangePlan(plan.name)}
          disabled={!!actionLoading || isLoading}
          className="w-full py-2 px-4 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          {loading ? "Processing…" : `Downgrade to ${plan.name}`}
        </button>
      );
    }

    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Subscribed Geeks appear above free Geeks in search results.
          {subscription?.currentPeriodEnd && (
            <span className="ml-1 text-teal-600">
              Current period ends {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.
            </span>
          )}
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.name;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition ${
                plan.highlight
                  ? "border-teal-500 shadow-teal-100 shadow-md"
                  : isCurrent
                  ? "border-gray-400"
                  : "border-gray-200"
              }`}
            >
              {/* Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  plan.highlight ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {plan.name}
                </span>
                <div className="flex gap-1">
                  {"badge" in plan && (
                    <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-xs bg-teal-600 text-white font-medium px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">{plan.price === 0 ? "Free" : `₹${plan.price}`}</span>
                {plan.price > 0 && <span className="text-sm text-gray-400 ml-1">/ month</span>}
              </div>
              <p className="text-sm text-gray-500 mb-6">{plan.description}</p>

              {/* Feature list */}
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-sm">
                    {f.yes ? (
                      <svg className="w-4 h-4 mt-0.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mt-0.5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={f.yes ? "text-gray-700" : "text-gray-400"}>{f.label}</span>
                  </li>
                ))}
              </ul>

              {/* Support note */}
              <p className="text-xs text-gray-400 mb-4">Support: {plan.supportLabel}</p>

              {/* CTA */}
              <PlanButton plan={plan} />
            </div>
          );
        })}
      </div>

      {/* Cancel confirmation dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel subscription?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your current plan stays active until the end of the billing period. After that your profile reverts to the free Startup plan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Keep plan
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
