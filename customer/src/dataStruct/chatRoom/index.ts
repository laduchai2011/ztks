export interface ChatRoomField {
    id: number;
    userIdByApp: string;
    status: string;
    zaloOaId: number;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface ChatRoomRoleField {
    id: number;
    authorizedAccountId: number;
    backGroundColor: string | null;
    isRead: boolean;
    isSend: boolean;
    status: string;
    chatRoomId: number;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface ChatRoomRoleSchema {
    authorized_account_id: number;
    is_read: boolean;
    is_send: boolean;
    chat_room_id: number;
    zalo_oa_id: number;
    account_id: number;
}

export interface PagedChatRoomField {
    items: ChatRoomField[];
    totalCount: number;
}

export interface PagedChatRoomMongoField {
    items: ChatRoomRoleSchema[];
    cursor: string | null;
}
