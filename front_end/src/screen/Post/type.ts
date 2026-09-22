import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Register_Post_Field, Post_Field } from '@src/data_struct/post';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    selected_register_post?: Register_Post_Field;
    post_list: Post_Field[];
    edit_post_dialog: {
        is_show: boolean;
        post?: Post_Field;
        new_post?: Post_Field;
    };
}
