import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Order_Field, Order_Status_Field } from '@src/data_struct/order';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    create_order: {
        new_order?: Order_Field;
    };
    edit_order_dialog: {
        is_show: boolean;
        order?: Order_Field;
        new_order?: Order_Field;
    };
    pay_dialog: {
        is_show: boolean;
        order?: Order_Field;
        new_order?: Order_Field;
    };
    voucher_dialog: {
        is_show: boolean;
        order?: Order_Field;
    };
    add_order_status_dialog: {
        is_show: boolean;
        order?: Order_Field;
        new_order_status?: Order_Status_Field;
        default_order_status_type?: Order_Status_Type_Type;
    };
}

export enum Order_Status_Type_Enum {
    FREEDOM = 'freedom',
    DEFAULT = 'default',
}

export type Order_Status_Type_Type = Order_Status_Type_Enum.FREEDOM | Order_Status_Type_Enum.DEFAULT;

export enum Default_Contents_Enum {
    NOT_PAY = 'not_pay',
    PAID = 'paid',
    NOT_SEND = 'not_send',
    SENT = 'sent',
    RETURN = 'return',
}

export type Default_Contents_Type =
    | Default_Contents_Enum.NOT_PAY
    | Default_Contents_Enum.PAID
    | Default_Contents_Enum.NOT_SEND
    | Default_Contents_Enum.SENT
    | Default_Contents_Enum.RETURN;
