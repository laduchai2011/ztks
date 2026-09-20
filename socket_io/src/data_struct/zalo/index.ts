export interface Zalo_App_Field {
    id: string;
    label: string;
    app_id: string;
    app_name: string;
    app_secret: string;
    status: string;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Zalo_Oa_Field {
    id: string;
    label: string;
    oa_id: string;
    oa_name: string;
    oa_secret: string;
    status: string;
    zalo_app_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Zalo_Oa_Token_Field {
    refresh_token: string;
    zalo_oa_id: string;
}

export interface Oa_Permission_Field {
    id: string;
    role: string;
    status: string;
    zalo_oa_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Paged_Zalo_Oa_Field {
    items: Zalo_Oa_Field[];
    total_count: number;
}

export interface Playwight_Get_Zalo_App_Field {
    zalo_app: Zalo_App_Field;
    token: string;
}

export interface Gen_Zalo_Oa_Token_Result_Field {
    access_token: string;
    refresh_token: string;
    expires_in: string;
}

export interface Zns_Template_Field {
    id: string;
    tem_id: string;
    images: string;
    data_fields: string;
    phone_cost: number;
    uid_cost: number;
    is_delete: boolean;
    zalo_oa_id: string;
    update_time: string;
    create_time: string;
}

export interface Paged_Zns_Template_Field {
    items: Zns_Template_Field[];
    total_count: number;
}

export interface Zns_Message_Field {
    id: string;
    type: Zns_Message_Type;
    data: string;
    cost: number;
    zns_template_id: string;
    account_id: string;
    create_time: string;
}

export interface Paged_Zns_Message_Field {
    items: Zns_Message_Field[];
    total_count: number;
}

export enum Zns_Message_Enum {
    PHONE = 'phone',
    UID = 'uid',
    HASH_PHONE = 'hashPhone',
}

export type Zns_Message_Type = Zns_Message_Enum.PHONE | Zns_Message_Enum.UID | Zns_Message_Enum.HASH_PHONE;
