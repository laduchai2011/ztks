export interface NoteField {
    id: number;
    note: string;
    isDelete: boolean;
    chatRoomId: number;
    updateTime: Date;
    createTime: Date;
}

export interface PagedNoteField {
    items: NoteField[];
    totalCount: number;
}
