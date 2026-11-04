// utils/apiKey.ts
import axios from "axios";
import { url } from "@/utils/url";

let cachedApiKey: string | null = null;
let expiresAt: number = 0;

export const getApiKey = async () => {
  const now = Date.now();

  // If cached token exists and not expired, return it
  if (cachedApiKey && now < expiresAt) {
    return cachedApiKey;
  }

  // Otherwise, fetch a new token
  const response = await axios.get(`${url}apikey/generate`, { withCredentials: true });
  cachedApiKey = response.data.apiKey;

  if (cachedApiKey !== null) {
    // Decode expiration from JWT to know when it expires
  const payload = JSON.parse(atob(cachedApiKey.split(".")[1]));
  // JWT exp is in seconds; refresh 10s early so a key never expires in flight
  // or under client/server clock skew.
  expiresAt = payload.exp * 1000 - 10_000;
}


  return cachedApiKey;
};
