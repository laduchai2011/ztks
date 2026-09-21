import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Note_Field } from '@src/data_struct/note';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    edit_note_dialog: {
        is_show: boolean;
        note?: Note_Field;
        new_note?: Note_Field;
    };
    new_notes: Note_Field[];
    delete_note_dialog: {
        is_show: boolean;
        note?: Note_Field;
        deleted_note?: Note_Field;
    };
}
