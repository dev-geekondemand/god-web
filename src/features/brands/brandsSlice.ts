import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import brandsService from "./brandsService";


interface Brand {
    name: string
}

export const getBrands = createAsyncThunk('brand/get', async (__,thunkAPI) => {
    try{
        const response = await brandsService.getBrands();
        
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const createBrand = createAsyncThunk('brand/create', async (brand:Brand,thunkAPI) => {
    try{
        const response = await brandsService.createBrand(brand);
        return response.data;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const getBrandsByCategory = createAsyncThunk('brand/get-by-category', async (categoryId: string,thunkAPI) => {
    try{
        const response = await brandsService.getBrandsByCategory(categoryId);
        console.log(response);
        
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

interface brandState {
    brands: Array<object>,
    brandsByCategory: {
        category: object,
        brands: Brand[]
    },
    isError: boolean,
    isLoading: boolean,
    isSuccess: boolean,
    message: string | undefined
}

const initialState: brandState = {
    brands: [],
    brandsByCategory: {
        category: {},
        brands: []
    },
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ''
}


export const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getBrands.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getBrands.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.brands = action.payload; 
        })
        .addCase(getBrands.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        })
        .addCase(createBrand.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createBrand.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.brands = action.payload;
        })
        .addCase(createBrand.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        }).addCase(getBrandsByCategory.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(getBrandsByCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.brandsByCategory = action.payload;
        })
        .addCase(getBrandsByCategory.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        })
    }
})

export default brandSlice.reducer

