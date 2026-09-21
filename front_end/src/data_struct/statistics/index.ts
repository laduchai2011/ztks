export enum Statistics_Flag {
    New = 'new',
    Old = 'old',
}

export type Statistics_Flag_Type = Statistics_Flag.New | Statistics_Flag.Old;

export interface Statistics_Oa_Field {
    id: string;
    sales: number;
    order_amount: number;
    is_delete: boolean;
    zalo_oa_id: string;
    of_day: Date;
    create_time: Date;
}

export interface Statistics_Member_In_One_Month_Field {
    id: string;
    sales: number;
    order_amount: number;
    flag: Statistics_Flag_Type;
    is_delete: boolean;
    of_month: Date;
    zalo_oa_id: string;
    account_id: string;
    create_time: Date;
}
