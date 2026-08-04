export interface BlogTag {
  _id: string;
  name: string;
  slug?: string;
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug?: string;
}

interface Blog {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImage: {
    public_id: string;
    url: string;
    alt?: string;
  };
  createdAt: string;
  updatedAt: string;
  author: string;
  tags?: (BlogTag | string)[];
  categories?: (BlogCategory | string)[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  isPublished?: boolean;
}

export default Blog;
