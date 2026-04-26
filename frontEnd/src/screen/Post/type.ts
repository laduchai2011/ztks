import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { RegisterPostField, PostField } from '@src/dataStruct/post';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    selectedRegisterPost?: RegisterPostField;
    postList: PostField[];
    editPostDialog: {
        isShow: boolean;
        post?: PostField;
        newPost?: PostField;
    };
}
