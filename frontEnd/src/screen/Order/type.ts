import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { OrderField, OrderStatusField } from '@src/dataStruct/order';

export interface state_props {
    isLoading: boolean;
    toastMessage: {
        data: ToastMessage_Data_Props;
    };
    selectedOa?: ZaloOaField;
    createOrder: {
        newOrder?: OrderField;
    };
    editOrderDialog: {
        isShow: boolean;
        order?: OrderField;
        newOrder?: OrderField;
    };
    payDialog: {
        isShow: boolean;
        order?: OrderField;
        newOrder?: OrderField;
    };
    voucherDialog: {
        isShow: boolean;
        order?: OrderField;
    };
    addOrderStatusDialog: {
        isShow: boolean;
        order?: OrderField;
        newOrderStatus?: OrderStatusField;
        defaultOrderStatusType?: orderStatusType_type;
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
