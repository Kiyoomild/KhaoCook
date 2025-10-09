export interface Menu {
    id: string;
    title: string;
    image: string;
    catagory: string;
    ingredients: string[];
    steps: string[];
    createdAt: Date;
}

export interface MenuFormData {
    title: string;
    image: string;
    category: string;
    ingredients: string[];
    steps: string[];
}