export enum Order_V1_Type_Enum {
    PRODUCT = 'product',
    SERVICE = 'service',
}

export type Order_V1_Type_Type = Order_V1_Type_Enum.PRODUCT | Order_V1_Type_Enum.SERVICE;

export enum Order_V1_Status_Enum {
    CREATING = 'creating',
    CREATED = 'created',
    CREATE_FAILURE = 'create_failure',
    PAID = 'paid',
    STORE_RECEIVE = 'store_receive',
    WAITING_SHIPPING = 'waiting_shipping',
    SHIPPING = 'shipping',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export type Order_V1_Status_Type =
    | Order_V1_Status_Enum.CREATING
    | Order_V1_Status_Enum.CREATED
    | Order_V1_Status_Enum.CREATE_FAILURE
    | Order_V1_Status_Enum.PAID
    | Order_V1_Status_Enum.STORE_RECEIVE
    | Order_V1_Status_Enum.WAITING_SHIPPING
    | Order_V1_Status_Enum.SHIPPING
    | Order_V1_Status_Enum.COMPLETED
    | Order_V1_Status_Enum.CANCELLED;

export interface Order_V1_Field {
    id: string;
    title: string;
    content: string;
    images: string[];
    videos: string[];
    money: number;
    idempotency_key: string;
    type: Order_V1_Type_Type;
    status: Order_V1_Status_Type;
    process: string;
    is_pay: boolean;
    is_delete: boolean;
    team_id: string;
    customer_v1_id: string | null;
    created_account_id: string;
    received_account_id: string | null;
    admin_account_id: string;
    update_time: string;
    create_time: string;
}

export enum Order_V1_Inventory_Reservation_Status_Enum {
    RESERVED = 'reserved',
    CONFIRMED = 'confirmed',
    RELEASED = 'released',
    EXPIRED = 'expired',
}

export type Order_V1_Inventory_Reservation_Status_Type =
    | Order_V1_Inventory_Reservation_Status_Enum.RESERVED
    | Order_V1_Inventory_Reservation_Status_Enum.CONFIRMED
    | Order_V1_Inventory_Reservation_Status_Enum.RELEASED
    | Order_V1_Inventory_Reservation_Status_Enum.EXPIRED;

export interface Order_V1_Inventory_Reservation_Field {
    id: string;
    order_v1_id: string;
    product_id: string;
    quantity: number;
    status: Order_V1_Inventory_Reservation_Status_Type;
    update_time: string;
    create_time: string;
}
