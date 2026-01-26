import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import geekService from "./geekService";
import {toast} from "react-hot-toast";
import { GeekFormData } from "@/interfaces/UpdateGeek";
import { Address } from "@/interfaces/Service";
import Geek, { RateCard } from "@/interfaces/Geek";


interface RegisterGeekData{
    fullName : {
        first: string
        last: string
    }
    mobile: string
    otp:number,
    type: string
    primarySkill: string
    yoe: number,
    refCode: string,
    brandsServiced:string[]
}


export const getGeeks = createAsyncThunk('geek/get', async (__,thunkAPI) => {
    try{
        const response = await geekService.getGeeks();
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }

})

export const sendGeekOTP = createAsyncThunk('geek/send-otp', async (phone: string,thunkAPI) => {
    try{
        const response = await geekService.sendGeekOTP(phone);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const createGeek = createAsyncThunk('geek/create', async (geek:RegisterGeekData,thunkAPI) => {
    try{
        const response = await geekService.createGeek(geek);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const loginGeek = createAsyncThunk('geek/login', async (geek:{phone: string,otp: number},thunkAPI) => {
    try{
        const response = await geekService.loginGeek(geek);
        return response;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const loadGeek = createAsyncThunk('geek/load', async (_, thunkAPI) => {
  try {
    const res = await geekService.getAuthStatus(); 
    return res;
  } catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
});

export const updateGeekProfile = createAsyncThunk(
  "geek/updateGeekProfile",
  async ({ id, data }: { id: string; data: Partial<GeekFormData> }, thunkAPI) => {
    try {
      const updated = await geekService.updateGeekDetails(id, data);
      return updated;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
);

export const searchGeeks = createAsyncThunk(
  'geeks/fetchWithFilters',
  async (filters: unknown, thunkAPI) => {
    try {
      const data = await geekService.searchGeeks(filters);
      return data;
    } catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
);


export const getGeekById = createAsyncThunk(
  'geeks/fetchById',
  async (id: string, thunkAPI) => {
    try {
      const data = await geekService.getGeekById(id);
      return data;
    } catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
);


export const verifyAdhaar = createAsyncThunk(
  'geeks/verifyAdhaar',
  async (idNumber: string, thunkAPI) => {
    try {
      const response = await geekService.verifyAdhaar(idNumber);
      return response.data;
    } catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
);


export const verificationStatus = createAsyncThunk(
  'geeks/verifyAdhaar/status',
  async (requestId: string, thunkAPI) => {
    try {
      const response = await geekService.getVerificationStatus(requestId);
      return response.data;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
)

export const logoutGeek = createAsyncThunk('geek/logout', async (_, thunkAPI) => {
  try {
    const res = await geekService.logoutGeek();
    return res.data;
  } catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const updateAddress = createAsyncThunk(
  "geek/updateAddress",
  async ({ id, address }: { id: string; address: Address }, thunkAPI) => {
    try {
      const updated = await geekService.updateGeekAddress(id, address);
      return updated;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
)

export const updateProfileImage = createAsyncThunk(
  "geek/updateProfileImage",
  async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
    try {
      const updated = await geekService.updateProfileImage(id, formData);
      return updated;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
)

export const updateRateCard = createAsyncThunk(
  "geek/updateRateCard",
  async ({ id, data }: { id: string; data: RateCard[] }, thunkAPI) => {
    try {
      const updated = await geekService.updateRateCard(id, data);
      return updated;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
)

export const deleteRateCard = createAsyncThunk(
  "geek/deleteRateCard",
  async ({ id, rateCardId }: { id: string; rateCardId: string }, thunkAPI) => {
    try {
      const updated = await geekService.deleteRateCard(id, rateCardId);
      return updated;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
  }
)

export const sendVerificationMail = createAsyncThunk(
  "geek/verify-email",
  async(userId:string,thunkAPI)=>{
    try{
      const response = await geekService.sendVerificationMail(userId);
      return response;
    }catch(error){
      if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
    }
  }
)


export const verifyMail = createAsyncThunk(
  "geek/verify-mail",
  async(token:string,thunkAPI)=>{
    try{
      const response = await geekService.verifyMail(token);
      return response;
    }catch(error){
      if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
    }
  }
)

export interface GeekInitialState {
    geeks: Array<Geek> | [];
    geek: Geek | null;
    geekById: object;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string | undefined;
    isAuthenticated: boolean;
    isOTPSent: boolean,
    isProfileUpdated: boolean,
    isRateCardUpdated: boolean,
    isRateCardDeleted: boolean,
    isMailSent: boolean,
    isMailVerified: boolean
}

const initialState: GeekInitialState = {
    geeks: [],
    geek: null,
    geekById: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    isOTPSent: false,
    isAuthenticated: false,
    isProfileUpdated: false,
    isRateCardUpdated: false,
    isRateCardDeleted: false,
    isMailSent: false,
    isMailVerified: false
}

const geekSlice = createSlice({
    name: 'geek',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getGeeks.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(getGeeks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.geeks = action.payload;
        })
        .addCase(getGeeks.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        })
        .addCase(sendGeekOTP.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(sendGeekOTP.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isOTPSent = true;
            state.isError = false;
            state.isOTPSent = true;
            state.geek = action.payload;
            toast.success('OTP sent.');
        })
        .addCase(sendGeekOTP.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isOTPSent = false;
            state.isSuccess = false;
            state.isOTPSent = false;
            state.message = action.error.message;
            toast.error((action.payload as { message: string })?.message|| 'Failed to send OTP.');
        }).addCase(loadGeek.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.geek = action.payload;
            state.isError = false;
            state.isSuccess = true;
            state.isLoading = false;
            })
            .addCase(loadGeek.pending, (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = true;
            })
            .addCase(loadGeek.rejected, (state) => {
            state.isAuthenticated = false;
            state.geek = null;
            state.message = 'Geek not logged In';
            state.isError = true;
            state.isSuccess = false;
            state.isLoading = false;
        }).addCase(createGeek.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(createGeek.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.geek = action.payload;
            toast.success('Registration successful.');
            state.isAuthenticated = true;
            window.location.href = '/';
        }).addCase(createGeek.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
           state.message = (action.payload as { message: string })?.message;
            toast.error((action.payload as { message: string })?.message || 'Registration failed.');
        }).addCase(loginGeek.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(loginGeek.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.geek = action.payload;
            toast.success('Geek logged in.');
            state.isAuthenticated = true;
            window.location.href = '/';
        }).addCase(loginGeek.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = (action.payload as { message: string })?.message;
            toast.error((action.payload as { message: string })?.message || 'Login failed.');
        }).addCase(updateGeekProfile.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(updateGeekProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.isProfileUpdated = true;
            toast.success('Geek profile updated.');
            state.geek = action.payload;
        })
        .addCase(updateGeekProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.isProfileUpdated = false;
            toast.error('Geek profile update failed.');
            state.message = action.payload as string;
        }).addCase(searchGeeks.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(searchGeeks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.geeks = action.payload;
        })
        .addCase(searchGeeks.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.geeks = [];
            state.message = action.error.message;
        }).addCase(getGeekById.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        }).addCase(getGeekById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.geekById = action.payload;
        }).addCase(getGeekById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        }).addCase(verifyAdhaar.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        }).addCase(verifyAdhaar.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = action.payload?.message;
            toast.success(action.payload?.message);
        }).addCase(verifyAdhaar.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error((action.payload as { message: string })?.message);
        }).addCase(verificationStatus.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        }).addCase(verificationStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = action.payload?.message;
        }).addCase(verificationStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        }).addCase(logoutGeek.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(logoutGeek.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            toast.success('Geek logged out.');
            state.isAuthenticated = false;
            window.location.href = '/';
        }).addCase(logoutGeek.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error('Geek logout failed.');
        }).addCase(updateAddress.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(updateAddress.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = action.payload?.message;
            toast.success(action.payload?.message);
        }).addCase(updateAddress.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        }).addCase(updateProfileImage.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(updateProfileImage.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = action.payload?.message;
            toast.success(action.payload?.message);
            window.location.reload();
        }).addCase(updateProfileImage.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            toast.error("Image upload failed. Try with another image.");
            state.message = action.error.message;
        }).addCase(updateRateCard.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(updateRateCard.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.isRateCardUpdated = true;
            state.message = action.payload?.message;
        }).addCase(updateRateCard.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error(action.error.message as string);
        }).addCase(deleteRateCard.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(deleteRateCard.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.isRateCardDeleted = true;
            state.message = action.payload?.message;
        }).addCase(deleteRateCard.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error(action.error.message as string);
        }).addCase(sendVerificationMail.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(sendVerificationMail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.isMailSent = true;
            state.message = action.payload?.message;
        }).addCase(sendVerificationMail.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error(action.error.message as string);
        }).addCase(verifyMail.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        }).addCase(verifyMail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.isMailVerified = true;
            state.message = action.payload?.message;
        }).addCase(verifyMail.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            toast.error(action.error.message as string);
        })
    }
})

export default geekSlice.reducer

