import axios from 'axios';
import { getAccessToken, refreshAccessToken } from '@src/zaloToken';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { ResultSendToZaloField } from '@src/dataStruct/zalo/hookData';
import { HookDataBodyField } from '@src/dataStruct/zalo/hookData/body';

export async function sendMessageToUser(zaloApp: ZaloAppField, zaloOa: ZaloOaField, payload: HookDataBodyField) {
    try {
        let newAccessToken: string | undefined = undefined;
        newAccessToken = await getAccessToken(zaloOa);
        if (!newAccessToken) {
            newAccessToken = await refreshAccessToken(zaloApp, zaloOa, 10);
        }

        const result = await axios.post<ResultSendToZaloField>('https://openapi.zalo.me/v3.0/oa/message/cs', payload, {
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

            const result1 = await axios.post<ResultSendToZaloField>(
                'https://openapi.zalo.me/v3.0/oa/message/cs',
                payload,
                {
                    headers: {
                        access_token: newAccessToken,
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
            const newAccessToken = await refreshAccessToken(zaloApp, zaloOa, 10);
            if (!newAccessToken) {
                console.error('sendMessageToUser', 'Failed to refresh token in Redis');
                return;
            }

            const result = await axios.post<ResultSendToZaloField>(
                'https://openapi.zalo.me/v3.0/oa/message/cs',
                payload,
                {
                    headers: {
                        access_token: newAccessToken,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return result.data;
        }
    }
}
