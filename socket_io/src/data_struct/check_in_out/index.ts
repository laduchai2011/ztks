export enum Check_In_Out_Enum {
    IN = 'in',
    OUT = 'out',
}

export type Check_In_Out_Type = Check_In_Out_Enum.IN | Check_In_Out_Enum.OUT;

export interface Check_In_Out_Field {
    id: string;
    type: Check_In_Out_Type;
    note: string;
    image: string | null;
    video: string | null;
    is_delete: boolean;
    account_id: string;
    create_time: string;
}

export interface Check_In_Out_With_Date_Field {
    id: string;
    type: Check_In_Out_Type;
    note: string;
    image: string | null;
    video: string | null;
    is_delete: boolean;
    account_id: string;
    date: string;
    create_time: string;
}

export interface Check_In_Out_Inspect_Field {
    id: string;
    content: string;
    is_pass: boolean;
    is_delete: boolean;
    check_in_out_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}
