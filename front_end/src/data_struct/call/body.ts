import { Call_Type_Type } from '.';
import { Zalo_App_Field, Zalo_Oa_Field } from '../zalo';

export interface Request_Consent_Body_Field {
    phone: string;
    call_type: Call_Type_Type;
    reason_code: number;
    zalo_oa: Zalo_Oa_Field;
    zalo_app: Zalo_App_Field;
    account_id: string;
}

export interface Check_Consent_Body_Field {
    phone: string;
    zalo_oa: Zalo_Oa_Field;
    zalo_app: Zalo_App_Field;
    account_id: string;
}

export interface Outbound_Body_Field {
    user_id: string;
    agent_id: string;
    call_type: Call_Type_Type;
    zalo_oa: Zalo_Oa_Field;
    zalo_app: Zalo_App_Field;
    account_id: string;
}

export interface Inbound_Body_Field {
    branch_id: string;
    agent_id: string;
    call_type: Call_Type_Type;
    zalo_oa: Zalo_Oa_Field;
    zalo_app: Zalo_App_Field;
    account_id: string;
}

export interface Get_Mcc_Info_Body_Field {
    zalo_oa: Zalo_Oa_Field;
    zalo_app: Zalo_App_Field;
    account_id: string;
}
