import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Wallet/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Wallet_Field, Require_Take_Money_Field } from '@src/data_struct/wallet';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    take_money_dialog: {
        is_show: false,
        wallet: undefined,
        required_take_money: undefined,
        new_require_take_money: undefined,
    },
};

const Wallet_Slice = createSlice({
    name: 'Wallet_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__is_show__take_money_dialog: (state, action: PayloadAction<boolean>) => {
            state.take_money_dialog.is_show = action.payload;
        },
        set__wallet__take_money_dialog: (state, action: PayloadAction<Wallet_Field | undefined>) => {
            state.take_money_dialog.wallet = action.payload;
        },
        set__required_take_money__take_money_dialog: (
            state,
            action: PayloadAction<Require_Take_Money_Field | undefined>
        ) => {
            state.take_money_dialog.required_take_money = action.payload;
        },
        set__new_require_take_money__take_money_dialog: (
            state,
            action: PayloadAction<Require_Take_Money_Field | undefined>
        ) => {
            state.take_money_dialog.new_require_take_money = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__is_show__take_money_dialog,
    set__wallet__take_money_dialog,
    set__required_take_money__take_money_dialog,
    set__new_require_take_money__take_money_dialog,
} = Wallet_Slice.actions;
export default Wallet_Slice.reducer;
