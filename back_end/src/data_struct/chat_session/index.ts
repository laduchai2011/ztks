export interface Chat_Session_Field {
    id: string;
    label: string;
    code: string;
    is_ready: boolean;
    status: string;
    selected_account_id: string;
    zalo_oa_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Paged_Chat_Session_Field {
    items: Chat_Session_Field[];
    total_count: number;
}
