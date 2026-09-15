import { Zns_Message_Type } from '.';
import { Zalo_App_Field, Zalo_Oa_Field } from '.';

export interface Create_Zalo_Oa_Body_Field {
    label: string;
    oa_id: string;
    oa_name: string;
    oa_secret: string;
    zalo_app_id: string;
    account_id: string;
}

export interface Edit_Zalo_Oa_Body_Field {
    id: string;
    label: string;
    oa_id: string;
    oa_name: string;
    oa_secret: string;
    zalo_app_id: string;
    account_id: string;
}

export interface Zalo_App_With_Account_Id_Body_Field {
    account_id: string;
    role: string;
}

export interface Zalo_Oa_List_With_2Fk_Body_Field {
    page: number;
    size: number;
    zalo_app_id: string;
    account_id: string;
}

export interface Get_Zalo_Oa_Token_With_Fk_Body_Field {
    zalo_oa_id: string;
    account_id: string;
}

export interface Create_Zalo_Oa_Token_Body_Field {
    refresh_token: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface Update_Refresh_Token_Of_Zalo_Oa_Body_Field {
    refresh_token: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface Is_My_Oa_Body_Field {
    id: string;
    account_id: string;
}

export interface Zalo_Oa_With_Id_Body_Field {
    id: string;
    account_id: string; // to determine admin or member
}

export interface Get_Zalo_Oa_With_Oa_Id_Body_Field {
    oa_id: string;
    account_id: string; // to determine admin or member
}

export interface Check_Zalo_App_With_App_Id_Body_Field {
    app_id: string;
}

export interface Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field {
    zalo_app_id: string;
}

export interface Playwight_Get_Zalo_App_Body_Field {
    user_name: string;
    password: string;
}

export interface Gen_Zalo_Oa_Token_Body_Field {
    app_id: string;
    app_secret: string;
    code: string;
}

export interface Create_Zns_Template_Body_Field {
    tem_id: string;
    images: string;
    data_fields: string;
    phone_cost: number;
    uid_cost: number;
    zalo_oa_id: string;
    account_id: string;
}

export interface Edit_Zns_Template_Body_Field {
    id: string;
    tem_id: string;
    images: string;
    data_fields: string;
    phone_cost: number;
    uid_cost: number;
    zalo_oa_id: string;
    account_id: string;
}

export interface Get_Zns_Templates_Body_Field {
    page: number;
    size: number;
    offset: number;
    zalo_oa_id: string;
    account_id: string;
}

export interface Get_Zns_Template_With_Id_Body_Field {
    id: string;
    account_id: string;
}

export interface Create_Zns_Message_Body_Field {
    type: Zns_Message_Type;
    data: string;
    cost: number;
    zns_template_id: string;
    account_id: string;
    zalo_app: Zalo_App_Field;
    zalo_oa: Zalo_Oa_Field;
}

export interface Get_Zns_Messages_Body_Field {
    page: number;
    size: number;
    zns_template_id: string;
    account_id: string;
}
