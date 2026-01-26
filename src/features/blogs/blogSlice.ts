import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { blogService } from "./blogService";


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


const initialState = {
    blogs: [],
    blog: null,
    currentBlog: null,
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
                state.blogs = action.payload;
            })
            .addCase(getAllBlogs.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.blogs = [];
                state.error = 'Something went wrong';
            }).addCase(getBlogFromSlug.pending, (state) => {
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
    }
});

export default blogSlice.reducer