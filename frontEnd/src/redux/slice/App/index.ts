import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/App/type';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import {
    CallInStateEnum,
    CallInStateType,
    CallOutStateEnum,
    CallOutStateType,
    CallInCmdEnum,
    CallOutCmdEnum,
    CallInCmdType,
    CallOutCmdType,
} from '@src/dataStruct/call';
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
    callDialog: {
        isShow: false,
        uid: undefined,
        chatRoomId: undefined,
        zaloOa: undefined,
        zaloUser: undefined,
        callInCmdType: CallInCmdEnum.EMPTY,
        callOutCmdType: CallOutCmdEnum.EMPTY,
        callInState: CallInStateEnum.CALL_END,
        callOutState: CallOutStateEnum.CALL_END,
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
        // set_id_isNewMessage_current: (state, action: PayloadAction<number>) => {
        //     state.id_isNewMessage_current = action.payload;
        // },
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
        setIsShow_callDialog: (state, action: PayloadAction<boolean>) => {
            state.callDialog.isShow = action.payload;
        },
        setUid_callDialog: (state, action: PayloadAction<string | undefined>) => {
            state.callDialog.uid = action.payload;
        },
        setChatRoomId_callDialog: (state, action: PayloadAction<number | undefined>) => {
            state.callDialog.chatRoomId = action.payload;
        },
        setZaloOa_callDialog: (state, action: PayloadAction<ZaloOaField | undefined>) => {
            state.callDialog.zaloOa = action.payload;
        },
        setZaloUser_callDialog: (state, action: PayloadAction<ZaloUserField | undefined>) => {
            state.callDialog.zaloUser = action.payload;
        },
        setCallInCmdType_callDialog: (state, action: PayloadAction<CallInCmdType>) => {
            state.callDialog.callInCmdType = action.payload;
        },
        setCallOutCmdType_callDialog: (state, action: PayloadAction<CallOutCmdType>) => {
            state.callDialog.callOutCmdType = action.payload;
        },
        setCallInState_callDialog: (state, action: PayloadAction<CallInStateType>) => {
            state.callDialog.callInState = action.payload;
        },
        setCallOutState_callDialog: (state, action: PayloadAction<CallOutStateType>) => {
            state.callDialog.callOutState = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    // set_id_isNewMessage_current,
    set_account,
    set_accountInformation,
    set_myAdmin,
    set_zaloApp,
    setIsShow_callDialog,
    setUid_callDialog,
    setChatRoomId_callDialog,
    setZaloOa_callDialog,
    setZaloUser_callDialog,
    setCallInCmdType_callDialog,
    setCallOutCmdType_callDialog,
    setCallInState_callDialog,
    setCallOutState_callDialog,
} = AppSlice.actions;
export default AppSlice.reducer;
