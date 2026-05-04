import api from "@/utils/api";

export interface SubscriptionData {
  _id: string;
  plan: 'Startup' | 'Advance' | 'Professional';
  status: 'created' | 'active' | 'paused' | 'cancelled' | 'none';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  pendingPlan?: string;
  failedPaymentCount?: number;
}

export interface CheckoutData {
  subscriptionId: string;
  razorpayKeyId: string;
  plan: string;
  amount: number;
}

const createSubscription = async (plan: 'Advance' | 'Professional'): Promise<CheckoutData> => {
  const res = await api.post('subscription/subscribe', { plan }, { withCredentials: true });
  return res.data;
};

const verifyPayment = async (data: {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}) => {
  const res = await api.post('subscription/verify', data, { withCredentials: true });
  return res.data;
};

const cancelSubscription = async () => {
  const res = await api.post('subscription/cancel', {}, { withCredentials: true });
  return res.data;
};

const changePlan = async (newPlan: string) => {
  const res = await api.put('subscription/change-plan', { newPlan }, { withCredentials: true });
  return res.data;
};

const getMySubscription = async (): Promise<SubscriptionData> => {
  const res = await api.get('subscription/me', { withCredentials: true });
  return res.data;
};

const subscriptionService = {
  createSubscription,
  verifyPayment,
  cancelSubscription,
  changePlan,
  getMySubscription,
};

export default subscriptionService;
