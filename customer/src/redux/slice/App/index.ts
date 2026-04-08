import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/App/type';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField } from '@src/dataStruct/zalo';

const initialState: state_props = {
    id_isNewMessage_current: -1, // bỏ
    account: undefined,
    accountInformation: undefined,
    myAdmin: undefined,
    zaloApp: undefined,
};

const AppSlice = createSlice({
    name: 'AppSlice',
    initialState,
    reducers: {
        set_id_isNewMessage_current: (state, action: PayloadAction<number>) => {
            state.id_isNewMessage_current = action.payload;
        },
        set_account: (state, action: PayloadAction<AccountField>) => {
            state.account = action.payload;
        },
        set_accountInformation: (state, action: PayloadAction<AccountInformationField>) => {
            state.accountInformation = action.payload;
        },
        set_myAdmin: (state, action: PayloadAction<number>) => {
            state.myAdmin = action.payload;
        },
        set_zaloApp: (state, action: PayloadAction<ZaloAppField>) => {
            state.zaloApp = action.payload;
        },
    },
});

export const { set_id_isNewMessage_current, set_account, set_accountInformation, set_myAdmin, set_zaloApp } =
    AppSlice.actions;
export default AppSlice.reducer;
