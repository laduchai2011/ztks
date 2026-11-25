import { Product_Code_Field, Product_Field } from '@src/data_struct/product';
import { Image_Field } from '@src/data_struct/image';
import { Video_Field } from '@src/data_struct/video';
import { Store_Field } from '@src/data_struct/shop';

export interface state_props {
    product?: Product_Field;

    create_status: 'begin' | 'end';

    is_basic_infor: boolean;
    is_detail_infor: boolean;
    is_upload_images: boolean;
    is_upload_videos: boolean;
    is_product_code_infor: boolean;
    is_store_infor: boolean;
    is_amount_infor: boolean;
    is_price_infor: boolean;
    is_lock_infor: boolean;

    basic_infor: {
        name: string;
        description: string;
    };
    detail_infor: {
        detail: string;
    };
    upload_images: {
        urls: Image_Field[];
    };
    upload_videos: {
        urls: Video_Field[];
    };
    product_code_infor: {
        product_code?: Product_Code_Field;
    };
    store_infor: {
        store?: Store_Field;
    };
    amount_infor: {
        amount: number;
    };
    price_infor: {
        price: number;
        is_compelled_price: boolean;
    };

    lock_infor: {
        is_lock: boolean;
    };
}
