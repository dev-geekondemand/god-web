// features/media/mediaSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadMedia } from './mediaService';
import toast from 'react-hot-toast';

interface MediaState {
  loading: boolean;
  success: boolean;
  media: unknown;
  error: string | null;
  progress: number;
}

interface UploadMediaArg {
  requestId: string;
  formData: FormData;
}

const initialState: MediaState = {
  loading: false,
  success: false,
  error: null,
  media: null,
  progress: 0,
};

export const uploadMediaThunk = createAsyncThunk<
  unknown,
  UploadMediaArg,
  { rejectValue: string }
>('media/uploadMedia', async (arg, { rejectWithValue, dispatch }) => {
  try {
    const data = await uploadMedia( arg.requestId, arg.formData, (percent) => {
      dispatch(setProgress(percent));
    });
    return data;
  }catch (error) {
    if (error) {
      console.log((error as { response: { data: unknown } }).response?.data);
      
      return rejectWithValue(((error as { response: { data: { message: string } } }).response?.data?.message || "") as string);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
  }
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setProgress(state, action) {
      state.progress = action.payload;
    },
    resetMediaState(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.progress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadMediaThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.progress = 0;
      })
      .addCase(uploadMediaThunk.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.progress = 100;
        state.media = action.payload;
        toast.success('Media uploaded successfully');
      })
      .addCase(uploadMediaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Upload failed';
        state.progress = 0;
         toast.error((action.payload as { message: string })?.message|| 'Upload failed');
      });
  },
});

export const { setProgress, resetMediaState } = mediaSlice.actions;
export default mediaSlice.reducer;
