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

export interface ZaloTrunkField {
    id: number;
    trunkCode: string;
    transport: string;
    context: string;
    allowCodec: string;
    domain: string;
    fromUser: string;
    contact: string;
    trustIdOutbound: boolean;
    sendPai: boolean;
    sendRpid: boolean;
    isDelete: boolean;
    accountId: number;
    createTime: string;
}
