import api from "@/utils/api";
import { Address } from "@/interfaces/Service";


interface registerData {
    fullName : {
        first: string
        last: string
    }
    phone: string,
    otp:number,
    refCode: string
}

interface loginData {
    phone: string,
    otp:number
}

export interface UserData {
    fullName : {
        first: string
        last: string
    }
    email: string
    phone: string
}

const getRegisterOTP = async (phone: string) => {

    const response = await api.post(`seeker/custom/send-otp`, { phone });
    return response.data;
  
};


const verifyRegisterOTP = async (formdata:registerData) => {
    const response = await api.post(`seeker/custom/register`,formdata);
    return response;
};

const getLoginOTP = async (phone: string) => {
        const response = await api.post(`seeker/custom/send-otp`,{phone:phone}, {withCredentials: true});
        return response;
}

const verifyLoginOTP = async (data:loginData) => {
        const response = await api.post(`seeker/seeker-login`,data, {withCredentials: true});
        return response.data;
};

const loginWithGoogle = async () => {
        const response = await api.get(`seeker/google`,{
            withCredentials: true

        });
        return response.data;
};

const loginWithMS = async () => {
    const response = await api.get(`seeker/microsoft`, {
        withCredentials: true
    });

    return response.data;
}

const getAuthStatus = async()=>{
    const response = await api.get(`seeker/me`, {
      withCredentials: true, // so cookies are sent
    });
    
    return response;
}

const logout = async()=>{
    return await api.post(`seeker/logout`, null, {
    withCredentials: true,
  });
}

const updateAddress = async (id: string, address: Address) => {
  const response = await api.put(`seeker/${id}/address`, address, {
    withCredentials: true
  });
  return response.data;
};


const updateUserProfile = async ( data: UserData) => {
  const response = await api.put(`seeker/update-profile`, data, {
    withCredentials: true,
  });
  return response.data;
};


const sendVerificationMail = async(userId:string)=>{
  const response = await api.post(`seeker/verify-mail`,{userId},{
    withCredentials:true
  });
  return response.data;
}

const verifyMail = async(token:string)=>{
  const response = await api.post(`seeker/verify-mail/${token}`,{},{
    withCredentials:true
  });
  return response.data;
}


const updateProfileImage = async (userId: string, formData: FormData) => {
  
  const response = await api.post(`seeker/${userId}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return response.data;
};



export const seekerService = {
    getRegisterOTP,
    verifyRegisterOTP,
    loginWithGoogle,
    getAuthStatus,
    logout,
    loginWithMS,
    getLoginOTP,
    verifyLoginOTP,
    updateAddress,
    updateUserProfile,
    sendVerificationMail,
    verifyMail,
    updateProfileImage
};

