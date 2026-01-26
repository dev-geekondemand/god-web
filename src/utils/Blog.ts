interface Blog {
    id: string;
    slug: string;
    title: string;
    summary: string;
    description: string;
    coverImage: {
        public_id: string;
        url: string;
    }
    createdAt: string;
    updatedAt: string;
    author:string
}

export default Blog