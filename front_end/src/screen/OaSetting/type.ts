import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Chat_Session_Field } from '@src/data_struct/chat_session';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    del_dialog: {
        is_show: boolean;
    };
    dialog_loading: {
        is_show: boolean;
    };
    zalo_oa?: Zalo_Oa_Field;
    chat_sessions: Chat_Session_Field[];
    take_token_dialog: {
        is_show: boolean;
        zalo_oa?: Zalo_Oa_Field;
    };
    edit_zalo_oa: {
        is_show: boolean;
        zalo_oa?: Zalo_Oa_Field;
        new_zalo_oa?: Zalo_Oa_Field;
    };
    create_zalo_trunk_dialog: {
        is_show: boolean;
        zalo_oa?: Zalo_Oa_Field;
    };
}

export enum Crud_Enum {
    CREATE = 'CREATE',
    LOAD_MORE = 'LOAD_MORE',
}

export type Crud_Type = Crud_Enum.CREATE | Crud_Enum.LOAD_MORE;
