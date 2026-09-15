import axios from 'axios';
import { ZaloOaField, ZaloAppField } from '@src/dataStruct/zalo';
import { getAccessToken, refreshAccessToken } from '@src/zaloToken';

export async function sendViaPhone(payload: any, zaloApp: ZaloAppField, zaloOa: ZaloOaField) {
    const url = 'https://business.openapi.zalo.me/message/template';

    try {
        let newAccessToken: string | undefined = undefined;
        newAccessToken = await getAccessToken(zaloOa);
        if (!newAccessToken) {
            newAccessToken = await refreshAccessToken(zaloApp, zaloOa, 10);
        }

        const result = await axios.post<any>(url, payload, {
            headers: {
                access_token: newAccessToken,
                'Content-Type': 'application/json',
            },
        });

        if (result?.data.error !== 0) {
            const newAccessToken = await refreshAccessToken(zaloApp, zaloOa, 10);
            if (!newAccessToken) {
                console.error('sendMessageToUser', 'Could not refresh Zalo access token');
                return;
            }

            const result1 = await axios.post<any>(url, payload, {
                headers: {
                    access_token: newAccessToken,
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
            const newAccessToken = await refreshAccessToken(zaloApp, zaloOa, 10);
            if (!newAccessToken) {
                console.error('sendMessageToUser', 'Failed to refresh token in Redis');
                return;
            }

            const result = await axios.post<any>(url, payload, {
                headers: {
                    access_token: newAccessToken,
                    'Content-Type': 'application/json',
                },
            });

            return result.data;
        }
    }
}
