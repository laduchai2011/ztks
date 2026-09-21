import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Check_In_Out_Field } from '@src/data_struct/check_in_out';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    check_in_outs: Check_In_Out_Field[];
}
