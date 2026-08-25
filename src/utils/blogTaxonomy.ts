import { BlogTag, BlogCategory } from "@/utils/Blog";

// Blog.tags/categories may come back as populated objects or raw ID strings;
// resolve against the full list either way.
export function resolveTags(
  items: (BlogTag | string)[] | undefined,
  allTags: BlogTag[]
): BlogTag[] {
  return (items ?? [])
    .map((item) => (typeof item === "string" ? allTags.find((t) => t._id === item) : item))
    .filter((t): t is BlogTag => !!t && typeof t === "object" && !!t.name);
}

export function resolveCategories(
  items: (BlogCategory | string)[] | undefined,
  allCategories: BlogCategory[]
): BlogCategory[] {
  return (items ?? [])
    .map((item) => (typeof item === "string" ? allCategories.find((c) => c._id === item) : item))
    .filter((c): c is BlogCategory => !!c && typeof c === "object" && !!c.name);
}
