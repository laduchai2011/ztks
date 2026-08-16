export interface GetCallAgentWithAccountIdBodyField {
    accountId: number;
}

export interface GetCallPermitWithUidBodyField {
    uid: string;
}

export interface CreateCallPermitBodyField {
    uid: string;
    appId: string;
    oaId: string;
    callAgentId: number;
    accountId: number;
}

export interface CreateZaloTrunkBodyField {
    trunkCode: string;
    appId: string;
    oaId: string;
    port: string;
    accountId: number;
}
