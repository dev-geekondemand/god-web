import api from "@/utils/api";

const getInnerAds = async (placement?: string) => {
  const response = await api.get("ad/inner", { params: placement ? { placement } : undefined });
  return response.data;
};

const getAllAds = async () => {
  const response = await api.get("ad/");
  return response.data;
};

const createAd = async (formData: FormData) => {
  const response = await api.post("ad/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const deleteAd = async (id: string) => {
  const response = await api.delete(`ad/${id}`);
  return response.data;
};

const bannersService = { getInnerAds, getAllAds, createAd, deleteAd };
export default bannersService;
