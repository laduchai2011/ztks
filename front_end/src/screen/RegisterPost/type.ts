import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Register_Post_Field } from '@src/data_struct/post';
import { Get_Register_Posts_Body_Field } from '@src/data_struct/post/body';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    get_register_posts_body?: Get_Register_Posts_Body_Field;
    new_register_post_of_create?: Register_Post_Field;
    edit_register_post_dialog: {
        is_show: boolean;
        register_post?: Register_Post_Field;
        new_register_post?: Register_Post_Field;
    };
    delete_register_post_dialog: {
        is_show: boolean;
        register_post?: Register_Post_Field;
        new_register_post?: Register_Post_Field;
    };
}
