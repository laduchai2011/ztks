import { HookDataField } from '@src/data_struct/hookData';

export interface MessageZaloField {
    data: HookDataField;
    isNewCustom: boolean;
    accountId: number;
}
