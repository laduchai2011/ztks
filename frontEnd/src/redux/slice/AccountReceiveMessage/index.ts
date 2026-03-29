import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/AccountReceiveMessage/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { AccountReceiveMessageField } from '@src/dataStruct/account';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedOa: undefined,
    accountReceiveMessage: undefined,
};

const AccountReceiveMessageSlice = createSlice({
    name: 'AccountReceiveMessageSlice',
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
        set_accountReceiveMessage: (state, action: PayloadAction<AccountReceiveMessageField>) => {
            state.accountReceiveMessage = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, set_selectedOa, set_accountReceiveMessage } =
    AccountReceiveMessageSlice.actions;
export default AccountReceiveMessageSlice.reducer;
