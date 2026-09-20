export interface Chat_Session_Body_Field {
    label: string;
    code: string;
    is_ready: boolean;
    selected_account_id: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface Chat_Session_With_Account_Id_Body_Field {
    page: number;
    size: number;
    zalo_oa_id: string;
    account_id: string;
}

export interface Update_Selected_Account_Id_Of_Chat_Session_Body_Field {
    id: string;
    selected_account_id: string;
    account_id: string;
}

export interface Update_Is_Ready_Of_Chat_Session_Body_Field {
    id: string;
    is_ready: boolean;
    account_id: string;
}

export interface User_Take_Session_To_Chat_Body_Field {
    code: string;
    zalo_oa_id: string;
}

export interface Leave_All_Chat_Session_Body_Field {
    account_id: string;
}
