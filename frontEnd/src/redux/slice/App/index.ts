import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/App/type';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';

const initialState: state_props = {
    id_isNewMessage_current: -1, // bỏ
    account: undefined,
    accountInformation: undefined,
    myAdmin: undefined,
    zaloApp: undefined,
    calling: {
        is: false,
        uid: undefined,
    },
    call: {
        inState: CallInStateEnum.CALL_END,
        outState: CallOutStateEnum.CALL_END,
    },
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
        set_calling: (state, action: PayloadAction<{ is: boolean; uid?: string }>) => {
            state.calling = action.payload;
        },
    },
});

export const {
    set_id_isNewMessage_current,
    set_account,
    set_accountInformation,
    set_myAdmin,
    set_zaloApp,
    set_calling,
} = AppSlice.actions;
export default AppSlice.reducer;
