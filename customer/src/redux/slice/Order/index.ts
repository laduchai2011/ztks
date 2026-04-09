import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Order/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { GetOrdersWithPhoneBodyField } from '@src/dataStruct/order/body';
import { OrderField } from '@src/dataStruct/order';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    getOrdersWithPhoneBody: undefined,
    voucherDialog: {
        isShow: false,
        order: undefined,
    },
};

const OrderSlice = createSlice({
    name: 'OrderSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_getOrdersWithPhoneBody: (state, action: PayloadAction<GetOrdersWithPhoneBodyField>) => {
            state.getOrdersWithPhoneBody = action.payload;
        },
        setIsShow_voucherDialog: (state, action: PayloadAction<boolean>) => {
            state.voucherDialog.isShow = action.payload;
        },
        setOrder_voucherDialog: (state, action: PayloadAction<OrderField | undefined>) => {
            state.voucherDialog.order = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    set_getOrdersWithPhoneBody,
    setIsShow_voucherDialog,
    setOrder_voucherDialog,
} = OrderSlice.actions;
export default OrderSlice.reducer;
