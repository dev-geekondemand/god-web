import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { categoryService } from "./categoryService";



export const getCategories = createAsyncThunk('category/get', async (__,thunkAPI) => {
    try{
        const response = await categoryService.getCategories();
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const getCategoryById = createAsyncThunk('category/get-by-id', async (id: string,thunkAPI) => {
    try{
        const response = await categoryService.getCategoryById(id);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

interface CategoryState {
    categories: Array<object>,
    category: object,
    isPending : boolean,
    isError : boolean,
    isSuccess : boolean,
    errorMessage :  string | undefined
}


const initialState : CategoryState = {
    categories: [],
    category: {},
    isPending : false,
    isError : false,
    isSuccess : false,
    errorMessage : ''
}

const categorySlice = createSlice({
    name: 'category',
    initialState:initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(getCategories.pending, (state) => {
            state.isPending = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(getCategories.fulfilled, (state, action) => {
            state.isPending = false;
            state.isSuccess = true;
            state.isError = false;
            state.categories = action.payload;
        })
        .addCase(getCategories.rejected, (state, action) => {
            state.isPending = false;
            state.isError = true;
            state.isSuccess = false;
            state.errorMessage = action.error.message;
        }).addCase(getCategoryById.pending, (state) => {
            state.isPending = true;
            state.isError = false;
            state.isSuccess = false;
        }).addCase(getCategoryById.fulfilled, (state, action) => {
            state.isPending = false;
            state.isSuccess = true;
            state.isError = false;
            state.category = action.payload;
        }).addCase(getCategoryById.rejected, (state, action) => {
            state.isPending = false;
            state.isError = true;
            state.isSuccess = false;
            state.errorMessage = action.error.message;
        })
    }
})

export default categorySlice.reducer;