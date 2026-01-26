import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enquiryService } from "./enquiryService";

export interface EnquiryState {
    isLoading: boolean;
    isError: string | null;
    isSuccess: boolean;
    message: string | null;
    enquiries: object[];
    enquiry: object | null;
    isEnquiryCreated: boolean;
    isEnquiryUpdated: boolean;
    isEnquiryDeleted: boolean;
}

const initialState: EnquiryState = {
    isLoading: false,
    isError: null,
    isSuccess: false,
    message: null,
    enquiries: [],    
    enquiry: null,
    isEnquiryCreated: false,    
    isEnquiryUpdated: false,
    isEnquiryDeleted: false,
};

interface EnquiryData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export const createEnquiry = createAsyncThunk(
    "enquiry/createEnquiry",
    async (enquiryData: EnquiryData, thunkAPI) => {
        try {
            const response = await enquiryService.sendEnquiry(enquiryData);
            return response;
        } catch (error) {
            if (error) {
                return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
            } else {
                return thunkAPI.rejectWithValue('An unknown error occurred');
            }
        }
    }
);

const enquirySlice = createSlice({
    name: "enquiry",
    initialState,
    reducers: {
        resetEnquiryState: (state) => {
            state.isLoading = false;
            state.isError = null;
            state.isSuccess = false;
            state.message = null;
            state.isEnquiryCreated = false;
            state.isEnquiryUpdated = false;
            state.isEnquiryDeleted = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEnquiry.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
                state.isSuccess = false;
                state.message = null;
                state.isEnquiryCreated = false;
            })
            .addCase(createEnquiry.fulfilled, (state) => {
                state.isLoading = false;
                state.isError = null;
                state.isSuccess = true;
                state.message = null;
                state.isEnquiryCreated = true;
            })
            .addCase(createEnquiry.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload as string;
                state.isSuccess = false;
                state.message = null;
                state.isEnquiryCreated = false;
            });
    }
});

export const { resetEnquiryState } = enquirySlice.actions;
export default enquirySlice.reducer;