export interface CreateNoteBodyField {
    note: string;
    chatRoomId: number;
    accountId: number;
}

export interface GetNotesBodyField {
    page: number;
    size: number;
    offset: number;
    isDelete?: boolean;
    chatRoomId: number;
    accountId: number;
}

export interface UpdateNoteBodyField {
    id: number;
    note: string;
    accountId: number;
}
