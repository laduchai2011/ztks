import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Message/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { MessageField } from '@src/dataStruct/message';

const initialState: state_props = {
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    playVideo: {
        isPlay: false,
        src: '',
    },
    messages: [],
};

const MessageSlice = createSlice({
    name: 'MessageSlice',
    initialState,
    reducers: {
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setData_playVideo: (state, action: PayloadAction<{ isPlay: boolean; src: string }>) => {
            state.playVideo = action.payload;
        },
        setData_messages: (state, action: PayloadAction<MessageField[]>) => {
            state.messages = action.payload;
        },
        loadData_messages: (state, action: PayloadAction<MessageField[]>) => {
            state.messages = action.payload.concat(state.messages);
        },
        addNew_message: (state, action: PayloadAction<MessageField>) => {
            state.messages = [action.payload, ...state.messages];
        },
        delA_message: (state, action: PayloadAction<{ id: number }>) => {
            state.messages = state.messages.filter((item) => item.id !== action.payload.id);
        },
        updateA_message: (state, action: PayloadAction<MessageField>) => {
            const new_mes = state.messages.filter((item) => item.id !== action.payload.id);
            new_mes.unshift(action.payload);
            state.messages = new_mes;
        },
    },
});

export const {
    setData_toastMessage,
    setData_playVideo,
    setData_messages,
    loadData_messages,
    addNew_message,
    delA_message,
    updateA_message,
} = MessageSlice.actions;
export default MessageSlice.reducer;
