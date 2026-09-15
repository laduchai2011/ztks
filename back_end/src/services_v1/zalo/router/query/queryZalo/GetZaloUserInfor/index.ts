import axios from 'axios';
import { ZaloUserField } from '@src/dataStruct/zalo/user';
import { ZaloUserBodyField } from '@src/dataStruct/zalo/user/body';
import { refreshAccessToken, getAccessToken } from '@src/zaloToken';

class QueryZalo_GetZaloUserInfor {
    private _zaloUserBody: ZaloUserBodyField | undefined;

    constructor() {}

    setZaloUserBody = (zaloUserBody: ZaloUserBodyField) => {
        this._zaloUserBody = zaloUserBody;
    };

    async run(): Promise<ZaloUserField | void> {
        if (this._zaloUserBody !== undefined) {
            try {
                const result = await getZaloUserInfo(this._zaloUserBody);

                return result;
            } catch (error) {
                console.error(error);
                return;
            }
        }
    }
}

export default QueryZalo_GetZaloUserInfor;

async function getZaloUserInfo(zaloUserBody: ZaloUserBodyField): Promise<ZaloUserField | void> {
    const zaloApp = zaloUserBody.zaloApp;
    const zaloOa = zaloUserBody.zaloOa;
    const userIdByApp = zaloUserBody.userIdByApp;

    try {
        let newAccessToken: string | undefined = undefined;
        newAccessToken = await getAccessToken(zaloOa);
        if (!newAccessToken) {
            newAccessToken = await refreshAccessToken(zaloApp, zaloOa, 5);
        }

        const res = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
            params: {
                data: JSON.stringify({ user_id: userIdByApp }),
            },
            headers: {
                access_token: newAccessToken,
            },
        });

        const resData = res.data as ZaloUserField;

        if (resData.error !== 0) {
            const newAccessToken = await refreshAccessToken(zaloUserBody.zaloApp, zaloUserBody.zaloOa, 5);
            if (!newAccessToken) {
                console.error('Could not refresh Zalo access token');
                return;
            }

            const res1 = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
                params: {
                    data: JSON.stringify({ user_id: userIdByApp }),
                },
                headers: {
                    access_token: newAccessToken,
                },
            });

            return res1.data as ZaloUserField;
        }

        return resData;
    } catch (err: any) {
        // Nếu lỗi hết hạn token
        console.error('getZaloUserInfo', 'catch', err);

        if (err.response?.data?.message === 'Access token has expired') {
            const newAccessToken = await refreshAccessToken(zaloApp, zaloOa, 5);
            if (!newAccessToken) {
                console.error('Could not refresh Zalo access token');
                return;
            }

            const res = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
                params: {
                    data: JSON.stringify({ user_id: userIdByApp }),
                },
                headers: {
                    access_token: newAccessToken,
                },
            });

            return res.data as ZaloUserField;
        }
    }
}
