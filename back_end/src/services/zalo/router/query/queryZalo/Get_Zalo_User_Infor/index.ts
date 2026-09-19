import axios from 'axios';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';
import { Get_Zalo_User_Body_Field } from '@src/data_struct/zalo/user/body';
import { refresh_Access_Token, get_Access_Token } from '@src/zaloToken';

class QueryZalo_Get_Zalo_User_Infor {
    private _get_zalo_user_body: Get_Zalo_User_Body_Field | undefined;

    set_Get_Zalo_User_Body(get_zalo_user_body: Get_Zalo_User_Body_Field) {
        this._get_zalo_user_body = get_zalo_user_body;
    }

    async run(): Promise<Zalo_User_Field | void> {
        if (this._get_zalo_user_body !== undefined) {
            try {
                const result = await get_Zalo_User_Info(this._get_zalo_user_body);

                return result;
            } catch (error) {
                console.error(error);
                return;
            }
        }
    }
}

export default QueryZalo_Get_Zalo_User_Infor;

async function get_Zalo_User_Info(get_zalo_user_body: Get_Zalo_User_Body_Field): Promise<Zalo_User_Field | void> {
    const zalo_app = get_zalo_user_body.zalo_app;
    const zalo_oa = get_zalo_user_body.zalo_oa;
    const user_id_by_app = get_zalo_user_body.user_id_by_app;

    try {
        let new_access_token: string | undefined = undefined;
        new_access_token = await get_Access_Token(zalo_oa);
        if (!new_access_token) {
            new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 5);
        }

        const res = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
            params: {
                data: JSON.stringify({ user_id: user_id_by_app }),
            },
            headers: {
                access_token: new_access_token,
            },
        });

        const res_data = res.data as Zalo_User_Field;

        if (res_data.error !== 0) {
            new_access_token = await refresh_Access_Token(get_zalo_user_body.zalo_app, get_zalo_user_body.zalo_oa, 5);
            if (!new_access_token) {
                console.error('Could not refresh Zalo access token');
                return;
            }

            const res1 = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
                params: {
                    data: JSON.stringify({ user_id: user_id_by_app }),
                },
                headers: {
                    access_token: new_access_token,
                },
            });

            return res1.data as Zalo_User_Field;
        }

        return res_data;
    } catch (err: any) {
        // Nếu lỗi hết hạn token
        console.error('get_zalo_user_info', 'catch', err);

        if (err.response?.data?.message === 'Access token has expired') {
            const new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 5);
            if (!new_access_token) {
                console.error('Could not refresh Zalo access token');
                return;
            }

            const res = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
                params: {
                    data: JSON.stringify({ user_id: user_id_by_app }),
                },
                headers: {
                    access_token: new_access_token,
                },
            });

            return res.data as Zalo_User_Field;
        }
    }
}
