import { Zalo_App_Field, Zalo_Oa_Field } from '..';

export interface Get_Zalo_User_Body_Field {
    user_id_by_app: string;
    zalo_app: Zalo_App_Field;
    zalo_oa: Zalo_Oa_Field;
}
