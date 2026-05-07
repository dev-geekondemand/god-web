import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import subscriptionService, { CheckoutData, SubscriptionData } from "./subscriptionService";
import toast from "react-hot-toast";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const createSubscriptionOrder = createAsyncThunk(
  'subscription/create',
  async (plan: 'Advance' | 'Professional', thunkAPI) => {
    try {
      return await subscriptionService.createSubscription(plan);
    } catch (err) {
      return thunkAPI.rejectWithValue((err as { response: { data: unknown } }).response?.data);
    }
  }
);

export const verifySubscriptionPayment = createAsyncThunk(
  'subscription/verify',
  async (data: { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string }, thunkAPI) => {
    try {
      return await subscriptionService.verifyPayment(data);
    } catch (err) {
      return thunkAPI.rejectWithValue((err as { response: { data: unknown } }).response?.data);
    }
  }
);

export const cancelMySubscription = createAsyncThunk(
  'subscription/cancel',
  async (_, thunkAPI) => {
    try {
      return await subscriptionService.cancelSubscription();
    } catch (err) {
      return thunkAPI.rejectWithValue((err as { response: { data: unknown } }).response?.data);
    }
  }
);

export const switchPlan = createAsyncThunk(
  'subscription/changePlan',
  async (newPlan: string, thunkAPI) => {
    try {
      return await subscriptionService.changePlan(newPlan);
    } catch (err) {
      return thunkAPI.rejectWithValue((err as { response: { data: unknown } }).response?.data);
    }
  }
);

export const getMySubscription = createAsyncThunk(
  'subscription/getMe',
  async (_, thunkAPI) => {
    try {
      return await subscriptionService.getMySubscription();
    } catch (err) {
      return thunkAPI.rejectWithValue((err as { response: { data: unknown } }).response?.data);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

interface SubscriptionState {
  subscription: SubscriptionData | null;
  pendingCheckout: CheckoutData | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: SubscriptionState = {
  subscription: null,
  pendingCheckout: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearPendingCheckout(state) {
      state.pendingCheckout = null;
    },
    resetSuccess(state) {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // getMySubscription
      .addCase(getMySubscription.pending, (state) => { state.isLoading = true; })
      .addCase(getMySubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload;
      })
      .addCase(getMySubscription.rejected, (state) => { state.isLoading = false; })

      // createSubscriptionOrder — store the checkout data so the component can open Razorpay
      .addCase(createSubscriptionOrder.pending, (state) => { state.isLoading = true; state.isError = false; })
      .addCase(createSubscriptionOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingCheckout = action.payload;
      })
      .addCase(createSubscriptionOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = (action.payload as { message: string })?.message || 'Failed to create subscription';
        toast.error(state.message);
      })

      // verifySubscriptionPayment
      .addCase(verifySubscriptionPayment.pending, (state) => { state.isLoading = true; })
      .addCase(verifySubscriptionPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pendingCheckout = null;
        if (state.subscription) {
          state.subscription.plan = action.payload.plan;
          state.subscription.status = 'active';
          if (action.payload.currentPeriodEnd) {
            state.subscription.currentPeriodEnd = action.payload.currentPeriodEnd;
          }
        } else {
          state.subscription = {
            _id: '',
            plan: action.payload.plan,
            status: 'active',
            currentPeriodEnd: action.payload.currentPeriodEnd,
          };
        }
      })
      .addCase(verifySubscriptionPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error((action.payload as { message: string })?.message || 'Payment verification failed');
      })

      // cancelMySubscription
      .addCase(cancelMySubscription.pending, (state) => { state.isLoading = true; })
      .addCase(cancelMySubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.subscription) state.subscription.cancelAtPeriodEnd = true;
        toast.success(action.payload?.message || 'Subscription cancelled.');
      })
      .addCase(cancelMySubscription.rejected, (state, action) => {
        state.isLoading = false;
        toast.error((action.payload as { message: string })?.message || 'Failed to cancel');
      })

      // switchPlan
      .addCase(switchPlan.pending, (state) => { state.isLoading = true; })
      .addCase(switchPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        // Upgrade returns a checkout payload; downgrade returns just a message
        if (action.payload?.subscriptionId) {
          state.pendingCheckout = action.payload;
        } else {
          toast.success(action.payload?.message || 'Plan change scheduled.');
        }
      })
      .addCase(switchPlan.rejected, (state, action) => {
        state.isLoading = false;
        toast.error((action.payload as { message: string })?.message || 'Failed to change plan');
      });
  },
});

export const { clearPendingCheckout, resetSuccess } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
