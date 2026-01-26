import { Address } from "@/interfaces/Service";
import { Review } from "@/interfaces/ServiceRequest";
import api from "@/utils/api";

export interface Request{
    category: string;
    geek: string;    
    issue: string;
    mode: string;
    location:Address;
}


const createRequest = async (request: Request) => {
    const response = await api.post(`request/create-request`, request, {
        withCredentials: true
    });
    return response.data;
};

const getGeekRequests = async () => {
    const response = await api.get(`request/geek-requests`, {
        withCredentials: true
    });
    return response.data;
};


const getSeekerRequests = async () => {
    const response = await api.get(`request/seeker-requests`, {
        withCredentials: true
    });
    return response.data;
}

const acceptRequest = async (id: string) => {
    const response = await api.post(`request/${id}/accept`, {}, {
        withCredentials: true
    });
    return response.data;
};

const rejectRequest = async (id: string) => {
    const response = await api.post(`request/${id}/reject`, {}, {
        withCredentials: true
    });
    return response.data;
};

const getRequestById = async (id: string) => {
    const response = await api.get(`request/${id}`, {
        withCredentials: true
    });
    return response.data;
};

const autoRejectRequest = async (id: string) => {
    const response = await api.put(`request/${id}/auto-reject`, {}, {
        withCredentials: true
    });
    return response.data;
};

const addSeekerReview = async (id: string, data: Partial<Review>) => {
    const response = await api.put(`request/${id}/add-seeker-review`, {data}, {
        withCredentials: true
    });
    return response.data;
};

const requestService = { 
    createRequest,
    getGeekRequests,
    acceptRequest,
    rejectRequest,
    getSeekerRequests,
    getRequestById,
    autoRejectRequest,
    addSeekerReview
 };


export default requestService;