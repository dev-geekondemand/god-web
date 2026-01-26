import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceService } from "./serviceService";
import { Service } from "@/interfaces/Service";

interface serviceData{
    title: string,
    overview:{
        description: string,
        benefits: string[],
    },
    price: number,
    category: string ,
    brands: string[],
}

export const getServices = createAsyncThunk('service/get', async (__,thunkAPI) => {
    try{
        const response = await serviceService.getServices();
        return response.data;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})



export const getServiceById = createAsyncThunk('service/get-by-id', async (id: string,thunkAPI) => {
    try{
        const response = await serviceService.getServiceById(id);
        return response.data;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const createService = createAsyncThunk('service/create', async (data: serviceData,thunkAPI) => {
    try{
        const response = await serviceService.createService(data);
        return response.data;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})


export interface ServiceState{
    isLoading: boolean
    createdService: Service | null
    isError: boolean
    isSuccess: boolean
    message: string | undefined
    service: object
    services: Array<object>
}

const initialState: ServiceState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    createdService: null,
    message: '',
    service: {},
    services: []
}

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getServices.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getServices.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.services = action.payload;
        })
        .addCase(getServices.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        }).addCase(getServiceById.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(getServiceById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.service = action.payload;
        })
        .addCase(getServiceById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload as string;
        }).addCase(createService.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(createService.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.createdService = action.payload;
        }).addCase(createService.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload as string;
        })
    }
})

export default serviceSlice.reducer