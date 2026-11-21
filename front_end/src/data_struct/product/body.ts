import { Image_Field } from '../image';
import { Video_Field } from '../video';

export interface Create_Product_Code_Body_Field {
    name: string;
    description: string;
    detail: string;
    account_id: string;
    images: Image_Field[];
    videos: Video_Field[];
}

export interface Upsert_Product_Code_Total_Body_Field {
    active_total: number;
    deleted_total: number;
    admin_account_id: string;
}

export interface Create_Product_Body_Field {
    name: string;
    description: string;
    detail: string;
    quantity: number;
    is_compelled_price: boolean;
    unit_price: number;
    store_id: string;
    product_code_id: string;
    account_id: string;
    images: Image_Field[];
    videos: Video_Field[];
}

export interface Upsert_Product_Total_Body_Field {
    active_total: number;
    deleted_total: number;
    admin_account_id: string;
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

export interface Fluctuation_For_Create_Product_Body_Field {
    quantity: number;
    images: Image_Field[];
    videos: Video_Field[];
    product_id: string;
    account_id: string;
}

export interface Product_Code_Search_Body_Field {
    from: number;
    size: number;
    search_content: string;
    account_id: string;
}

export interface Get_Product_Code_By_Id_Body_Field {
    id: string;
}

export interface Get_Product_Code_Total_Body_Field {
    admin_account_id: string;
}

export interface Get_Product_Total_Body_Field {
    admin_account_id: string;
}
