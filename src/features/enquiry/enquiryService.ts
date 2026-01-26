
import api from "@/utils/api";


interface EnquiryData {
    name: string;
    email: string;
    phone: string;
    message: string;
}
const sendEnquiry = async (data: EnquiryData) => {
    const response = await api.post(`enquiry/`, data);
    return response.data;
}



export const enquiryService = {
    sendEnquiry,
}
