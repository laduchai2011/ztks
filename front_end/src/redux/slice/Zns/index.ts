import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Zns/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field, Zns_Template_Field } from '@src/data_struct/zalo';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    selected_oa: undefined,
    new_zns_template: undefined,
    new_zns_templates: [],
    edit_zns_template_dialog: {
        is_show: false,
        zns_template: undefined,
        new_zns_template: undefined,
    },
    send_template_dialog: {
        is_show: false,
        zns_template: undefined,
    },
};

const Zns_Slice = createSlice({
    name: 'Zns_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__selected_oa: (state, action: PayloadAction<Zalo_Oa_Field>) => {
            state.selected_oa = action.payload;
        },
        set__new_zns_template: (state, action: PayloadAction<Zns_Template_Field | undefined>) => {
            state.new_zns_template = action.payload;
        },
        set__data__add_new_zns_template: (state, action: PayloadAction<Zns_Template_Field>) => {
            state.new_zns_templates = [...state.new_zns_templates, action.payload];
        },
        clear__new_zns_templates: (state) => {
            state.new_zns_templates = [];
        },
        set__is_show__edit_zns_template_dialog: (state, action: PayloadAction<boolean>) => {
            state.edit_zns_template_dialog.is_show = action.payload;
        },
        set__zns_template__edit_zns_template_dialog: (state, action: PayloadAction<Zns_Template_Field | undefined>) => {
            state.edit_zns_template_dialog.zns_template = action.payload;
        },
        set__new_zns_template__edit_zns_template_dialog: (
            state,
            action: PayloadAction<Zns_Template_Field | undefined>
        ) => {
            state.edit_zns_template_dialog.new_zns_template = action.payload;
        },
        set__is_show__send_template_dialog: (state, action: PayloadAction<boolean>) => {
            state.send_template_dialog.is_show = action.payload;
        },
        set__zns_template__send_template_dialog: (state, action: PayloadAction<Zns_Template_Field | undefined>) => {
            state.send_template_dialog.zns_template = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__selected_oa,
    set__new_zns_template,
    set__data__add_new_zns_template,
    clear__new_zns_templates,
    set__is_show__edit_zns_template_dialog,
    set__zns_template__edit_zns_template_dialog,
    set__new_zns_template__edit_zns_template_dialog,
    set__is_show__send_template_dialog,
    set__zns_template__send_template_dialog,
} = Zns_Slice.actions;
export default Zns_Slice.reducer;
