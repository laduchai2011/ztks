import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    take_token_dialog: {
        is_show: boolean;
        zalo_oa?: Zalo_Oa_Field;
    };
    create_oa: {
        is_show: boolean;
        new_zalo_oa?: Zalo_Oa_Field;
    };
}
