import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Account_Receive_Message_Field } from '@src/data_struct/account';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    selected_oa?: Zalo_Oa_Field;
    account_receive_message?: Account_Receive_Message_Field;
}
