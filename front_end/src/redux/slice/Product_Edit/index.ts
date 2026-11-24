import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ProductEdit/type';
import { Product_Field } from '@src/data_struct/product';

const initialState: state_props = {
    product: undefined,

    // status
    create_status: 'end',
};

const Product_Edit_Slice = createSlice({
    name: 'Product_Edit_Slice',
    initialState,
    reducers: {
        set__product: (state, action: PayloadAction<Product_Field>) => {
            state.product = action.payload;
        },

        // status
        set__create_status: (state, action: PayloadAction<'begin' | 'end'>) => {
            state.create_status = action.payload;
        },
    },
});

export const { set__product, set__create_status } = Product_Edit_Slice.actions;
export default Product_Edit_Slice.reducer;
