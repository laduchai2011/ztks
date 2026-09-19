import { HookDataField } from '@src/data_struct/hook_data';

export interface MessageZaloField {
    data: HookDataField;
    isNewCustom: boolean;
    accountId: number;
}
