export interface Create_Agent_Body_Field {
    account_id: string;
}

export interface Agent_Add_Account_Body_Field {
    id: string;
    agent_account_id?: string;
    account_id: string;
}

export interface Agent_Del_Account_Body_Field {
    id: string;
    account_id: string;
}

export interface Get_Agents_Body_Field {
    page: number;
    size: number;
    offset: number;
    agent_account_id?: string;
    account_id: string;
}

export interface Get_Agent_With_Agent_Account_Id_Body_Field {
    agent_account_id: string;
}

export interface Create_Agent_Pay_Body_Field {
    agent_id: string;
    account_id: string;
}

export interface Update_Agent_Paid_Body_Field {
    id: string;
}

export interface Get_Last_Agent_Pay_Body_Field {
    agent_id: string;
    account_id: string;
}
