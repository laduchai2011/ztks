import { Register_Post_Type_Type, Post_Type_Type } from '.';

export interface Get_Register_Post_With_Id_Body_Field {
    id: string;
}

export interface Get_Register_Posts_Body_Field {
    page: number;
    size: number;
    is_delete?: boolean;
    account_id: string;
}

export interface Get_Posts_Body_Field {
    page: number;
    size: number;
    is_active?: boolean;
    register_post_id: string;
}

export interface Get_Post_With_Id_Body_Field {
    id: string;
}

export interface Create_Register_Post_Body_Field {
    name: string;
    type: Register_Post_Type_Type;
    zalo_oa_id: string;
    account_id: string;
}

export interface Edit_Register_Post_Body_Field {
    id: string;
    name: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface Delete_Register_Post_Body_Field {
    id: string;
    account_id: string;
}

export interface Create_Post_Body_Field {
    index: number;
    name: string;
    type: Post_Type_Type;
    title: string;
    describe: string;
    images: string;
    is_active: boolean;
    register_post_id: string;
    account_id: string;
}

export interface Edit_Post_Body_Field {
    id: string;
    index: number;
    name: string;
    title: string;
    describe: string;
    images: string;
    is_active: boolean;
    account_id: string;
}
