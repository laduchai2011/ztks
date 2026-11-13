import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ProductCodeCreate/type';
import { Image_Field, Video_Field } from '@src/data_struct/product';

const initialState: state_props = {
    create_status: 'end',

    is_basic_info: false,
    is_detail_info: false,
    is_upload_images: false,
    is_upload_videos: false,

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
};

const Product_Code_Create_Slice = createSlice({
    name: 'Product_Code_Create_Slice',
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
} = Product_Code_Create_Slice.actions;
export default Product_Code_Create_Slice.reducer;
