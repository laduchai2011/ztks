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

export interface CheckZaloAppWithAppIdBodyField {
    appId: string;
}

export interface CheckZaloOaListWithZaloAppIdBodyField {
    zaloAppId: number;
}

export interface PlaywightGetZaloAppBodyField {
    userName: string;
    password: string;
}

export interface GenZaloOaTokenBodyField {
    appId: string;
    appSecret: string;
    code: string;
}

export interface CreateZnsTemplateBodyField {
    temId: string;
    images: string;
    dataFields: string;
    phoneCost: number;
    uidCost: number;
    zaloOaId: number;
    accountId: number;
}

export interface EditZnsTemplateBodyField {
    id: number;
    temId: string;
    images: string;
    dataFields: string;
    phoneCost: number;
    uidCost: number;
    zaloOaId: number;
    accountId: number;
}

export interface GetZnsTemplatesBodyField {
    page: number;
    size: number;
    offset: number;
    zaloOaId: number;
    accountId: number;
}

export interface GetZnsTemplateWithIdBodyField {
    id: number;
    accountId: number;
}

export interface CreateZnsMessageBodyField {
    type: ZnsMessageType;
    data: string;
    cost: number;
    znsTemplateId: number;
    accountId: number;
    zaloApp: ZaloAppField;
    zaloOa: ZaloOaField;
}

export interface GetZnsMessagesBodyField {
    page: number;
    size: number;
    znsTemplateId: number;
    accountId: number;
}
