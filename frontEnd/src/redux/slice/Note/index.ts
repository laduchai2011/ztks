import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Note/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { NoteField } from '@src/dataStruct/note';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedOa: undefined,
    editNoteDialog: {
        isShow: false,
        note: undefined,
        newNote: undefined,
    },
    newNotes: [],
};

const NoteSlice = createSlice({
    name: 'NoteSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_selectedOa: (state, action: PayloadAction<ZaloOaField>) => {
            state.selectedOa = action.payload;
        },
        set_editNoteDialog: (state, action: PayloadAction<{ isShow: boolean; note: NoteField | undefined }>) => {
            state.editNoteDialog = action.payload;
        },
        setFinal_editNoteDialog: (state, action: PayloadAction<{ isShow: false; newNote: NoteField | undefined }>) => {
            state.editNoteDialog = action.payload;
        },
        setData_addNewNote: (state, action: PayloadAction<NoteField>) => {
            state.newNotes = [...state.newNotes, action.payload];
        },
        clear_newNotes: (state) => {
            state.newNotes = [];
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    set_selectedOa,
    set_editNoteDialog,
    setFinal_editNoteDialog,
    setData_addNewNote,
    clear_newNotes,
} = NoteSlice.actions;
export default NoteSlice.reducer;
