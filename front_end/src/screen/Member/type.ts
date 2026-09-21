import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    searched_account_id: string;
    new_member?: Account_Field;
}
