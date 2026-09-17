export interface Add_Bank_Body_Field {
    bank_code: string;
    account_number: string;
    account_name: string;
    account_id: string;
}

export interface Edit_Bank_Body_Field {
    id: string;
    bank_code: string;
    account_number: string;
    account_name: string;
    account_id: string;
}

export interface Delete_Bank_Body_Field {
    id: string;
    account_id: string;
}

export interface Get_All_Banks_Body_Field {
    account_id: string;
}

export interface Get_Bank_With_Id_Body_Field {
    id: string;
}
