export interface ChatRoomBodyField {
    userIdByApp: string;
    zaloOaId: number;
    accountId: number;
}

export interface UserTakeRoomToChatBodyField {
    userIdByApp: string;
    zaloOaId: number;
}

export interface GetChatRoomWithIdBodyField {
    id: number;
}

export interface ChatRoomRoleWithCridAaidBodyField {
    authorizedAccountId: number;
    chatRoomId: number;
}

export interface GetAllChatRoomRoleWithCridBodyField {
    chatRoomId: number;
}

export interface GetChatRoomWithZaloOaIdUserIdByAppBodyField {
    zaloOaId: number;
    userIdByApp: string;
}

export interface UpdateSetupChatRoomRoleBodyField {
    id: number;
    backGroundColor: string;
    isRead: boolean;
    isSend: boolean;
    accountId: number; // để xác định người có quyền cập nhật
}

export interface CreateChatRoomRoleBodyField {
    authorizedAccountId: string;
    chatRoomId: number;
    accountId: number;
}

export interface ChatRoomsMongoBodyField {
    limit: number;
    cursor: string | null;
    isMy: boolean;
    zaloOaId?: number;
    authorizedAccountId?: number;
    isRead?: boolean;
    isSend?: boolean;
    accountId?: number;
}

export interface ChangeChatRoomMasterBodyField {
    chatRoomId: number;
    newAccountId: number;
    accountId: number;
}
