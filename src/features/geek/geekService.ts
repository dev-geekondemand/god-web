import api from "@/utils/api";
// import { url } from "@/utils/url";
import { GeekFormData } from "@/interfaces/UpdateGeek";
import { Address } from "@/interfaces/Service";
import  { RateCard } from "@/interfaces/Geek";

interface registerData {
    fullName : {
        first: string
        last: string
    }
    mobile: string,
    primarySkill: string
    yoe: number
    type: string
    otp:number,
    refCode: string
    brandsServiced:string[]
}


const getGeeks = async () => {
    const response = await api.get(`geek/`);
    return response.data;
};

const createGeek = async(geek:registerData) => {
    const response = await api.post(`geek/`,geek,{withCredentials: true});
    return response.data;
};


const sendGeekOTP = async (phone: string) => {
    const response = await api.post(`geek/send-otp`,{phone:phone});
    return response.data;
};


const updateGeekDetails = async (id: string, data: Partial<GeekFormData>) => {
  const response = await api.put(`geek/${id}/update-details`, data, {
    withCredentials: true, // assuming you're using secure cookies
  });
  return response.data;
};


const loginGeek = async (data:{
    phone: string,
    otp: number
}) => {
    const response = await api.post(`geek/geek-login`,data,{withCredentials: true});
    return response.data;
  };

  const logoutGeek = async () => {
    const response = await api.post(`geek/geek-logout`, null, {
      withCredentials: true,
    });
    return response;
  }

const getAuthStatus = async()=>{
    const response = await api.get(`geek/me`, {
      withCredentials: true, // so cookies are sent
    });

    return response.data;
} 

// geekService.ts
 const searchGeeks = async (filters: unknown) => {
  if (typeof filters === 'object' && filters !== null) {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    const response = await api.get(`geek/search?${query}`);
    return response.data;
  } else {
    throw new Error('Invalid filters type');
  }
};

const getGeekById = async (id: string) => {
  const response = await api.get(`geek/findGeek/${id}`);
  return response.data;
};

const updateGeekAddress = async (id: string, address: Address) => {
  const response = await api.put(`geek/${id}/address`, address, {
    withCredentials: true
  });
  return response.data;
};


const verifyAdhaar = async (idNumber: string) => {
  const response = await api.put(`geek/verify-adhaar`, { idNumber }, {
    withCredentials: true
  });  
  return response;
};

const getVerificationStatus = async (requestId: string) => {
  const response = await api.get(`geek/aadhaar-status/${requestId}`, {
    withCredentials: true
  });
  return response;
};


const updateProfileImage = async (id: string, formData: FormData) => {
  const response = await api.post(`geek/${id}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
  return response.data;
};


const updateRateCard = async (id: string, data: RateCard[]) => {
  const response = await api.put(`geek/${id}/rate-card`, data, {
    withCredentials: true
  });
  return response.data;
};

const deleteRateCard = async (id: string,rateCardId: string) => {
  const response = await api.delete(`geek/${id}/rate-card/${rateCardId}`, {
    withCredentials: true
  });
  return response.data;
};

const sendVerificationMail = async(userId:string)=>{
  const response = await api.post(`geek/geek-email-verify`,{userId},{
    withCredentials:true
  });
  return response.data;
}

const verifyMail = async(token:string)=>{
  const response = await api.post(`geek/verify-email/${token}`,{},{
    withCredentials:true
  });
  return response.data;
}

const geekService = {
    getGeeks,
    createGeek,
    sendGeekOTP,
    getAuthStatus,
    loginGeek,
    updateGeekDetails,
    searchGeeks,
    getGeekById,
    verifyAdhaar,
    getVerificationStatus,
    logoutGeek,
    updateGeekAddress,
    updateProfileImage,
    updateRateCard,
    deleteRateCard,
    sendVerificationMail,
    verifyMail
}

export default geekService

