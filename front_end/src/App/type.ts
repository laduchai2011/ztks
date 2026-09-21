import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Call_In_State_Type, Call_Out_State_Type, Call_In_Cmd_Type, Call_Out_Cmd_Type } from '@src/data_struct/call';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    account?: Account_Field;
    account_information?: Account_Information_Field;
    my_admin?: string;
    zalo_app?: Zalo_App_Field;
    call_dialog: {
        is_show: boolean;
        uid?: string;
        chat_room_id?: string;
        zalo_oa?: Zalo_Oa_Field;
        zalo_user?: Zalo_User_Field;
        call_in_cmd_type: Call_In_Cmd_Type;
        call_out_cmd_type: Call_Out_Cmd_Type;
        call_in_state: Call_In_State_Type;
        call_out_state: Call_Out_State_Type;
    };
}
