// Server-side blog data layer for Server Components (no Redux).
import { cache } from "react";
import { fetchServerApi } from "@/utils/serverApi";
import Blog, { BlogTag, BlogCategory } from "@/utils/Blog";

export const getAllBlogsServer = cache(async (): Promise<Blog[]> => {
  const data = await fetchServerApi<Blog[]>("blogs/");
  const published = (data ?? []).filter((b) => b.isPublished !== false);
  return published.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

export const getBlogBySlugServer = cache(
  (slug: string): Promise<Blog | null> => fetchServerApi<Blog>(`blogs/${slug}`)
);

export const getTagsServer = cache(async (): Promise<BlogTag[]> => {
  return (await fetchServerApi<BlogTag[]>("blogs/tags")) ?? [];
});

export const getCategoriesServer = cache(async (): Promise<BlogCategory[]> => {
  return (await fetchServerApi<BlogCategory[]>("blogs/categories")) ?? [];
});
