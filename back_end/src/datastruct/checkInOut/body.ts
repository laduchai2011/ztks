import { Check_In_Out_Type } from './index';

export interface Create_Check_In_Out_Body_Field {
    type: Check_In_Out_Type;
    note: string;
    image: string | null;
    video: string | null;
    account_id: string;
}

export interface Get_My_Check_In_Outs_Body_Field {
    from_date: string;
    to_date: string;
    account_id: string;
}

export interface Get_Check_In_Outs_With_Date_Body_Field {
    type: Check_In_Out_Type;
    date: string;
    account_id: string;
}

export interface Create_Check_In_Out_Inspect_Body_Field {
    content: string;
    is_pass: boolean;
    check_in_out_id: string;
    account_id: string;
}

export interface Get_Check_In_Out_Inspect_With_Fk_Body_Field {
    check_in_out_id: string;
}
