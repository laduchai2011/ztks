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

export enum customer_enum {
    ID = 'ID',
    PHONE = 'PHONE',
    PASSWORD = 'PASSWORD',
}

export type customer_field_type = typeof customer_enum.ID | typeof customer_enum.PHONE | typeof customer_enum.PASSWORD;
