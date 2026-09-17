import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { HookDataField } from '@src/dataStruct/zalo/hookData';
import { ChatSessionField } from '@src/datastruct/chat_session';

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
