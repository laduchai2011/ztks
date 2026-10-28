import { Order_V1_Type_Type } from '.';

export interface Create_Order_V1_Body_Field {
    title: string;
    content: string;
    idempotency_key: string;
    type: Order_V1_Type_Type;
    sales_team_id: string;
    created_account_id: string;
    admin_account_id: string;
    is_pay: boolean;
    money: number;
    images: string[];
    videos: string[];
    customer_v1_id: string;
    received_account_id: string;
}

export interface Create_Order_V1_Inventory_Reservation_Body_Field {
    order_v1_id: string;
    product_id: string;
    quantity: number;
}

export interface Create_Order_V1_Service_Body_Field {
    order_v1_id: string;
    service_id: string;
    quantity: number;
}
