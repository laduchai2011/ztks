import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    selected_oa?: Zalo_Oa_Field;
    statistics_oa_array: Statistics_Oa_Field[];
}
