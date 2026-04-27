export interface RegisterPostField {
    id: number;
    name: string;
    type: RegisterPostTypeType;
    expiryTime: string | null;
    isDelete: boolean;
    zaloOaId: number;
    accountId: number;
    createTime: string;
}

export enum RegisterPostTypeEnum {
    FREE = 'free',
    UPGRADE = 'upgrade',
}
export type RegisterPostTypeType = RegisterPostTypeEnum.FREE | RegisterPostTypeEnum.UPGRADE;

export interface PagedRegisterPostField {
    items: RegisterPostField[];
    totalCount: number;
}

export interface PostField {
    id: number;
    index: number;
    name: string;
    type: PostTypeType;
    title: string;
    describe: string;
    images: string;
    isActive: boolean;
    registerPostId: number;
    createTime: string;
}

export enum PostTypeEnum {
    FREE = 'free',
    UPGRADE = 'upgrade',
}
export type PostTypeType = PostTypeEnum.FREE | PostTypeEnum.UPGRADE;

export interface PagedPostField {
    items: PostField[];
    totalCount: number;
}
