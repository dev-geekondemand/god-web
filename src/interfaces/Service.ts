import { Category } from "./Category";
import Geek from "./Geek";

export interface Address {
  pin?: string;
  city: string;
  state: string;
  country?: string;
  line1: string;
  line2?: string;
  line3?: string;
}

export interface Image {
  public_id: string;
  url?: string;
}

export interface ServiceOverview {
  description: string;
  benefits: string[];
  faqs: string[];
}

export interface Rating {
    stars:number;
    comment:string
    postedBy:string
    replies:[]
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  price: number;
  overview: ServiceOverview;
  category: Category;
  timesRequested: number;
  brands: string[];
  tags: string[];
  totalRating: string;
  createdBy: Geek;
  images: Image[];
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  video: Image;
}


export interface ServiceAr {
  total: number;
  page: number;
  pages: number;
  services: Service[];
}
