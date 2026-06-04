import { CallTypeType } from '.';
import { ZaloAppField, ZaloOaField } from '../zalo';

export interface RequestConsentBodyField {
    phone: string;
    call_type: CallTypeType;
    reason_code: number;
    zaloOa: ZaloOaField;
    zaloApp: ZaloAppField;
    accountId: number;
}

export interface CheckConsentBodyField {
    phone: string;
    zaloOa: ZaloOaField;
    zaloApp: ZaloAppField;
    accountId: number;
}

export interface OutboundBodyField {
    user_id: string;
    agent_id: string;
    call_type: CallTypeType;
    zaloOa: ZaloOaField;
    zaloApp: ZaloAppField;
    accountId: number;
}

export interface InboundBodyField {
    branch_id: string;
    agent_id: string;
    call_type: CallTypeType;
    zaloOa: ZaloOaField;
    zaloApp: ZaloAppField;
    accountId: number;
}
