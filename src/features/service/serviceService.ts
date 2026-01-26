import api from "@/utils/api";

interface serviceData{
    title: string,
    overview:{
        description: string,
        benefits: string[],
    },
    price: number,
    category: string,
    brands: string[],
}


const getServices = async () => {
    const response = await api.get(`service/`,{
        withCredentials: true
    });
    return response;
};

const getServiceById = async (id: string) => {
    const response = await api.get(`service/${id}`,{
        withCredentials: true
    });
    return response;
};

const createService = async (data: serviceData) => {
    const response = await api.post(`service/`, data, {
        withCredentials: true
    });
    return response;
};



export const serviceService = {
    getServices,
    createService,
    getServiceById
};