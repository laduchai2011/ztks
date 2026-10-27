import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Order_V1/type';
import { Order_V1_Field } from '@src/data_struct/order_v1';

const initialState: state_props = {
    // order_V1_detail
    is_show_order_v1_detail: false,
    order_v1_detail: undefined,

    // create_order_v1
    is_show_create_order_v1: false,
};

const Order_V1_Slice = createSlice({
    name: 'Order_V1_Slice',
    initialState,
    reducers: {
        // order_V1_detail
        set__is_show_order_v1_detail: (state, action: PayloadAction<boolean>) => {
            state.is_show_order_v1_detail = action.payload;
        },
        set__order_v1_detail: (state, action: PayloadAction<Order_V1_Field>) => {
            state.order_v1_detail = action.payload;
        },

        // create_order_v1
        set__is_show_create_order_v1: (state, action: PayloadAction<boolean>) => {
            state.is_show_create_order_v1 = action.payload;
        },
    },
});

export const {
    // order_V1_detail
    set__is_show_order_v1_detail,
    set__order_v1_detail,

    // create_order_v1
    set__is_show_create_order_v1,
} = Order_V1_Slice.actions;
export default Order_V1_Slice.reducer;
