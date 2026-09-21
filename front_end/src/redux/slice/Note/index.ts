import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Note/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Note_Field } from '@src/data_struct/note';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    edit_note_dialog: {
        is_show: false,
        note: undefined,
        new_note: undefined,
    },
    new_notes: [],
    delete_note_dialog: {
        is_show: false,
        note: undefined,
        deleted_note: undefined,
    },
};

const Note_Slice = createSlice({
    name: 'Note_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__edit_note_dialog: (state, action: PayloadAction<{ is_show: boolean; note: Note_Field | undefined }>) => {
            state.edit_note_dialog = action.payload;
        },
        set__final__edit_note_dialog: (
            state,
            action: PayloadAction<{ is_show: false; new_note: Note_Field | undefined }>
        ) => {
            state.edit_note_dialog = action.payload;
        },
        set__data__add_new_note: (state, action: PayloadAction<Note_Field>) => {
            state.new_notes = [...state.new_notes, action.payload];
        },
        clear__new_notes: (state) => {
            state.new_notes = [];
        },
        set__is_show__delete_note_dialog: (state, action: PayloadAction<boolean>) => {
            state.delete_note_dialog.is_show = action.payload;
        },
        set__note__delete_note_dialog: (state, action: PayloadAction<Note_Field | undefined>) => {
            state.delete_note_dialog.note = action.payload;
        },
        set__deleted_note__delete_note_dialog: (state, action: PayloadAction<Note_Field | undefined>) => {
            state.delete_note_dialog.deleted_note = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__edit_note_dialog,
    set__final__edit_note_dialog,
    set__data__add_new_note,
    clear__new_notes,
    set__is_show__delete_note_dialog,
    set__note__delete_note_dialog,
    set__deleted_note__delete_note_dialog,
} = Note_Slice.actions;
export default Note_Slice.reducer;
