export interface Shop_Field {
    id: string;
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    is_delete: boolean;
    account_id: string;
    create_time: string;
}

export interface Cursor_Shop_Field {
    items: Shop_Field[];
    next_cursor: string | null;
}

export interface Depot_Field {
    id: string;
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    is_delete: boolean;
    shop_id: string;
    create_time: string;
}

export interface Store_Field {
    id: string;
    name: string;
    description: string;
    content: string;
    is_delete: boolean;
    depot_id: string;
    create_time: string;
}

export interface Shop_Pay_Field {
    id: string;
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    is_delete: boolean;
    account_id: string;
    create_time: string;
}
