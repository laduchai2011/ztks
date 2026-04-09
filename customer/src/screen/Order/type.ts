import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { GetOrdersWithPhoneBodyField } from '@src/dataStruct/order/body';
import { OrderField } from '@src/dataStruct/order';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    getOrdersWithPhoneBody: GetOrdersWithPhoneBodyField | undefined;
    voucherDialog: {
        isShow: boolean;
        order?: OrderField;
    };
}

export enum orderStatusType_enum {
    FREEDOM = 'freedom',
    DEFAULT = 'default',
}

export type orderStatusType_type = orderStatusType_enum.FREEDOM | orderStatusType_enum.DEFAULT;

export enum defaultContents {
    NOT_PAY = 'not_pay',
    PAID = 'paid',
    NOT_SEND = 'not_send',
    SENT = 'sent',
    RETURN = 'return',
}

export type defaultContent_type =
    | defaultContents.NOT_PAY
    | defaultContents.PAID
    | defaultContents.NOT_SEND
    | defaultContents.SENT
    | defaultContents.RETURN;
