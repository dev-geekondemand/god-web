import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import {seekerService, UserData} from './seekerService';
import {toast} from 'react-hot-toast';
import User from '@/interfaces/Seeker';
import { Address } from '@/interfaces/Service';

export interface UserState {
  isAuthenticated: boolean;
  isPending : boolean;
  isError : boolean;
  isSuccess : boolean;
  errorMessage : string | undefined
  user: User | null
  token:string,
  isOTPSent : boolean
  isAddressUpdated : boolean
  isLoginOTP: boolean,
  isMailSent: boolean,
  isMailVerified: boolean
}

interface registerData {
    fullName : {
        first: string
        last: string
    },
    phone: string,
    otp:number,
    refCode: string
}

interface loginData {
    phone: string,
    otp:number,
}

const initialState: UserState = {
  user:null,
  token:"",
  isAuthenticated: false,
  isPending : false,
  isError : false,
  isSuccess : false,
  errorMessage : '',
  isAddressUpdated : false,
  isOTPSent : false,
  isLoginOTP: false,
  isMailSent: false,
  isMailVerified: false
};


export const getOtp = createAsyncThunk('user/get-otp', async (phone: string,thunkAPI) => {
    try{
      const response = await seekerService.getRegisterOTP(phone);   
        
      return response.data;
    }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
});

export const getLoginOTP = createAsyncThunk('user/get-login-otp', async (phone: string,thunkAPI) => {
  try{
    const response = await seekerService.getLoginOTP(phone);
    return response.data;
  }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
});


export const registerUser = createAsyncThunk('user/register', async (formdata:registerData,thunkAPI) => {
  try{
    const response = await seekerService.verifyRegisterOTP(formdata);
    console.log(response);
    
  return response.data;
  }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})


