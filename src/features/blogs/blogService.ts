import api from "@/utils/api";

const getAllBlogs = async () => {
    const response = await api.get(`blogs/`);
    return response.data;
};

const getBlogFromSlug = async (slug: string) => {
    const response = await api.get(`blogs/${slug}`);
    return response.data;
}

export const blogService = { getAllBlogs, getBlogFromSlug };