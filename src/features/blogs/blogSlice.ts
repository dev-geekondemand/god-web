import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { blogService } from "./blogService";
import Blog from "@/utils/Blog";


export const getAllBlogs = createAsyncThunk('blog/get', async (__,thunkAPI) => {
    try{
        const response = await blogService.getAllBlogs();
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const getBlogFromSlug = createAsyncThunk('blog/get-by-slug', async (slug: string,thunkAPI) => {
    try{
        const response = await blogService.getBlogFromSlug(slug);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const getTags = createAsyncThunk('blog/get-tags', async (_, thunkAPI) => {
    try {
        return await blogService.getTags();
    } catch (error) {
        return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
    }
});

export const getCategories = createAsyncThunk('blog/get-categories', async (_, thunkAPI) => {
    try {
        return await blogService.getCategories();
    } catch (error) {
        return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
    }
});


const initialState = {
    blogs: [] as Blog[],
    blog: null,
    currentBlog: null,
    tags: [] as { _id: string; name: string; slug: string }[],
    categories: [] as { _id: string; name: string; slug: string }[],
    isSuccess : false,
    isLoading : false,
    isError : false,
    error: ''
}

 const blogSlice = createSlice({
    name: "blog",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBlogs.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(getAllBlogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.blogs = [...action.payload].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            })
            .addCase(getAllBlogs.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.blogs = [];
                state.error = 'Something went wrong';
            })
            .addCase(getBlogFromSlug.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(getBlogFromSlug.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.blog = action.payload;
            })
            .addCase(getBlogFromSlug.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.blog = null;
                state.error = 'Something went wrong';
            })
            .addCase(getTags.fulfilled, (state, action) => {
                state.tags = action.payload;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
    }
});

export default blogSlice.reducer
