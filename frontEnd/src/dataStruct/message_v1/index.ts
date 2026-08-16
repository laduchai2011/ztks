import { HookDataSchema, HookCallSchema } from '@src/dataStruct/zalo/hookData';
import { ChatRoomRoleField } from '../chatRoom';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MessageV1Field<T> extends HookDataSchema<T> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CallV1Field<T> extends HookCallSchema<T> {}

export interface NewMessageV1Field<T> extends MessageV1Field<T> {
    account_id: number;
    created_at: Date;
}
export interface NewCallV1Field<T> extends CallV1Field<T> {
    account_id: number;
    created_at: Date;
}

export interface PagedMessageV1Field<T, K> {
    items: (MessageV1Field<T> | CallV1Field<K>)[];
    cursor: string | null;
}

export interface SocketMessageField {
    chatRoomId: number;
    _id: string;
    allChatRoomRoles: ChatRoomRoleField[];
}

export interface MessageAmountInDayField {
    amount: number;
    dateKey: string;
    account_id: number;
    timestamp: Date;
}
