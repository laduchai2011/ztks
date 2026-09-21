import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Message_V1_Field, Call_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    chat_room?: Chat_Room_Field;
    zalo_oa?: Zalo_Oa_Field;
    replied_message?: Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>;
    change_chat_room_master_dialog: {
        is_show: boolean;
    };
    call_dialog: {
        is_show: boolean;
    };
    uid: string;
}
