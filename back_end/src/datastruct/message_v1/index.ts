import { Hook_Data_Schema, Hook_Call_Schema } from '@src/dataStruct/zalo/hookData';
import { Chat_Room_Role_Field } from '../chatRoom';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Message_V1_Field<T> extends Hook_Data_Schema<T> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Call_V1_Field<T> extends Hook_Call_Schema<T> {}

export interface New_Message_V1_Field<T> extends Message_V1_Field<T> {
    account_id: string;
    created_at: Date;
}
export interface New_Call_V1_Field<T> extends Call_V1_Field<T> {
    account_id: string;
    created_at: Date;
}

export interface Paged_Message_V1_Field<T, K> {
    items: (Message_V1_Field<T> | Call_V1_Field<K>)[];
    cursor: string | null;
}

export interface Socket_Message_Field {
    chat_room_id: string;
    _id: string;
    all_chat_room_roles: Chat_Room_Role_Field[];
}

export interface Message_Amount_In_Day_Field {
    amount: number;
    dateKey: string;
    account_id: string;
    timestamp: Date;
}
