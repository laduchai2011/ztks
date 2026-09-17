export interface Shop_Field {
    id: number;
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    is_delete: boolean;
    account_id: number;
    create_time: Date;
}

export interface Depot_Field {
    id: number;
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    is_delete: boolean;
    shop_id: number;
    create_time: Date;
}

export interface Store_Field {
    id: number;
    name: string;
    description: string;
    content: string;
    is_delete: boolean;
    depot_id: number;
    create_time: Date;
}
