// Display names for subscription plans. The backend/API values stay as-is
// (e.g. "Advance"); only what users and geeks see is renamed here.
const PLAN_DISPLAY_NAMES: Record<string, string> = {
  Advance: "Pro Geek",
};

export const planDisplayName = (plan: string): string => PLAN_DISPLAY_NAMES[plan] ?? plan;

// Backend messages embed the raw plan name; swap in display names before showing them.
export const withPlanDisplayNames = (text: string): string =>
  text.replace(/\b(Advance)\b/g, (plan) => planDisplayName(plan));
