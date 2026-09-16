export interface Voucher_Field {
    id: string;
    is_used: boolean;
    time_expire: string;
    money: number;
    order_id: string | null;
    member_ztks_id: string;
    phone: string;
    update_time: string;
    create_time: string;
}

export interface Paged_Voucher_Field {
    items: Voucher_Field[];
    total_count: number;
}
