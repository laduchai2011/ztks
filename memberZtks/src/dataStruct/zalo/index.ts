export interface ZaloAppField {
    id: number;
    label: string;
    appId: string;
    appName: string;
    appSecret: string;
    status: string;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface ZaloOaField {
    id: number;
    label: string;
    oaId: string;
    oaName: string;
    oaSecret: string;
    status: string;
    zaloAppId: number;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface ZaloOaTokenField {
    refreshToken: string;
    zaloOaId: number;
}

export interface OaPermissionField {
    id: number;
    role: string;
    status: string;
    zaloOaId: string;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface PagedZaloOaField {
    items: ZaloOaField[];
    totalCount: number;
}
