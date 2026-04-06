import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props, Crud_Enum, Crud_Type } from '@src/screen/OaSetting/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ChatSessionField } from '@src/dataStruct/chatSession';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    delDialog: {
        isShow: false,
    },
    dialogLoading: {
        isShow: false,
    },
    zaloOa: undefined,
    chatSessions: [],
};

const OaSettingSlice = createSlice({
    name: 'OaSettingSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setIsShow_delDialog: (state, action: PayloadAction<boolean>) => {
            state.delDialog.isShow = action.payload;
        },
        setShow_dialogLoading: (state, action: PayloadAction<boolean>) => {
            state.dialogLoading.isShow = action.payload;
        },
        set_zaloOa: (state, action: PayloadAction<ZaloOaField>) => {
            state.zaloOa = action.payload;
        },
        set_chatSessions: (
            state,
            action: PayloadAction<{ chatSessions: ChatSessionField[]; crud_type: Crud_Type }>
        ) => {
            switch (action.payload.crud_type) {
                case Crud_Enum.CREATE: {
                    state.chatSessions = [action.payload.chatSessions[0], ...state.chatSessions];
                    break;
                }
                case Crud_Enum.LOAD_MORE: {
                    state.chatSessions = [...state.chatSessions, ...action.payload.chatSessions];
                    break;
                }
                default: {
                    //statements;
                    break;
                }
            }
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    setIsShow_delDialog,
    setShow_dialogLoading,
    set_zaloOa,
    set_chatSessions,
} = OaSettingSlice.actions;
export default OaSettingSlice.reducer;
