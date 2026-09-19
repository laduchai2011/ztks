import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Hook_Data_Field } from '@src/data_struct/zalo/hook_data';
import { Chat_Session_Field } from '@src/data_struct/chat_session';

export interface Is_Pass_Field {
    is_pass: boolean;
    zalo_app: Zalo_App_Field | null;
    zalo_oa: Zalo_Oa_Field | null;
}

export interface Wait_Session_Field {
    hook_datas: Hook_Data_Field[];
    is_session: boolean;
    index: number;
    max_index: number;
    final: boolean;
    chat_session?: Chat_Session_Field;
}
