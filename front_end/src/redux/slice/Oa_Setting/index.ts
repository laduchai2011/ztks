import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props, Crud_Enum, Crud_Type } from '@src/screen/OaSetting/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Chat_Session_Field } from '@src/data_struct/chat_session';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    del_dialog: {
        is_show: false,
    },
    dialog_loading: {
        is_show: false,
    },
    zalo_oa: undefined,
    chat_sessions: [],
    take_token_dialog: {
        is_show: false,
        zalo_oa: undefined,
    },
    edit_zalo_oa: {
        is_show: false,
        zalo_oa: undefined,
        new_zalo_oa: undefined,
    },
    create_zalo_trunk_dialog: {
        is_show: false,
        zalo_oa: undefined,
    },
};

const Oa_Setting_Slice = createSlice({
    name: 'Oa_Setting_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__is_show__del_dialog: (state, action: PayloadAction<boolean>) => {
            state.del_dialog.is_show = action.payload;
        },
        set__is_show__dialog_loading: (state, action: PayloadAction<boolean>) => {
            state.dialog_loading.is_show = action.payload;
        },
        set__zalo_oa: (state, action: PayloadAction<Zalo_Oa_Field>) => {
            state.zalo_oa = action.payload;
        },
        set__chat_sessions: (
            state,
            action: PayloadAction<{ chat_sessions: Chat_Session_Field[]; crud_type: Crud_Type; page?: number }>
        ) => {
            switch (action.payload.crud_type) {
                case Crud_Enum.CREATE: {
                    state.chat_sessions = [action.payload.chat_sessions[0], ...state.chat_sessions];
                    break;
                }
                case Crud_Enum.LOAD_MORE: {
                    if (action.payload.page) {
                        if (action.payload.page === 1) {
                            state.chat_sessions = action.payload.chat_sessions;
                        } else {
                            state.chat_sessions = [...state.chat_sessions, ...action.payload.chat_sessions];
                        }
                    }
                    break;
                }
                default: {
                    //statements;
                    break;
                }
            }
        },
        set__is_show__take_token_dialog: (state, action: PayloadAction<boolean>) => {
            state.take_token_dialog.is_show = action.payload;
        },
        set__zalo_oa__take_token_dialog: (state, action: PayloadAction<Zalo_Oa_Field | undefined>) => {
            state.take_token_dialog.zalo_oa = action.payload;
        },
        set__is_show__edit_zalo_oa: (state, action: PayloadAction<boolean>) => {
            state.edit_zalo_oa.is_show = action.payload;
        },
        set__zalo_oa__edit_zalo_oa: (state, action: PayloadAction<Zalo_Oa_Field | undefined>) => {
            state.edit_zalo_oa.zalo_oa = action.payload;
        },
        set__new_zalo_oa__edit_zalo_oa: (state, action: PayloadAction<Zalo_Oa_Field | undefined>) => {
            state.edit_zalo_oa.new_zalo_oa = action.payload;
        },
        set__is_show__create_zalo_trunk_dialog: (state, action: PayloadAction<boolean>) => {
            state.create_zalo_trunk_dialog.is_show = action.payload;
        },
        set__zalo_oa__create_zalo_trunk_dialog: (state, action: PayloadAction<Zalo_Oa_Field | undefined>) => {
            state.create_zalo_trunk_dialog.zalo_oa = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__is_show__del_dialog,
    set__is_show__dialog_loading,
    set__zalo_oa,
    set__chat_sessions,
    set__is_show__take_token_dialog,
    set__zalo_oa__take_token_dialog,
    set__is_show__edit_zalo_oa,
    set__zalo_oa__edit_zalo_oa,
    set__new_zalo_oa__edit_zalo_oa,
    set__is_show__create_zalo_trunk_dialog,
    set__zalo_oa__create_zalo_trunk_dialog,
} = Oa_Setting_Slice.actions;
export default Oa_Setting_Slice.reducer;
