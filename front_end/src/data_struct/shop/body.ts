export interface Create_Shop_Body_Field {
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    account_id: string;
}

export interface Create_Depot_Body_Field {
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    shop_id: string;
    account_id: string;
}

export interface Create_Store_Body_Field {
    name: string;
    description: string;
    content: string;
    depot_id: string;
    account_id: string;
}

export interface Get_My_Shops_Body_Field {
    cursor?: string;
    limit: number;
    account_id: string;
}

export interface Get_My_Depots_Body_Field {
    cursor?: string;
    limit: number;
    shop_id: string;
}

export interface Get_My_Stores_Body_Field {
    cursor?: string;
    limit: number;
    depot_id: string;
}

export interface Edit_Shop_Body_Field {
    id: string;
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    account_id: string;
}

export interface Edit_Depot_Body_Field {
    id: string;
    name: string;
    description: string;
    content: string;
    address: string;
    phone: string;
    account_id: string;
}

export interface Edit_Store_Body_Field {
    id: string;
    name: string;
    description: string;
    content: string;
    account_id: string;
}

export interface Delete_Shop_Body_Field {
    id: string;
    account_id: string;
}

export interface Delete_Depot_Body_Field {
    id: string;
    account_id: string;
}

export interface Delete_Store_Body_Field {
    id: string;
    account_id: string;
}

export interface Get_Latest_Shop_Pay_With_Shop_Id_Body_Field {
    shop_id: string;
    account_id: string;
}
