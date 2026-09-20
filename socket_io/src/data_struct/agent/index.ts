export interface Agent_Field {
    id: string;
    type: string;
    expiry: string | null;
    status: string;
    agent_account_id: string | null;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Paged_Agent_Field {
    items: Agent_Field[];
    total_count: number;
}

export interface Agent_Pay_Field {
    id: string;
    is_pay: boolean;
    agent_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}
