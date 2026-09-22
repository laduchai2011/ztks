import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/AccountReceiveMessage/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Account_Receive_Message_Field } from '@src/data_struct/account';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    selected_oa: undefined,
    account_receive_message: undefined,
};

const Account_Receive_Message_Slice = createSlice({
    name: 'Account_Receive_Message_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__selected_oa: (state, action: PayloadAction<Zalo_Oa_Field>) => {
            state.selected_oa = action.payload;
        },
        set__account_receive_message: (state, action: PayloadAction<Account_Receive_Message_Field>) => {
            state.account_receive_message = action.payload;
        },
    },
});

export const { set__is_loading, set__data__toast_message, set__selected_oa, set__account_receive_message } =
    Account_Receive_Message_Slice.actions;
export default Account_Receive_Message_Slice.reducer;
