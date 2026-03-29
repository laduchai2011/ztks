import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props, orderStatusType_type } from '@src/screen/Order/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { OrderField, OrderStatusField } from '@src/dataStruct/order';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedOa: undefined,
    createOrder: {
        newOrder: undefined,
    },
    editOrderDialog: {
        isShow: false,
        order: undefined,
        newOrder: undefined,
    },
    payDialog: {
        isShow: false,
        order: undefined,
        newOrder: undefined,
    },
    addOrderStatusDialog: {
        isShow: false,
        order: undefined,
        newOrderStatus: undefined,
        defaultOrderStatusType: undefined,
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
        set_selectedOa: (state, action: PayloadAction<ZaloOaField>) => {
            state.selectedOa = action.payload;
        },
        setNewOrder_createOrder: (state, action: PayloadAction<OrderField | undefined>) => {
            state.createOrder.newOrder = action.payload;
        },
        set_editOrderDialog: (state, action: PayloadAction<{ isShow: boolean; order: OrderField | undefined }>) => {
            state.editOrderDialog = action.payload;
        },
        setFinal_editOrderDialog: (
            state,
            action: PayloadAction<{ isShow: false; newOrder: OrderField | undefined }>
        ) => {
            state.editOrderDialog = action.payload;
        },
        setIsShow_payDialog: (state, action: PayloadAction<boolean>) => {
            state.payDialog.isShow = action.payload;
        },
        setOrder_payDialog: (state, action: PayloadAction<OrderField | undefined>) => {
            state.payDialog.order = action.payload;
        },
        setNewOrder_payDialog: (state, action: PayloadAction<OrderField | undefined>) => {
            state.payDialog.newOrder = action.payload;
        },
        set_addOrderStatusDialog: (
            state,
            action: PayloadAction<{
                isShow: boolean;
                order?: OrderField;
                defaultOrderStatusType?: orderStatusType_type;
            }>
        ) => {
            state.addOrderStatusDialog = action.payload;
        },
        setFinal_addOrderStatusDialog: (
            state,
            action: PayloadAction<{ isShow: false; newOrderStatus: OrderStatusField | undefined }>
        ) => {
            state.addOrderStatusDialog = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    set_selectedOa,
    setNewOrder_createOrder,
    set_editOrderDialog,
    setFinal_editOrderDialog,
    setIsShow_payDialog,
    setOrder_payDialog,
    setNewOrder_payDialog,
    set_addOrderStatusDialog,
    setFinal_addOrderStatusDialog,
} = OrderSlice.actions;
export default OrderSlice.reducer;
