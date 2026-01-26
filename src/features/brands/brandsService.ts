import api from "@/utils/api";

interface Brand {
    name: string;
}

const getBrands = async () => {
    const response = await api.get(`brand/`);
    return response.data;
};

const createBrand = async (brand: Brand) => {
    const response = await api.post(`brand/`, brand);
    return response.data;
};


const getBrandsByCategory = async (categoryId: string) => {
    const response = await api.get(`brand/get-by-category/${categoryId}`);
    return response.data;
};



const brandsService = {
    getBrands,
    createBrand,
    getBrandsByCategory
};

export default brandsService