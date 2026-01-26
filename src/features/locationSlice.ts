import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  city: string;
  loading: boolean;
  error: string | null;
  showPrompt: boolean;
}

const initialState: LocationState = {
  city: "",               // default empty
  loading: false,
  error: null,
  showPrompt: true,       // default true, can be updated on client
};


// Async thunk to fetch user location
export const fetchUserLocation = createAsyncThunk(
  "location/fetchUserLocation",
  async (_, { rejectWithValue }) => {
    if (!navigator.geolocation) {
      return rejectWithValue("Geolocation not supported");
    }

    return new Promise<string>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );
            const data = await res.json();
            const place =
              data.features.find((f: any) => f.place_type.includes("place")) ||
              data.features[0];

            const city = place?.text || "";
            localStorage.setItem("user_city", city);
            sessionStorage.setItem("location_prompt_shown", "true");

            resolve(city);
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(error)
      );
    });
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
      localStorage.setItem("user_city", action.payload);
    },
    setShowPrompt(state, action: PayloadAction<boolean>) {
      state.showPrompt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLocation.fulfilled, (state, action: PayloadAction<string>) => {
        state.city = action.payload;
        state.loading = false;
        state.showPrompt = false;
      })
      .addCase(fetchUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to detect location";
        state.showPrompt = false;
      });
  },
});

export const { setCity, setShowPrompt } = locationSlice.actions;
export default locationSlice.reducer;
