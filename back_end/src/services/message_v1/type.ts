import { ZaloAppField, ZaloOaField } from '@src/data_struct/zalo';
import { HookDataField } from '@src/data_struct/zalo/hookData';
import { ChatSessionField } from '@src/data_struct/chat_session';

export interface IsPassField {
    isPass: boolean;
    zaloApp: ZaloAppField | null;
    zaloOa: ZaloOaField | null;
}

export interface WaitSessionField {
    hookDatas: HookDataField[];
    isSession: boolean;
    index: number;
    maxIndex: number;
    final: boolean;
    chatSession?: ChatSessionField;
}
