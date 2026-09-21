import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { RegisterPostField } from '@src/dataStruct/post';
import { GetRegisterPostsBodyField } from '@src/dataStruct/post/body';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    getRegisterPostsBody?: GetRegisterPostsBodyField;
    newRegisterPostOfCreate?: RegisterPostField;
    editRegisterPostDialog: {
        isShow: boolean;
        registerPost?: RegisterPostField;
        newRegisterPost?: RegisterPostField;
    };
    deleteRegisterPostDialog: {
        isShow: boolean;
        registerPost?: RegisterPostField;
        newRegisterPost?: RegisterPostField;
    };
}
