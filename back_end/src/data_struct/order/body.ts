export interface Orders_Filter_Body_Field {
    page: number;
    size: number;
    uuid?: string;
    money_from?: number;
    money_to?: number;
    is_pay?: boolean;
    phone?: string;
    is_delete?: boolean;
    chat_room_id: string;
    account_id: string;
}

export interface Create_Order_Body_Field {
    uuid: string;
    label: string;
    content: string;
    money: number;
    phone: string;
    chat_room_id: string;
    account_id: string;
}

export interface Update_Order_Body_Field {
    id: string;
    label: string;
    content: string;
    money: number;
    phone: string;
    account_id: string;
}

export interface Get_Order_With_Id_Body_Field {
    id: string;
}

export interface Create_Order_Status_Body_Field {
    type: string;
    content: string;
    order_id: string;
    account_id: string;
}

export interface Get_All_Order_Status_Body_Field {
    order_id: string;
}

export interface Get_Orders_With_Phone_Body_Field {
    page: number;
    size: number;
    phone: string;
}
