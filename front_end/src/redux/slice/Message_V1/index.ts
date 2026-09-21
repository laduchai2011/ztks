import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Message_V1/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Message_V1_Field, Call_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    chat_room: undefined,
    zalo_oa: undefined,
    replied_message: undefined,
    change_chat_room_master_dialog: {
        is_show: false,
    },
    call_dialog: {
        is_show: true,
    },
    uid: '',
};

const Message_V1_Slice = createSlice({
    name: 'Message_V1_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__data__chat_room: (state, action: PayloadAction<Chat_Room_Field>) => {
            state.chat_room = action.payload;
        },
        set__zalo_oa: (state, action: PayloadAction<Zalo_Oa_Field>) => {
            state.zalo_oa = action.payload;
        },
        set__replied_message: (
            state,
            action: PayloadAction<Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type> | undefined>
        ) => {
            state.replied_message = action.payload;
        },
        set__is_show__change_chat_room_master_dialog: (state, action: PayloadAction<boolean>) => {
            state.change_chat_room_master_dialog.is_show = action.payload;
        },
        set__is_show__call_dialog: (state, action: PayloadAction<boolean>) => {
            state.call_dialog.is_show = action.payload;
        },
        set_uid: (state, action: PayloadAction<string>) => {
            state.uid = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__data__chat_room,
    set__zalo_oa,
    set__replied_message,
    set__is_show__change_chat_room_master_dialog,
    set__is_show__call_dialog,
    set_uid,
} = Message_V1_Slice.actions;
export default Message_V1_Slice.reducer;
