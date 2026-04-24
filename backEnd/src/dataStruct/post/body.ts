export interface GetRegisterPostsBodyField {
    page: number;
    size: number;
    isDelete?: boolean;
    accountId: number;
}

export interface GetPostsBodyField {
    page: number;
    size: number;
    isActive?: boolean;
    registerPostId: number;
}

export interface GetPostWithIdBodyField {
    id: number;
}

export interface CreateRegisterPostBodyField {
    name: string;
    type: string;
    zaloOaId: number;
    accountId: number;
}

export interface EditRegisterPostBodyField {
    id: number;
    name: string;
    zaloOaId: number;
    accountId: number;
}

export interface DeleteRegisterPostBodyField {
    id: number;
    accountId: number;
}

export interface CreatePostBodyField {
    name: string;
    type: string;
    title: string;
    describe: string;
    images: string;
    isActive: boolean;
    registerPostId: number;
    accountId: number;
}

export interface EditPostBodyField {
    id: number;
    name: string;
    title: string;
    describe: string;
    images: string;
    isActive: boolean;
    accountId: number;
}
