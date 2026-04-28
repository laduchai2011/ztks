import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Message1/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    chatRoom: undefined,
    zaloOa: undefined,
    repliedMessage: undefined,
    changeChatRoomMasterDialog: {
        isShow: true,
    },
};

const MessageV1Slice = createSlice({
    name: 'MessageV1Slice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setData_chatRoom: (state, action: PayloadAction<ChatRoomField>) => {
            state.chatRoom = action.payload;
        },
        set_zaloOa: (state, action: PayloadAction<ZaloOaField>) => {
            state.zaloOa = action.payload;
        },
        set_repliedMessage: (state, action: PayloadAction<MessageV1Field<ZaloMessageType> | undefined>) => {
            state.repliedMessage = action.payload;
        },
        setIsShow_changeChatRoomMasterDialog: (state, action: PayloadAction<boolean>) => {
            state.changeChatRoomMasterDialog.isShow = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    setData_chatRoom,
    set_zaloOa,
    set_repliedMessage,
    setIsShow_changeChatRoomMasterDialog,
} = MessageV1Slice.actions;
export default MessageV1Slice.reducer;
