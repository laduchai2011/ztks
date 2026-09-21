import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Bank/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Bank_Field } from '@src/data_struct/bank';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    add_bank: {
        new_bank: undefined,
    },
    edit_bank_dialog: {
        is_show: false,
        bank: undefined,
        new_bank: undefined,
    },
    delete_bank_dialog: {
        is_show: false,
        bank: undefined,
        deleted_bank: undefined,
    },
};

const Bank_Slice = createSlice({
    name: 'Bank_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__new_bank__add_bank: (state, action: PayloadAction<Bank_Field | undefined>) => {
            state.add_bank.new_bank = action.payload;
        },
        set__is_show__edit_bank_dialog: (state, action: PayloadAction<boolean>) => {
            state.edit_bank_dialog.is_show = action.payload;
        },
        set__bank__edit_bank_dialog: (state, action: PayloadAction<Bank_Field | undefined>) => {
            state.edit_bank_dialog.bank = action.payload;
        },
        set__new_bank__edit_bank_dialog: (state, action: PayloadAction<Bank_Field | undefined>) => {
            state.edit_bank_dialog.new_bank = action.payload;
        },
        set__is_show__delete_bank_dialog: (state, action: PayloadAction<boolean>) => {
            state.delete_bank_dialog.is_show = action.payload;
        },
        set__bank__delete_bank_dialog: (state, action: PayloadAction<Bank_Field | undefined>) => {
            state.delete_bank_dialog.bank = action.payload;
        },
        set__deleted_bank__delete_bank_dialog: (state, action: PayloadAction<Bank_Field | undefined>) => {
            state.delete_bank_dialog.deleted_bank = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__new_bank__add_bank,
    set__is_show__edit_bank_dialog,
    set__bank__edit_bank_dialog,
    set__new_bank__edit_bank_dialog,
    set__is_show__delete_bank_dialog,
    set__bank__delete_bank_dialog,
    set__deleted_bank__delete_bank_dialog,
} = Bank_Slice.actions;
export default Bank_Slice.reducer;
