import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props, Order_Status_Type_Type } from '@src/screen/Order/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Order_Field, Order_Status_Field } from '@src/data_struct/order';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    create_order: {
        new_order: undefined,
    },
    edit_order_dialog: {
        is_show: false,
        order: undefined,
        new_order: undefined,
    },
    pay_dialog: {
        is_show: false,
        order: undefined,
        new_order: undefined,
    },
    voucher_dialog: {
        is_show: false,
        order: undefined,
    },
    add_order_status_dialog: {
        is_show: false,
        order: undefined,
        new_order_status: undefined,
        default_order_status_type: undefined,
    },
};

const Order_Slice = createSlice({
    name: 'Order_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__new_order__create_order: (state, action: PayloadAction<Order_Field | undefined>) => {
            state.create_order.new_order = action.payload;
        },
        set__edit_order_dialog: (
            state,
            action: PayloadAction<{ is_show: boolean; order: Order_Field | undefined }>
        ) => {
            state.edit_order_dialog = action.payload;
        },
        set__final__edit_order_dialog: (
            state,
            action: PayloadAction<{ is_show: false; new_order: Order_Field | undefined }>
        ) => {
            state.edit_order_dialog = action.payload;
        },
        set__is_show__pay_dialog: (state, action: PayloadAction<boolean>) => {
            state.pay_dialog.is_show = action.payload;
        },
        set__order__pay_dialog: (state, action: PayloadAction<Order_Field | undefined>) => {
            state.pay_dialog.order = action.payload;
        },
        set__new_order__pay_dialog: (state, action: PayloadAction<Order_Field | undefined>) => {
            state.pay_dialog.new_order = action.payload;
        },
        set__is_show__voucher_dialog: (state, action: PayloadAction<boolean>) => {
            state.voucher_dialog.is_show = action.payload;
        },
        set__order__voucher_dialog: (state, action: PayloadAction<Order_Field | undefined>) => {
            state.voucher_dialog.order = action.payload;
        },
        set__add_order_status_dialog: (
            state,
            action: PayloadAction<{
                is_show: boolean;
                order?: Order_Field;
                default_order_status_type?: Order_Status_Type_Type;
            }>
        ) => {
            state.add_order_status_dialog = action.payload;
        },
        set__final__add_order_status_dialog: (
            state,
            action: PayloadAction<{ is_show: false; new_order_status: Order_Status_Field | undefined }>
        ) => {
            state.add_order_status_dialog = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__new_order__create_order,
    set__edit_order_dialog,
    set__final__edit_order_dialog,
    set__is_show__pay_dialog,
    set__order__pay_dialog,
    set__new_order__pay_dialog,
    set__is_show__voucher_dialog,
    set__order__voucher_dialog,
    set__add_order_status_dialog,
    set__final__add_order_status_dialog,
} = Order_Slice.actions;
export default Order_Slice.reducer;
