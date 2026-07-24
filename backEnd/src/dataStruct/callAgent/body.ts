export interface GetCallAgentWithAccountIdBodyField {
    accountId: number;
}

export interface CreateCallPermitBodyField {
    uid: string;
    callAgentId: number;
    accountId: number;
}

export interface CreateZaloTrunkBodyField {
    trunkCode: string;
    domain: string;
    appId: string;
    oaId: string;
    port: string;
    accountId: number;
}
