export interface NoteField {
    id: number;
    note: string;
    status: string;
    chatRoomId: number;
    zaloOaId: number;
    accountId: number;
    updateTime: Date;
    createTime: Date;
}

export interface PagedNoteField {
    items: NoteField[];
    totalCount: number;
}
