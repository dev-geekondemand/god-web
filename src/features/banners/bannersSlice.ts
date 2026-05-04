import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannersService from "./bannersService";

export interface Ad {
  _id: string;
  type: "top" | "inner";
  placement?: string;  // e.g. "home", "category", "profile"
  image: { url: string; public_id?: string };
  link?: string;
  width?: number;
  height?: number;
  startDate?: string;
  endDate?: string;
  stats?: { impressions: number; clicks: number };
  createdAt: string;
}

interface BannersState {
  innerAds: Ad[];
  allAds: Ad[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BannersState = {
  innerAds: [],
  allAds: [],
  isLoading: false,
  error: null,
};

export const getInnerAds = createAsyncThunk(
  "banners/getInner",
  async (placement: string | undefined, thunkAPI) => {
    try {
      return await bannersService.getInnerAds(placement);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch inner ads");
    }
  }
);

export const getAllAds = createAsyncThunk("banners/getAll", async (_, thunkAPI) => {
  try {
    return await bannersService.getAllAds();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch ads");
  }
});

export const createAd = createAsyncThunk(
  "banners/create",
  async (formData: FormData, thunkAPI) => {
    try {
      return await bannersService.createAd(formData);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create ad");
    }
  }
);

export const deleteAd = createAsyncThunk(
  "banners/delete",
  async (id: string, thunkAPI) => {
    try {
      await bannersService.deleteAd(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete ad");
    }
  }
);

const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInnerAds.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(getInnerAds.fulfilled, (state, action) => { state.isLoading = false; state.innerAds = action.payload; })
      .addCase(getInnerAds.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      .addCase(getAllAds.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(getAllAds.fulfilled, (state, action) => { state.isLoading = false; state.allAds = action.payload; })
      .addCase(getAllAds.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      .addCase(createAd.fulfilled, (state, action) => {
        if (action.payload.type === "inner") state.innerAds.unshift(action.payload);
        state.allAds.unshift(action.payload);
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.innerAds = state.innerAds.filter((a) => a._id !== action.payload);
        state.allAds = state.allAds.filter((a) => a._id !== action.payload);
      });
  },
});

export default bannersSlice.reducer;
