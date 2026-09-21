import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { NoteField } from '@src/dataStruct/note';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    editNoteDialog: {
        isShow: boolean;
        note?: NoteField;
        newNote?: NoteField;
    };
    newNotes: NoteField[];
    deleteNoteDialog: {
        isShow: boolean;
        note?: NoteField;
        deletedNote?: NoteField;
    };
}
