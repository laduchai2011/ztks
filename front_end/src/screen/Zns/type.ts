import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field, Zns_Template_Field } from '@src/data_struct/zalo';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    selected_oa?: Zalo_Oa_Field;
    new_zns_template?: Zns_Template_Field;
    new_zns_templates: Zns_Template_Field[];
    edit_zns_template_dialog: {
        is_show: boolean;
        zns_template?: Zns_Template_Field;
        new_zns_template?: Zns_Template_Field;
    };
    send_template_dialog: {
        is_show: boolean;
        zns_template?: Zns_Template_Field;
    };
}
