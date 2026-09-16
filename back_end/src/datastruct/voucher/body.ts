export interface Create_Voucher_Body_Field {
    day_amount: number;
    money: number;
    phone: string;
    member_ztks_id: string;
}

export interface Get_Vouchers_Body_Field {
    page: number;
    size: number;
    is_used: boolean | null;
    phone: string;
}

export interface Get_Voucher_With_Order_Id_Body_Field {
    order_id: string;
}

export interface Customer_Use_Voucher_Body_Field {
    order_id: string;
    voucher_id: string;
    customer_id: string;
}
