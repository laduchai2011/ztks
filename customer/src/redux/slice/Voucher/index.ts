import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Voucher/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { GetVouchersBodyField } from '@src/dataStruct/voucher/body';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    getVouchersBody: undefined,
};

const VoucherSlice = createSlice({
    name: 'VoucherSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_getVouchersBody: (state, action: PayloadAction<GetVouchersBodyField>) => {
            state.getVouchersBody = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, set_getVouchersBody } = VoucherSlice.actions;
export default VoucherSlice.reducer;
