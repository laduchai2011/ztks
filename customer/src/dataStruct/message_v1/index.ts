import { HookDataSchema } from '@src/dataStruct/zalo/hookData';
import { ChatRoomRoleField } from '../chatRoom';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MessageV1Field<T> extends HookDataSchema<T> {}

export interface NewMessageV1Field<T> extends MessageV1Field<T> {
    account_id: number;
    created_at: Date;
}

export interface PagedMessageV1Field<T> {
    items: MessageV1Field<T>[];
    cursor: string | null;
}

export interface SocketMessageField {
    chatRoomId: number;
    _id: string;
    allChatRoomRoles: ChatRoomRoleField[];
}

export interface MessageAmountInDayField {
    amount: number;
    account_id: number;
    timestamp: Date;
}
