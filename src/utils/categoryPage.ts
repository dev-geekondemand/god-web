export interface CategoryPageIcon {
  public_id?: string;
  url?: string;
}

export interface CategoryPageProblem {
  _id: string;
  title: string;
  icon?: CategoryPageIcon;
}

export interface CategoryPageFaq {
  question: string;
  answer: string;
}

export interface CategoryPageData {
  _id: string;
  category: { _id: string; title: string; slug: string,smallBanner?: { public_id: string; url: string; }, };
  slug: string;
  isPublished: boolean;
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    ctaText?: string;
    alt?: string;
    image?: CategoryPageIcon;
  };
  seo: {
    primaryKeyword?: string;
    secondaryKeywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    locationKeywords?: { area: string; keyword: string }[];
    nearMeKeywords?: string[];
    brandKeywords?: string[];
  };
  problems: CategoryPageProblem[];
  faqs: CategoryPageFaq[];
  updatedAt?: string;
}
