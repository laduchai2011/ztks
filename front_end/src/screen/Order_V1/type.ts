import { Order_V1_Field } from '@src/data_struct/order_v1';

export interface state_props {
    // order_V1_detail
    is_show_order_v1_detail: boolean;
    order_v1_detail?: Order_V1_Field;

    // create_order_v1
    is_show_create_order_v1: boolean;
}
