export interface Get_Call_Agent_With_Account_Id_Body_Field {
    account_id: string;
}

export interface Get_Call_Permit_With_Uid_Body_Field {
    uid: string;
}

export interface Create_Call_Permit_Body_Field {
    uid: string;
    app_id: string;
    oa_id: string;
    call_agent_id: string;
    account_id: string;
}

export interface Create_Zalo_Trunk_Body_Field {
    trunkCode: string;
    app_id: string;
    oa_id: string;
    port: string;
    account_id: string;
}
