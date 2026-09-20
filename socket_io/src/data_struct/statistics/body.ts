export interface Get_Statistics_Oa_Body_Field {
    from_date: string;
    to_date: string;
    zalo_oa_id: string;
}

export interface Update_Statistics_Body_Field {
    sales: number;
    zalo_oa_id: string;
    account_id: string;
    of_day: Date;
}

export interface Get_Statistics_Member_In_One_Month_Body_Field {
    of_month: Date;
    zalo_oa_id: string;
    account_id: string;
}
