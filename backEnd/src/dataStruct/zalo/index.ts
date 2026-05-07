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

export interface PlaywightGetZaloAppField {
    zaloApp: ZaloAppField;
    token: string;
}

export interface GenZaloOaTokenResultField {
    access_token: string;
    refresh_token: string;
    expires_in: string;
}

export interface ZnsTemplateField {
    id: number;
    temId: string;
    images: string;
    dataFields: string;
    phoneCost: number;
    uidCost: number;
    isDelete: boolean;
    zaloOaId: number;
    updateTime: string;
    createTime: string;
}

export interface PagedZnsTemplateField {
    items: ZnsTemplateField[];
    totalCount: number;
}

export interface ZnsMessageField {
    id: number;
    type: ZnsMessageType;
    data: string;
    znsTemplateId: number;
    accountId: number;
    createTime: string;
}

export interface PagedZnsMessageField {
    items: ZnsMessageField[];
    totalCount: number;
}

export enum ZnsMessageEnum {
    PHONE = 'phone',
    UID = 'uid',
    HASH_PHONE = 'hashPhone',
}

export type ZnsMessageType = ZnsMessageEnum.PHONE | ZnsMessageEnum.UID | ZnsMessageEnum.HASH_PHONE;
