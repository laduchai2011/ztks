import axios from 'axios';
import { Zalo_Oa_Field, Zalo_App_Field } from '@src/data_struct/zalo';
import { get_Access_Token, refresh_Access_Token } from '@src/zaloToken';

export async function send_Via_Phone(payload: any, zalo_app: Zalo_App_Field, zalo_oa: Zalo_Oa_Field) {
    const url = 'https://business.openapi.zalo.me/message/template';

    try {
        let new_access_token: string | undefined = undefined;
        new_access_token = await get_Access_Token(zalo_oa);
        if (!new_access_token) {
            new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
        }

        const result = await axios.post<any>(url, payload, {
            headers: {
                access_token: new_access_token,
                'Content-Type': 'application/json',
            },
        });

        if (result?.data.error !== 0) {
            new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
            if (!new_access_token) {
                console.error('sendMessageToUser', 'Could not refresh Zalo access token');
                return;
            }

            const result1 = await axios.post<any>(url, payload, {
                headers: {
                    access_token: new_access_token,
                    'Content-Type': 'application/json',
                },
            });

            return result1.data;
        }
        return result.data;
    } catch (err: any) {
        // Nếu lỗi hết hạn token
        console.error(err);

        if (err.response?.data?.message === 'Access token has expired') {
            const new_access_token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
            if (!new_access_token) {
                console.error('sendMessageToUser', 'Failed to refresh token in Redis');
                return;
            }

            const result = await axios.post<any>(url, payload, {
                headers: {
                    access_token: new_access_token,
                    'Content-Type': 'application/json',
                },
            });

            return result.data;
        }
    }
}
