import { accountType_type } from '.';

export interface GetReplyAccountBodyField {
    page: number;
    size: number;
    chatRoomId: number;
}

export interface GetNotReplyAccountBodyField {
    page: number;
    size: number;
    chatRoomId: number;
    accountId: number;
}

export interface CreateReplyAccountBodyField {
    authorizedAccountId: number;
    chatRoomId: number;
    accountId: number;
}

export interface GetAccountReceiveMessageBodyField {
    zaloOaId: number;
    accountId: number;
}

export interface CreateAccountReceiveMessageBodyField {
    accountIdReceiveMessage?: number;
    zaloOaId: number;
    accountId: number;
}

export interface UpdateAccountReceiveMessageBodyField {
    accountIdReceiveMessage?: number;
    zaloOaId: number;
    accountId: number;
}

export interface GetMembersBodyField {
    page: number;
    size: number;
    searchedAccountId?: number;
    accountId: number;
}

export interface AddMemberV1BodyField {
    addedById: number;
    accountId: number;
}

export interface CreateAccountInformationBodyField {
    accountType: accountType_type;
    accountId: number;
}
