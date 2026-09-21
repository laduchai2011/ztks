import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

export interface state_props {
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
}

export enum member_enum {
    USERNAME = 'USERNAME',
    PASSWORD = 'PASSWORD',
    PHONE = 'PHONE',
    FIRST_NAME = 'FIRST_NAME',
    LAST_NAME = 'LAST_NAME',
    ADDED_BY_ID = 'ADDED_BY_ID',
}

export type member_field_type =
    | typeof member_enum.USERNAME
    | typeof member_enum.PASSWORD
    | typeof member_enum.PHONE
    | typeof member_enum.FIRST_NAME
    | typeof member_enum.LAST_NAME
    | typeof member_enum.ADDED_BY_ID;