export const loginWithOTP = createAsyncThunk('user/login-with-otp', async (loginData: loginData,thunkAPI) => {
  try{
    const data = loginData;
    const response = await seekerService.verifyLoginOTP(data);
    
    return response.data;
  }catch (error) {
    if (error) {
      
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const loginWithGoogle = createAsyncThunk('user/login-with-google',async(__,thunkAPI)=>{
  try{
    const response = await seekerService.loginWithGoogle();
    return response.data;
  }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const loginWithMS = createAsyncThunk('user/login-with-ms',async(__,thunkAPI)=>{
  try{
    const response = await seekerService.loginWithMS();
    return response.data;
  }catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
})

export const loadUser = createAsyncThunk('user/load', async (_, thunkAPI) => {
  try {
    const res = await seekerService.getAuthStatus();
    return res.data;
  } catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
});

export const logoutUser = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    const res = await seekerService.logout();
    return res.data;
  } catch (error) {
    if (error) {
      return thunkAPI.rejectWithValue((error as { response: { data: unknown } }).response?.data || (error as Error).message);
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred');
      }
  }
});

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ id, address }: { id: string; address: Address }, thunkAPI) => {
    try {
      const updated = await seekerService.updateAddress(id, address);
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





export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (data: UserData, thunkAPI) => {
    try {
      const updated = await seekerService.updateUserProfile( data);
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
  'seeker/updateProfileImage',
  async ({ userId, image }: { userId: string; image: File }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', image);

      const res = await seekerService.updateProfileImage(userId, formData);

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);




export const sendVerificationMail = createAsyncThunk(
  "seeker/verify-email",
  async(userId:string,thunkAPI)=>{
    try{
      const response = await seekerService.sendVerificationMail(userId);
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
  "seeker/verify-mail",
  async(token:string,thunkAPI)=>{
    try{
      const response = await seekerService.verifyMail(token);
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



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers:{
    resetIsOtpSent: (state) => {
      state.isOTPSent = false;
    },
    resetIsAddressUpdated: (state) => {
      state.isAddressUpdated = false;
    },
    resetIsLoginOTP: (state) => {
      state.isLoginOTP = false;
    },
    resetIsMailSent: (state) => {
      state.isMailSent = false;
    },
    resetIsMailVerified: (state) => {
      state.isMailVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOtp.pending, (state) => {
          state.isPending = true;
          state.isError = false;
          state.isSuccess = false;
      })
      .addCase(getOtp.fulfilled, (state) => {
          state.isPending = false;
          state.isError = false;
          state.isSuccess = true;
          state.isOTPSent = true;
          toast.success('OTP sent.');
      })
      .addCase(getOtp.rejected, (state, action) => {
          state.isPending = false;
          state.isError = true;
          state.isSuccess = false;
          state.isOTPSent = false;
          state.errorMessage = action.error.message;
          toast.error('OTP sending failed.');
      })
           .addCase(registerUser.pending, (state) => {
          state.isPending = true;
          state.isError = false;
          state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
          state.isPending = false;
          state.isError = false;
          state.isSuccess = true;
          state.user = action.payload.user;
          toast.success('Registration successful');
          window.location.href = '/';
      })
      .addCase(registerUser.rejected, (state, action) => {
          state.isPending = false;
          state.isError = true;
          state.isSuccess = false;
          state.errorMessage = action.error.message;
          toast.error((action.payload as { message: string })?.message || 'Registration failed.');
      }).addCase(loginWithGoogle.pending, (state) => {
        state.isPending = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isPending = false;
        state.isError = false;
        state.isSuccess = true;
        state.token = action.payload;
        toast.success('Login with Google successful.');
        window.location.reload();
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
        toast.error('Login with Google failed.');
        window.location.href = '/login/seeker';
      }).addCase(loginWithMS.pending, (state) => {
        state.isPending = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
      }).addCase(loginWithMS.fulfilled, (state, action) => {
        state.isPending = false;
        state.isError = false;
        state.isSuccess = true;
        toast.success('Login with Microsoft successful.');
        state.token = action.payload;
        window.location.reload();
      }).addCase(loginWithMS.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
        toast.error('Login with Microsoft failed.');
        window.location.href = '/login/seeker';
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload?.fullName ? true : false;
        state.isError = false;
        state.isSuccess = true;
        state.isPending = false;
        state.user = action.payload;
        
      })
      .addCase(loadUser.pending, (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isPending = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage =  'Seeker not logged in';
        state.isPending = false;
        state.user = null;
      }).addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("userType");
        toast.success("Logged out successfully");
        window.location.href = "/";
        state.token = "";
        state.isAuthenticated = false;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
        state.isPending = false;
      }).addCase(logoutUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = "";
      }).addCase(getLoginOTP.pending, (state) => {
        state.isPending = true;
        state.isError = false;
        state.isSuccess = false;
      }).addCase(getLoginOTP.fulfilled, (state) => {
        state.isPending = false;
        state.isSuccess = true;
        state.isError = false;
        state.isLoginOTP = true;
        toast.success('OTP sent.');
      }).addCase(getLoginOTP.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.isLoginOTP = false;
        state.errorMessage = action.error.message;
        toast.error('Failed to send OTP.');
      }).addCase(loginWithOTP.pending, (state) => {
        state.isPending = true;
        state.isError = false;
        state.isSuccess = false;
      }).addCase(loginWithOTP.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSuccess = true;
        state.isError = false;
        state.token = action.payload;
        toast.success('Login successful.');
        window.location.reload();
      }).addCase(loginWithOTP.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
        toast.error((action.payload as { message: string })?.message   || 'Failed to login.',{
          position: 'top-center',
          style:{
            background: '#111',
            color: '#fff',
            marginTop: '50px'
          },
        });
      }).addCase(updateAddress.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSuccess = true;
        state.isError = false;
        state.isAddressUpdated = true;
        toast.success(action.payload?.message);
      }).addCase(updateAddress.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
        state.isAddressUpdated = false;
        toast.error('Failed to update address.');
      }).addCase(updateAddress.pending, (state) => {
        state.isPending = true;
        state.isError = false;
        state.isSuccess = false;

      }).addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload?.message);
      }).addCase(updateUserProfile.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
        toast.error('Failed to update profile.');
      }).addCase(updateUserProfile.pending, (state) => {
        state.isPending = true;
        state.isError = false;
        state.isSuccess = false;
      }).addCase(sendVerificationMail.pending, (state) => {
          state.isPending = true;
          state.isSuccess = false;
          state.isError = false;
      }).addCase(sendVerificationMail.fulfilled, (state, action) => {
          state.isPending = false;
          state.isSuccess = true;
          state.isError = false;
          state.isMailSent = true;
          state.errorMessage = action.payload?.message;
          toast.success(action.payload?.message);
      }).addCase(sendVerificationMail.rejected, (state, action) => {
          state.isPending = false;
          state.isError = true;
          state.isSuccess = false;
          state.errorMessage = action.error.message;
          toast.error(action.error.message as string);
      }).addCase(verifyMail.pending, (state) => {
          state.isPending = true;
          state.isSuccess = false;
          state.isError = false;
      }).addCase(verifyMail.fulfilled, (state, action) => {
          state.isPending = false;
          state.isSuccess = true;
          state.isError = false;
          state.isMailVerified = true;
          state.errorMessage = action.payload?.message;
      }).addCase(verifyMail.rejected, (state, action) => {
          state.isPending = false;
          state.isError = true;
          state.isSuccess = false;
          state.errorMessage = action.error.message;
          toast.error(action.error.message as string);
      }).addCase(updateProfileImage.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSuccess = true;
        state.isError = false;
        // state.user?.profileImage = action.payload;
        toast.success(action.payload?.message);
      }).addCase(updateProfileImage.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
        toast.error('Failed to update profile image.');
      }).addCase(updateProfileImage.pending, (state) => {
        state.isPending = true;
        state.isError = false;
        state.isSuccess = false;
      })
  },
});

export const {resetIsOtpSent,resetIsAddressUpdated,resetIsMailSent,resetIsMailVerified,resetIsLoginOTP} = userSlice.actions;
export default userSlice.reducer;
