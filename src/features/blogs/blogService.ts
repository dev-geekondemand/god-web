import api from "@/utils/api";

const getAllBlogs = async () => {
    const response = await api.get(`blogs/`);
    return response.data;
};

const getBlogFromSlug = async (slug: string) => {
    const response = await api.get(`blogs/${slug}`);
    return response.data;
}

const getTags = async () => {
    const response = await api.get(`blogs/tags`);
    return response.data;
};

const getCategories = async () => {
    const response = await api.get(`blogs/categories`);
    return response.data;
};

export const blogService = { getAllBlogs, getBlogFromSlug, getTags, getCategories };
