export interface CallAgentField {
    id: number;
    agentCode: string;
    password: string;
    transport: string;
    context: string;
    allowCodec: string;
    maxContacts: number;
    isDelete: boolean;
    accountId: number;
    createTime: string;
}

export interface CallPerMitField {
    id: number;
    uid: string;
    isDelete: boolean;
    callAgentId: number;
    createTime: string;
}
