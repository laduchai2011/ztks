export interface Call_Agent_Field {
    id: string;
    agent_code: string;
    password: string;
    transport: string;
    context: string;
    allow_codec: string;
    max_contacts: number;
    is_delete: boolean;
    account_id: string;
    create_time: string;
}

export interface Call_PerMit_Field {
    id: string;
    uid: string;
    is_delete: boolean;
    call_agent_id: string;
    zalo_trunk_id: string | null;
    create_time: string;
}

export interface Zalo_Trunk_Field {
    id: string;
    trunk_code: string;
    transport: string;
    context: string;
    allow_codec: string;
    domain: string;
    from_user: string;
    contact: string;
    trust_id_outbound: boolean;
    send_pai: boolean;
    send_rpid: boolean;
    is_delete: boolean;
    account_id: string;
    create_time: string;
}
