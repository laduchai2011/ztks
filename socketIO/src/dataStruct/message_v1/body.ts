import { ZaloAppField, ZaloOaField } from '../zalo';
import { HookDataBodyField } from '../zalo/hookData/body';

export interface MessageV1BodyField {
    cursor: string | null;
    size: number;
    chatRoomId: number;
}

export interface CreateMessageV1BodyField {
    zaloApp: ZaloAppField;
    zaloOa: ZaloOaField;
    payload: HookDataBodyField;
    chatRoomId: number;
}
