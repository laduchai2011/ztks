export interface Account_Field {
    id: string;
    user_name: string;
    password: string;
    phone: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    is_delete: boolean;
    update_time: string;
    create_time: string;
}

export interface Account_Information_Field {
    added_by_id: string | null;
    account_type: account_type_enum;
    account_id: string;
}

export enum account_type_enum {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export type account_type_type = account_type_enum.ADMIN | account_type_enum.MEMBER;

export interface Add_Member_Body_Field {
    user_name: string;
    password: string;
    phone: string;
    first_name: string;
    last_name: string;
    added_by_id: string;
}

export interface All_Members_Body_Field {
    added_by_id: string;
}

export interface Paged_Account_Field {
    items: Account_Field[];
    total_count: number;
}

export interface Account_Receive_Message_Field {
    account_id_receive_message: string | null;
    zalo_oa_id: string;
    account_id: string;
}

export interface Recommend_Field {
    my_code: string;
    your_code: string | null;
    account_id: string;
}
