import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geekondemand.in";
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://god-backend.vercel.app"}/api`;

async function getApiKey(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/apikey/generate`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.apiKey ?? null;
  } catch {
    return null;
  }
}

async function fetchWithApiKey<T>(path: string, apiKey: string | null): Promise<T | null> {
  try {
    const headers: HeadersInit = apiKey ? { "x-api-key": apiKey } : {};
    const res = await fetch(`${API_URL}/${path}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faqs`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/founders-message`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/refund-and-cancellation-policy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/register`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/geeks`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/services`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/service-categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "daily", priority: 0.7 },
  ];

  const apiKey = await getApiKey();

  // Blogs
  const blogsData = await fetchWithApiKey<{ slug: string; updatedAt?: string }[]>("blogs/", apiKey);
  const blogRoutes: MetadataRoute.Sitemap = (blogsData ?? []).map((blog) => ({
    url: `${SITE_URL}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Service categories
  const categoriesData = await fetchWithApiKey<{ slug: string; updatedAt?: string }[]>("category/", apiKey);
  const categoryRoutes: MetadataRoute.Sitemap = (categoriesData ?? []).map((cat) => ({
    url: `${SITE_URL}/service-categories/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Geeks
  const geeksData = await fetchWithApiKey<{ _id: string; updatedAt?: string }[]>("geek/", apiKey);
  const geekRoutes: MetadataRoute.Sitemap = (geeksData ?? []).map((geek) => ({
    url: `${SITE_URL}/geeks/${geek._id}`,
    lastModified: geek.updatedAt ? new Date(geek.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Services
  type ServicesResponse = { services: { _id: string; updatedAt?: string }[] } | { _id: string; updatedAt?: string }[];
  const servicesData = await fetchWithApiKey<ServicesResponse>("service/", apiKey);
  const servicesList = Array.isArray(servicesData)
    ? servicesData
    : (servicesData as { services: { _id: string; updatedAt?: string }[] })?.services ?? [];
  const serviceRoutes: MetadataRoute.Sitemap = servicesList.map((service) => ({
    url: `${SITE_URL}/services/${service._id}`,
    lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes, ...geekRoutes, ...serviceRoutes];
}
