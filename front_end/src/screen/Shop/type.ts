import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
}
