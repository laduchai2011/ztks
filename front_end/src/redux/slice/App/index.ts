import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/App/type';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    Call_In_State_Enum,
    Call_In_State_Type,
    Call_Out_State_Enum,
    Call_Out_State_Type,
    Call_In_Cmd_Enum,
    Call_Out_Cmd_Enum,
    Call_In_Cmd_Type,
    Call_Out_Cmd_Type,
} from '@src/data_struct/call';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    account: undefined,
    account_information: undefined,
    my_admin: undefined,
    zalo_app: undefined,
    call_dialog: {
        is_show: false,
        uid: undefined,
        chat_room_id: undefined,
        zalo_oa: undefined,
        zalo_user: undefined,
        call_in_cmd_type: Call_In_Cmd_Enum.EMPTY,
        call_out_cmd_type: Call_Out_Cmd_Enum.EMPTY,
        call_in_state: Call_In_State_Enum.CALL_END,
        call_out_state: Call_Out_State_Enum.CALL_END,
    },
};

const App_Slice = createSlice({
    name: 'App_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        // set_id_isNewMessage_current: (state, action: PayloadAction<number>) => {
        //     state.id_isNewMessage_current = action.payload;
        // },
        set__account: (state, action: PayloadAction<Account_Field>) => {
            state.account = action.payload;
        },
        set__account_information: (state, action: PayloadAction<Account_Information_Field>) => {
            state.account_information = action.payload;
        },
        set__my_admin: (state, action: PayloadAction<string>) => {
            state.my_admin = action.payload;
        },
        set__zalo_app: (state, action: PayloadAction<Zalo_App_Field>) => {
            state.zalo_app = action.payload;
        },
        set__is_show__call_dialog: (state, action: PayloadAction<boolean>) => {
            state.call_dialog.is_show = action.payload;
        },
        set__uid__call_dialog: (state, action: PayloadAction<string | undefined>) => {
            state.call_dialog.uid = action.payload;
        },
        set__chat_room_id__call_dialog: (state, action: PayloadAction<string | undefined>) => {
            state.call_dialog.chat_room_id = action.payload;
        },
        set__zalo_oa__call_dialog: (state, action: PayloadAction<Zalo_Oa_Field | undefined>) => {
            state.call_dialog.zalo_oa = action.payload;
        },
        set__zalo_user__call_dialog: (state, action: PayloadAction<Zalo_User_Field | undefined>) => {
            state.call_dialog.zalo_user = action.payload;
        },
        set__call_in_cmd_type__call_dialog: (state, action: PayloadAction<Call_In_Cmd_Type>) => {
            state.call_dialog.call_in_cmd_type = action.payload;
        },
        set__call_out_cmd_type__call_dialog: (state, action: PayloadAction<Call_Out_Cmd_Type>) => {
            state.call_dialog.call_out_cmd_type = action.payload;
        },
        set__call_in_state__call_dialog: (state, action: PayloadAction<Call_In_State_Type>) => {
            state.call_dialog.call_in_state = action.payload;
        },
        set__call_out_state__call_dialog: (state, action: PayloadAction<Call_Out_State_Type>) => {
            state.call_dialog.call_out_state = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    // set_id_isNewMessage_current,
    set__account,
    set__account_information,
    set__my_admin,
    set__zalo_app,
    set__is_show__call_dialog,
    set__uid__call_dialog,
    set__chat_room_id__call_dialog,
    set__zalo_oa__call_dialog,
    set__zalo_user__call_dialog,
    set__call_in_cmd_type__call_dialog,
    set__call_out_cmd_type__call_dialog,
    set__call_in_state__call_dialog,
    set__call_out_state__call_dialog,
} = App_Slice.actions;
export default App_Slice.reducer;
