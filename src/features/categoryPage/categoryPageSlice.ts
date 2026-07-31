import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { categoryPageService } from "./categoryPageService";
import { CategoryPageData } from "@/utils/categoryPage";

export const getCategoryPages = createAsyncThunk('categoryPage/get', async (_, thunkAPI) => {
    try {
        return await categoryPageService.getCategoryPages();
    } catch (error) {
        if (error) {
            return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
        } else {
            return thunkAPI.rejectWithValue('An unknown error occurred');
        }
    }
});

export const getCategoryPageBySlug = createAsyncThunk('categoryPage/get-by-slug', async (slug: string, thunkAPI) => {
    try {
        return await categoryPageService.getCategoryPageBySlug(slug);
    } catch (error) {
        if (error) {
            return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
        } else {
            return thunkAPI.rejectWithValue('An unknown error occurred');
        }
    }
});

const initialState = {
    pages: [] as CategoryPageData[],
    page: null as CategoryPageData | null,
    isSuccess: false,
    isLoading: false,
    isError: false,
    error: ''
}

const categoryPageSlice = createSlice({
    name: "categoryPage",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategoryPages.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(getCategoryPages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.pages = action.payload;
            })
            .addCase(getCategoryPages.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.pages = [];
                state.error = 'Something went wrong';
            })
            .addCase(getCategoryPageBySlug.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(getCategoryPageBySlug.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.page = action.payload;
            })
            .addCase(getCategoryPageBySlug.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.page = null;
                state.error = 'Something went wrong';
            })
    }
});

export default categoryPageSlice.reducer
