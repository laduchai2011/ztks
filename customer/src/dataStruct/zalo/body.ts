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
}

export interface ZaloOaTokenBodyField {
    refreshToken: string;
    zaloOaId: number;
}

export interface UpdateRefreshTokenOfZaloOaBodyField {
    refreshToken: string;
    zaloOaId: number;
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
