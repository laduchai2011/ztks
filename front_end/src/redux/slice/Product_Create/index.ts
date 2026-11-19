import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ProductCreate/type';
import { Product_Code_Field } from '@src/data_struct/product';
import { Image_Field } from '@src/data_struct/image';
import { Video_Field } from '@src/data_struct/video';
import { Store_Field } from '@src/data_struct/shop';

const initialState: state_props = {
    create_status: 'end',

    is_basic_info: false,
    is_detail_info: false,
    is_upload_images: false,
    is_upload_videos: false,
    is_product_code_infor: false,
    is_store_infor: false,
    is_amount_infor: false,
    is_price_infor: false,

    basic_info: {
        name: '',
        description: '',
    },
    detail_info: {
        detail: '',
    },
    upload_images: {
        urls: [],
    },
    upload_videos: {
        urls: [],
    },
    product_code_infor: {
        product_code: undefined,
    },
    store_infor: {
        store: undefined,
    },
    amount_infor: {
        amount: 0,
    },
    price_infor: {
        price: 0,
        is_compelled_price: false,
    },
};

const Product_Create_Slice = createSlice({
    name: 'Product_Create_Slice',
    initialState,
    reducers: {
        // status
        set__create_status: (state, action: PayloadAction<'begin' | 'end'>) => {
            state.create_status = action.payload;
        },

        // basic_info
        set__is_basic_info: (state, action: PayloadAction<boolean>) => {
            state.is_basic_info = action.payload;
        },
        set__basic_info: (state, action: PayloadAction<{ name: string; description: string }>) => {
            state.basic_info = action.payload;
        },

        // detail_info
        set__is_detail_info: (state, action: PayloadAction<boolean>) => {
            state.is_detail_info = action.payload;
        },
        set__detail_info: (state, action: PayloadAction<{ detail: string }>) => {
            state.detail_info = action.payload;
        },

        // upload_images
        set__is_upload_images: (state, action: PayloadAction<boolean>) => {
            state.is_upload_images = action.payload;
        },
        set__upload_images: (state, action: PayloadAction<{ urls: Image_Field[] }>) => {
            state.upload_images = action.payload;
        },

        // upload_videos
        set__is_upload_videos: (state, action: PayloadAction<boolean>) => {
            state.is_upload_videos = action.payload;
        },
        set__upload_videos: (state, action: PayloadAction<{ urls: Video_Field[] }>) => {
            state.upload_videos = action.payload;
        },

        // product_code
        set__is_product_code_infor: (state, action: PayloadAction<boolean>) => {
            state.is_product_code_infor = action.payload;
        },
        set__product_code_infor: (state, action: PayloadAction<Product_Code_Field>) => {
            state.product_code_infor.product_code = action.payload;
        },

        // store
        set__is_store_infor: (state, action: PayloadAction<boolean>) => {
            state.is_store_infor = action.payload;
        },
        set__store_infor: (state, action: PayloadAction<{ store: Store_Field }>) => {
            state.store_infor = action.payload;
        },

        // amount
        set__is_amount_infor: (state, action: PayloadAction<boolean>) => {
            state.is_amount_infor = action.payload;
        },
        set__amount_infor: (state, action: PayloadAction<{ amount: number }>) => {
            state.amount_infor = action.payload;
        },

        // price
        set__is_price_infor: (state, action: PayloadAction<boolean>) => {
            state.is_price_infor = action.payload;
        },
        set__price_infor: (state, action: PayloadAction<{ price: number; is_compelled_price: boolean }>) => {
            state.price_infor = action.payload;
        },
    },
});

export const {
    // status
    set__create_status,

    // basic_info
    set__is_basic_info,
    set__basic_info,

    // detail_info
    set__is_detail_info,
    set__detail_info,

    // upload_images
    set__is_upload_images,
    set__upload_images,

    // upload_videos
    set__is_upload_videos,
    set__upload_videos,

    // product_code
    set__is_product_code_infor,
    set__product_code_infor,

    // store
    set__is_store_infor,
    set__store_infor,

    // amount
    set__is_amount_infor,
    set__amount_infor,

    // price
    set__is_price_infor,
    set__price_infor,
} = Product_Create_Slice.actions;
export default Product_Create_Slice.reducer;
