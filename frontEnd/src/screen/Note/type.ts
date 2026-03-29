import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { NoteField } from '@src/dataStruct/note';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    selectedOa?: ZaloOaField;
    editNoteDialog: {
        isShow: boolean;
        note?: NoteField;
        newNote?: NoteField;
    };
    newNotes: NoteField[];
}
