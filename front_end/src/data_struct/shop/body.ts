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

export interface Admin_Set_Shop_Role_For_One_Account_Body_Field {
    type: string;
    is_lock: boolean;
    shop_id: string;
    account_id: string;
    admin_account_id: string;
}

export interface Admin_Set_Shop_Role_For_One_Team_Body_Field {
    type: string;
    is_lock: boolean;
    shop_id: string;
    team_id: string;
    admin_account_id: string;
}

export interface Leader_Set_Shop_Role_For_One_Account_Body_Field {
    type: string;
    is_lock: boolean;
    shop_id: string;
    account_id: string;
    leader_account_id: string;
}

export interface Leader_Set_Shop_Role_For_One_Team_Body_Field {
    type: string;
    is_lock: boolean;
    shop_id: string;
    team_id: string;
    leader_account_id: string;
}

export interface Get_Shop_Role_Statistics_For_One_Team_Body_Field {
    team_id: string;
    shop_id: string;
    type: string;
}

export interface Get_Shop_Role_For_One_Account_Body_Field {
    account_id: string;
    shop_id: string;
    type: string;
}
