export interface CreateAgentBodyField {
    accountId: number;
}

export interface AgentAddAccountBodyField {
    id: number;
    agentAccountId?: number;
    accountId: number;
}

export interface AgentDelAccountBodyField {
    id: number;
    accountId: number;
}

export interface GetAgentsBodyField {
    page: number;
    size: number;
    offset: number;
    agentAccountId?: number;
    accountId: number;
}

export interface GetAgentWithAgentAccountIdBodyField {
    agentAccountId: number;
}

export interface CreateAgentPayBodyField {
    agentId: number;
    accountId: number;
}

export interface UpdateAgentPaidBodyField {
    id: number;
    money: number;
}

export interface GetLastAgentPayBodyField {
    agentId: number;
    accountId: number;
}
