export interface Image_Field {
    url: string;
}

export interface Video_Field {
    url: string;
    thumbnail: string;
}

export interface Product_Code_Field {
    id: string;
    name: string;
    description: string;
    detail: string;
    images: Image_Field[];
    videos: Video_Field[];
    is_delete: boolean;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Product_Field {
    id: string;
    name: string;
    description: string;
    detail: string;
    quantity_in: number;
    quantity_out: number;
    images: Image_Field[];
    videos: Video_Field[];
    is_compelled_price: boolean;
    unit_price: number;
    is_lock: boolean;
    is_delete: boolean;
    store_id: string;
    product_code_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Product_Fluctuation_Field {
    id: string;
    type: string;
    command: string;
    quantity: number;
    actual_quantity: number;
    note: string;
    images: Image_Field[];
    videos: Video_Field[];
    is_finish: boolean;
    is_delete: boolean;
    re_order_v1_id: string;
    order_v1_id: string;
    source_product_id: string;
    target_product_id: string;
    source_account_id: string;
    target_account_id: string;
    product_id: string;
    account_id: string;
    finish_time: string;
    update_time: string;
    create_time: string;
}
