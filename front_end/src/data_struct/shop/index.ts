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

export interface Cursor_Depot_Field {
    items: Depot_Field[];
    next_cursor: string | null;
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

export interface Cursor_Store_Field {
    items: Store_Field[];
    next_cursor: string | null;
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

export enum Shop_Role_Type_Enum {
    SALES = 'sales',
    STORE = 'store',
}

export type Shop_Role_Type_Type = Shop_Role_Type_Enum.SALES | Shop_Role_Type_Enum.STORE;

export interface Shop_Role_Field {
    id: string;
    type: Shop_Role_Type_Type;
    is_lock: boolean;
    is_delete: boolean;
    shop_id: string;
    account_id: string;
    create_time: string;
}

export interface Cursor_Shop_Role_Field {
    items: Shop_Role_Field[];
    next_cursor: string | null;
}

export interface Shop_Role_Statistics_Field {
    total_members: number;
    locked_members: number;
}

export enum Depot_Role_Type_Enum {
    SALES = 'sales',
    STORE = 'store',
}

export type Depot_Role_Type_Type = Depot_Role_Type_Enum.SALES | Depot_Role_Type_Enum.STORE;

export interface Depot_Role_Field {
    id: string;
    type: Depot_Role_Type_Type;
    is_lock: boolean;
    is_delete: boolean;
    depot_id: string;
    account_id: string;
    create_time: string;
}

export interface Cursor_Depot_Role_Field {
    items: Depot_Role_Field[];
    next_cursor: string | null;
}

export interface Depot_Role_Statistics_Field {
    total_members: number;
    locked_members: number;
}

export interface Team_Shop_Field {
    id: string;
    is_lock: boolean;
    is_delete: boolean;
    shop_id: string;
    team_id: string;
    create_time: string;
}

export interface Cursor_Team_Shop_Field {
    items: Team_Shop_Field[];
    next_cursor: string | null;
}

export interface Team_Shop_Depot_Field {
    id: string;
    is_lock: boolean;
    is_delete: boolean;
    depot_id: string;
    team_shop_id: string;
    create_time: string;
}

export interface Cursor_Team_Shop_Depot_Field {
    items: Team_Shop_Depot_Field[];
    next_cursor: string | null;
}

export interface Team_Shop_Depot_Store_Field {
    id: string;
    is_lock: boolean;
    is_delete: boolean;
    store_id: string;
    team_shop_depot_id: string;
    create_time: string;
}

export interface Cursor_Team_Shop_Depot_Store_Field {
    items: Team_Shop_Depot_Store_Field[];
    next_cursor: string | null;
}
