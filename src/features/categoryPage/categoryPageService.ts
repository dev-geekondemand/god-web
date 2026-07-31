import api from "@/utils/api";

const getCategoryPages = async () => {
    const response = await api.get(`category-page/`);
    return response.data;
};

const getCategoryPageBySlug = async (slug: string) => {
    const response = await api.get(`category-page/slug/${slug}`);
    return response.data;
};

export const categoryPageService = { getCategoryPages, getCategoryPageBySlug };
