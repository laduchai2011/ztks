import { ZaloAppField, ZaloOaField } from '..';

export interface ZaloUserBodyField {
    userIdByApp: string;
    zaloApp: ZaloAppField;
    zaloOa: ZaloOaField;
}
