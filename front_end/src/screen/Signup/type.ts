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

export enum account_enum {
    ID = 'ID',
    USERNAME = 'USERNAME',
    PASSWORD = 'PASSWORD',
    PHONE = 'PHONE',
    FIRST_NAME = 'FIRST_NAME',
    LAST_NAME = 'LAST_NAME',
    AVATAR = 'AVATAR',
    STATUS = 'STATUS',
    UPDATE_TIME = 'UPDATE_TIME',
}

export type account_field_type =
    | typeof account_enum.ID
    | typeof account_enum.USERNAME
    | typeof account_enum.PASSWORD
    | typeof account_enum.PHONE
    | typeof account_enum.FIRST_NAME
    | typeof account_enum.LAST_NAME
    | typeof account_enum.AVATAR
    | typeof account_enum.STATUS
    | typeof account_enum.UPDATE_TIME;
