export interface AccountField {
    id: number;
    userName: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    status: string;
    updateTime: string;
    createTime: string;
}

export interface AccountInformationField {
    addedById: number | null;
    accountType: accountType_enum;
    accountId: number;
}

export enum accountType_enum {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export type accountType_type = accountType_enum.ADMIN | accountType_enum.MEMBER;

export interface AddMemberBodyField {
    userName: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    addedById: number;
}

export interface AllMembersBodyField {
    addedById: number;
}

export interface PagedAccountField {
    items: AccountField[];
    totalCount: number;
}

export interface AccountReceiveMessageField {
    accountIdReceiveMessage: number | null;
    zaloOaId: number;
    accountId: number;
}

export interface RecommendField {
    myCode: string;
    yourCode: string | null;
    accountId: number;
}
