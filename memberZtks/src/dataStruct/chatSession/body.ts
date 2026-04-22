export interface ChatSessionBodyField {
    label: string;
    code: string;
    isReady: boolean;
    selectedAccountId: number;
    zaloOaId: number;
    accountId: number;
}

export interface ChatSessionWithAccountIdBodyField {
    page: number;
    size: number;
    zaloOaId: number;
    accountId: number;
}

export interface UpdateSelectedAccountIdOfChatSessionBodyField {
    id: number;
    selectedAccountId: number;
    accountId: number;
}

export interface UpdateIsReadyOfChatSessionBodyField {
    id: number;
    isReady: boolean;
    accountId: number;
}

export interface UserTakeSessionToChatBodyField {
    code: string;
    zaloOaId: number;
}
