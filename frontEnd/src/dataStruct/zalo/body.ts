import { ZnsMessageType } from '.';

export interface CreateZaloOaBodyField {
    label: string;
    oaId: string;
    oaName: string;
    oaSecret: string;
    zaloAppId: number;
    accountId: number;
}

export interface EditZaloOaBodyField {
    id: number;
    label: string;
    oaId: string;
    oaName: string;
    oaSecret: string;
    zaloAppId: number;
    accountId: number;
}

export interface ZaloAppWithAccountIdBodyField {
    accountId: number;
    role: string;
}

export interface ZaloOaListWith2FkBodyField {
    page: number;
    size: number;
    zaloAppId: number;
    accountId: number;
}

export interface GetZaloOaTokenWithFkBodyField {
    zaloOaId: number;
    accountId: number;
}

export interface CreateZaloOaTokenBodyField {
    refreshToken: string;
    zaloOaId: number;
    accountId: number;
}

export interface UpdateRefreshTokenOfZaloOaBodyField {
    refreshToken: string;
    zaloOaId: number;
    accountId: number;
}

export interface IsMyOaBodyField {
    id: number;
    accountId: number;
}

export interface ZaloOaWithIdBodyField {
    id: number;
    accountId: number; // to determine admin or member
}

export interface CheckZaloAppWithAppIdBodyField {
    appId: string;
}

export interface CheckZaloOaListWithZaloAppIdBodyField {
    zaloAppId: number;
}

export interface PlaywightGetZaloAppBodyField {
    userName: string;
    password: string;
}

export interface GenZaloOaTokenBodyField {
    appId: string;
    appSecret: string;
    code: string;
}

export interface CreateZnsTemplateBodyField {
    temId: string;
    images: string;
    dataFields: string;
    phoneCost: number;
    uidCost: number;
    zaloOaId: number;
    accountId: number;
}

export interface EditZnsTemplateBodyField {
    id: number;
    temId: string;
    images: string;
    dataFields: string;
    phoneCost: number;
    uidCost: number;
    zaloOaId: number;
    accountId: number;
}

export interface GetZnsTemplatesBodyField {
    page: number;
    size: number;
    offset: number;
    zaloOaId: number;
    accountId: number;
}

export interface CreateZnsMessageBodyField {
    type: ZnsMessageType;
    data: string;
    znsTemplateId: number;
    accountId: number;
}

export interface GetZnsMessagesBodyField {
    page: number;
    size: number;
    znsTemplateId: number;
    accountId: number;
}
