export interface Banner {
  _id: string;
  title: string;
  image: {
    url: string;
    publicId?: string;
  };
  link?: string;
  position: "inner" | "cta-left" | "cta-right";
  width: number;
  height: number;
  isActive: boolean;
  createdAt: string;
}

export default Banner;
