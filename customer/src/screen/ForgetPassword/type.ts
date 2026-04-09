import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    otpDialog: {
        isShow: boolean;
        input: string;
        token: string;
    };
}
