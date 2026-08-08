import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/App/type';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloUserField } from '@src/dataStruct/zalo/user';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    id_isNewMessage_current: -1, // bỏ
    account: undefined,
    accountInformation: undefined,
    myAdmin: undefined,
    zaloApp: undefined,
    calling: {
        is: false,
        uid: undefined,
        chatRoomId: undefined,
        zaloOa: undefined,
        zaloUser: undefined,
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
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
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
        set_calling: (
            state,
            action: PayloadAction<{
                is: boolean;
                uid?: string;
                chatRoomId?: number;
                zaloOa?: ZaloOaField;
                zaloUser?: ZaloUserField;
            }>
        ) => {
            state.calling = action.payload;
        },
        set_callInState: (state, action: PayloadAction<CallInStateType>) => {
            state.call.inState = action.payload;
        },
        set_callOutState: (state, action: PayloadAction<CallOutStateType>) => {
            state.call.outState = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    set_id_isNewMessage_current,
    set_account,
    set_accountInformation,
    set_myAdmin,
    set_zaloApp,
    set_calling,
    set_callInState,
    set_callOutState,
} = AppSlice.actions;
export default AppSlice.reducer;
