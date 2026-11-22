import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Product/type';

const initialState: state_props = {
    searched_product_ids: [],
};

const Product_Slice = createSlice({
    name: 'Product_Slice',
    initialState,
    reducers: {
        set__searched_product_ids: (state, action: PayloadAction<string[]>) => {
            state.searched_product_ids = action.payload;
        },
    },
});

export const { set__searched_product_ids } = Product_Slice.actions;
export default Product_Slice.reducer;
