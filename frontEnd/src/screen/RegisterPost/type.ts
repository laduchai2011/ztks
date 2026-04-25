import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { GetRegisterPostsBodyField } from '@src/dataStruct/post/body';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    getRegisterPostsBody?: GetRegisterPostsBodyField;
}
