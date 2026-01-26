// utils/api.ts
import axios from "axios";
import { url } from "@/utils/url";
import { getApiKey } from "./apiKey";

const api = axios.create({
  baseURL: url,
  withCredentials: true,
});

// Automatically attach API key
api.interceptors.request.use(async(config) => {
  const apiKey = await getApiKey();
  config.headers["x-api-key"] = apiKey;
  return config;
});

export default api;
