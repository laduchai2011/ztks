import axios from 'axios';
import { get_Access_Token, refresh_Access_Token } from '@src/zaloToken';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Result_Send_To_Zalo_Field } from '@src/data_struct/zalo/hook_data';
import { Hook_Data_Body_Field } from '@src/data_struct/zalo/hook_data/body';

export async function send_Message_To_User(
    zalo_app: Zalo_App_Field,
    zalo_oa: Zalo_Oa_Field,
    payload: Hook_Data_Body_Field
) {
    try {
        let new_access_token: string | undefined = undefined;
        new_access_token = await get_Access_Token(zalo_oa);
        if (!new_access_token) {
            new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
        }

        const result = await axios.post<Result_Send_To_Zalo_Field>(
            'https://openapi.zalo.me/v3.0/oa/message/cs',
            payload,
            {
                headers: {
                    access_token: new_access_token,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (result?.data.error !== 0) {
            new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
            if (!new_access_token) {
                console.error('send_Message_To_User', 'Could not refresh Zalo access token');
                return;
            }

            const result1 = await axios.post<Result_Send_To_Zalo_Field>(
                'https://openapi.zalo.me/v3.0/oa/message/cs',
                payload,
                {
                    headers: {
                        access_token: new_access_token,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return result1.data;
        }
        return result.data;
    } catch (err: any) {
        // Nếu lỗi hết hạn token
        console.error(err);

        if (err.response?.data?.message === 'Access token has expired') {
            const new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
            if (!new_access_token) {
                console.error('send_Message_To_User', 'Failed to refresh token in Redis');
                return;
            }

            const result = await axios.post<Result_Send_To_Zalo_Field>(
                'https://openapi.zalo.me/v3.0/oa/message/cs',
                payload,
                {
                    headers: {
                        access_token: new_access_token,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return result.data;
        }
    }
}
