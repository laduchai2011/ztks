import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/App/type';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';

const initialState: state_props = {
    id_isNewMessage_current: -1, // bỏ
    account: undefined,
    accountInformation: undefined,
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
    },
});

export const { set_id_isNewMessage_current, set_account, set_accountInformation } = AppSlice.actions;
export default AppSlice.reducer;
