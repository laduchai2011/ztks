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
}

export interface Create_Store_Body_Field {
    name: string;
    description: string;
    content: string;
    depot_id: string;
}
