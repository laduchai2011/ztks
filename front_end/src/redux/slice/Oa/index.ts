import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Oa/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    take_token_dialog: {
        is_show: false,
        zalo_oa: undefined,
    },
    create_oa: {
        is_show: false,
        new_zalo_oa: undefined,
    },
};

const Oa_Slice = createSlice({
    name: 'Oa_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__is_show__take_token_dialog: (state, action: PayloadAction<boolean>) => {
            state.take_token_dialog.is_show = action.payload;
        },
        set__zalo_oa__take_token_dialog: (state, action: PayloadAction<Zalo_Oa_Field | undefined>) => {
            state.take_token_dialog.zalo_oa = action.payload;
        },
        set__is_show__create_oa: (state, action: PayloadAction<boolean>) => {
            state.create_oa.is_show = action.payload;
        },
        set__new_zalo_oa__create_oa: (state, action: PayloadAction<Zalo_Oa_Field | undefined>) => {
            state.create_oa.new_zalo_oa = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__is_show__take_token_dialog,
    set__zalo_oa__take_token_dialog,
    set__is_show__create_oa,
    set__new_zalo_oa__create_oa,
} = Oa_Slice.actions;
export default Oa_Slice.reducer;
