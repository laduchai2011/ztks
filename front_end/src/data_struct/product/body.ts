import { Image_Field, Video_Field } from '.';

export interface Create_Product_Code_Body_Field {
    name: string;
    description: string;
    detail: string;
    account_id: string;
    images: Image_Field[];
    videos: Video_Field[];
}

export interface Create_Product_Body_Field {
    name: string;
    description: string;
    detail: string;
    quantity: number;
    store_id: string;
    product_code_id: string;
    account_id: string;
    note: string;
    images: Image_Field[];
    videos: Video_Field[];
}

export interface Edit_Product_Body_Field {
    id: string;
    name: string;
    description: string;
    detail: string;
    account_id: string;
    images: Image_Field[];
    videos: Video_Field[];
}
