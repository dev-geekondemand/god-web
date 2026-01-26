import api from "@/utils/api";



const getCategories = async () => {
    const response = await api.get(`category/`);
    return response.data;
};

const getCategoryById = async (id: string) => {
    const response = await api.get(`category/${id}`);
    return response.data;
};




 export const categoryService = {
    getCategories,
    getCategoryById
}