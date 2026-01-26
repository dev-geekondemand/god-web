import { Category } from "./Category";
import { Image } from "./Service";

export default interface Brand {
    _id: string;
    id: string;
    name: string;
    slug: string
    category:Category
    description: string;
    image: Image;
}