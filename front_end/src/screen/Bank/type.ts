import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Bank_Field } from '@src/data_struct/bank';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    add_bank: {
        new_bank?: Bank_Field;
    };
    edit_bank_dialog: {
        is_show: boolean;
        bank?: Bank_Field;
        new_bank?: Bank_Field;
    };
    delete_bank_dialog: {
        is_show: boolean;
        bank?: Bank_Field;
        deleted_bank?: Bank_Field;
    };
}
