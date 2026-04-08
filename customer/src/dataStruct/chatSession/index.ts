export interface ChatSessionField {
    id: number;
    label: string;
    code: string;
    isReady: boolean;
    status: string;
    selectedAccountId: number;
    zaloOaId: number;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface PagedChatSessionField {
    items: ChatSessionField[];
    totalCount: number;
}
