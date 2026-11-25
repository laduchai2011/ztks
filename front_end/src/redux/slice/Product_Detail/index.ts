import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ProductDetail/type';
import { Product_Field } from '@src/data_struct/product';
import { Image_Field } from '@src/data_struct/image';
import { Video_Field } from '@src/data_struct/video';

const initialState: state_props = {
    product: undefined,
    is_show_delete_product_dialog: false,

    is_show_image: false,
    showed_images: [],

    is_show_video: false,
    showed_videos: [],
};

const Product_Detail_Slice = createSlice({
    name: 'Product_Detail_Slice',
    initialState,
    reducers: {
        set__product: (state, action: PayloadAction<Product_Field>) => {
            state.product = action.payload;
        },
        set__is_show_delete_product_dialog: (state, action: PayloadAction<boolean>) => {
            state.is_show_delete_product_dialog = action.payload;
        },

        set__is_show_image: (state, action: PayloadAction<boolean>) => {
            state.is_show_image = action.payload;
        },
        set__showed_images: (state, action: PayloadAction<Image_Field[]>) => {
            state.showed_images = action.payload;
        },

        set__is_show_video: (state, action: PayloadAction<boolean>) => {
            state.is_show_video = action.payload;
        },
        set__showed_videos: (state, action: PayloadAction<Video_Field[]>) => {
            state.showed_videos = action.payload;
        },
    },
});

export const {
    set__product,
    set__is_show_delete_product_dialog,
    set__is_show_image,
    set__showed_images,
    set__is_show_video,
    set__showed_videos,
} = Product_Detail_Slice.actions;
export default Product_Detail_Slice.reducer;
