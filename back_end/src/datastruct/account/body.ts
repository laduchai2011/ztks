import { account_type_type } from '.';

export interface Get_Reply_Account_Body_Field {
    page: number;
    size: number;
    chat_room_id: string;
}

export interface Get_Not_Reply_Account_Body_Field {
    page: number;
    size: number;
    chat_room_id: string;
    account_id: string;
}

export interface Create_Reply_Account_Body_Field {
    authorized_account_id: string;
    chat_room_id: string;
    account_id: string;
}

export interface Get_Account_Receive_Message_Body_Field {
    zalo_oa_id: string;
    account_id: string;
}

export interface Create_Account_Receive_Message_Body_Field {
    account_id_receive_message?: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface Update_Account_Receive_Message_Body_Field {
    account_id_receive_message?: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface Get_Members_Body_Field {
    page: number;
    size: number;
    searched_account_id?: string;
    account_id: string;
}

export interface Add_Member_V1_Body_Field {
    added_by_id: string;
    account_id: string;
}

export interface Create_Account_Information_Body_Field {
    account_type: account_type_type;
    account_id: string;
}

export interface Edit_Infor_Account_Body_Field {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface Check_Forget_Password_Body_Field {
    user_name: string;
    phone: string;
}

export interface Forget_Password_Body_Field {
    user_name: string;
    password: string;
    phone: string;
}

export interface Get_My_Recommend_Body_Field {
    account_id: string;
}

export interface Add_Your_Recommend_Body_Field {
    your_code: string;
    account_id: string;
}

export interface Get_My_Account_Information_Body_Field {
    account_id: string;
}

export interface Leave_All_Account_Receive_Message_Body_Field {
    account_id: string;
}

export interface Leave_Admin_Body_Field {
    account_id: string;
}
