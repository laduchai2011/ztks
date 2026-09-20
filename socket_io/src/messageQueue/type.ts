// import { HookDataField } from '@src/data_struct/hook_data';
import { Hook_Data_Field } from '@src/data_struct/zalo/hook_data';

export interface Message_Zalo_Field {
    data: Hook_Data_Field;
    is_new_custom: boolean;
    account_id: string;
}
