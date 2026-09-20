export interface Order_Field {
    id: string;
    uuid: string;
    label: string;
    content: string;
    money: number;
    is_pay: boolean;
    phone: string;
    is_delete: boolean;
    chat_room_id: string;
    update_time: string;
    create_time: string;
}

export interface Paged_Order_Field {
    items: Order_Field[];
    total_count: number;
}

export interface Order_Status_Field {
    id: string;
    type: string;
    content: string;
    order_id: string;
    update_time: string;
    create_time: string;
}
