import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requestService, { Request } from "./requestService";
import toast from "react-hot-toast";
import { Review, ServiceRequest } from "@/interfaces/ServiceRequest";


export const createRequest = createAsyncThunk('request/create', async (request: Request,thunkAPI) => {
    try{
        const response = await requestService.createRequest(request);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const getGeekRequests = createAsyncThunk('request/get', async ( __,thunkAPI) => {
    try{
        const response = await requestService.getGeekRequests();
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})


export const getSeekerRequests = createAsyncThunk('request/get/seeker', async ( __,thunkAPI) => {
    try{
        const response = await requestService.getSeekerRequests();
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const acceptRequest = createAsyncThunk('request/accept-request', async (id: string,thunkAPI) => {
    try{
        const response = await requestService.acceptRequest(id);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})


export const rejectRequest = createAsyncThunk('request/reject-request', async (id: string,thunkAPI) => {
    try{
        const response = await requestService.rejectRequest(id);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})


export const getRequestById = createAsyncThunk('request/get-by-id', async (id: string,thunkAPI) => {
    try{
        const response = await requestService.getRequestById(id);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})


export const autoRejectRequest = createAsyncThunk('request/auto-reject-request', async (id: string,thunkAPI) => {
    try{
        const response = await requestService.autoRejectRequest(id);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const addSeekerReview = createAsyncThunk('request/add-seeker-review', async (obj:{id:string,data:Partial<Review>},thunkAPI) => {
    try{
        const response = await requestService.addSeekerReview(obj.id,obj.data);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export interface ServiceState {
    requests: object[],
    request: ServiceRequest | null,
    isError: boolean,
    isRequestCreated: boolean
    isLoading: boolean,
    isSuccess: boolean,
    message: string | undefined;
}


const initialState: ServiceState = {
    requests: [],
    request:null,
    isRequestCreated: false,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ''
}

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createRequest.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.isRequestCreated = false;
        })
        .addCase(createRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.request = action.payload;
            state.isError = false;            
            state.isRequestCreated = true;
            toast.success("Request created successfully.");
        })
        .addCase(createRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.isRequestCreated = false;
            state.message = action.error.message;
            toast.error("Failed to create request.");
        }).addCase(getGeekRequests.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(getGeekRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.requests = action.payload;
        })
        .addCase(getGeekRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error("Failed to get requests.");
        }).addCase(getSeekerRequests.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(getSeekerRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.requests = action.payload;
        })
        .addCase(getSeekerRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error("Failed to get requests.");
        }).addCase(acceptRequest.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(acceptRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.request = action.payload;
            toast.success("Request accepted.");
        })
        .addCase(acceptRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error("Failed to accept request.");
        }).addCase(rejectRequest.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(rejectRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.request = action.payload;
            toast.success("Request rejected.");
        })
        .addCase(rejectRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error("Failed to reject request.");
        }).addCase(getRequestById.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(getRequestById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.request = action.payload;
        })
        .addCase(getRequestById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error("Failed to get request.");
        }).addCase(autoRejectRequest.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(autoRejectRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.request = action.payload;
            toast.success("Request status updated.");
        })
        .addCase(autoRejectRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error("Failed to auto reject request.");
        }).addCase(addSeekerReview.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(addSeekerReview.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = action.payload?.message;
            toast.success("Review added.");
        })
        .addCase(addSeekerReview.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error("Failed to add review.");
        })
    }
})


export default requestSlice.reducer