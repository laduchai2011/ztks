export interface MyCustomerField {
    id: number;
    senderId: string;
    status: string;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface CreateMyCustomerBodyField {
    senderId: string;
    accountId: number;
}

export interface AMyCustomerBodyField {
    senderId: string;
}

export interface MyCustomerBodyField {
    page: number;
    size: number;
    accountId?: number;
}

export interface PagedMyCustomerField {
    items: MyCustomerField[];
    totalCount: number;
}

export interface IsNewMessageField {
    id: number;
    myCustomerId: number;
    updateTime: string;
    createTime: string;
}

export interface IsNewMessageBodyField {
    myCustomerId: number;
}

export interface DelIsNewMessageBodyField {
    id: number;
}
