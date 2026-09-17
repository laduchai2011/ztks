export interface Note_Field {
    id: string;
    note: string;
    is_delete: boolean;
    chat_room_id: string;
    update_time: string;
    create_time: string;
}

export interface Paged_Note_Field {
    items: Note_Field[];
    total_count: number;
}
