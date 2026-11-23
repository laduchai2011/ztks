import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ProductDetail/type';
import { Product_Field } from '@src/data_struct/product';

const initialState: state_props = {
    product: undefined,
};

const Product_Detail_Slice = createSlice({
    name: 'Product_Detail_Slice',
    initialState,
    reducers: {
        set__product: (state, action: PayloadAction<Product_Field>) => {
            state.product = action.payload;
        },
    },
});

export const { set__product } = Product_Detail_Slice.actions;
export default Product_Detail_Slice.reducer;
