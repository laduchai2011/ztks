import axios from 'axios';
import { QueryDB } from '@src/services/myCustomer/interface';
import { ZaloCustomerField } from '@src/dataStruct/hookData';
import { refreshAccessToken, getAccessToken } from '@src/services/zalo_webhook/handle/TokenZaloOA';

class QueryZalo_GetInforCustomerOnZalo extends QueryDB {
    private _customerId: string | undefined;

    constructor() {
        super();
    }

    setCustomerId = (customerId: string) => {
        this._customerId = customerId;
    };

    async run(): Promise<ZaloCustomerField | void> {
        if (this._customerId !== undefined) {
            try {
                const result = await getZaloUserInfo(this._customerId);

                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryZalo_GetInforCustomerOnZalo;

async function getZaloUserInfo(customerId: string): Promise<ZaloCustomerField | void> {
    try {
        const token = await getAccessToken();

        // const res = await axios.get('https://openapi.zalo.me/v3.0/oa/getprofile', {
        //     params: {
        //         data: JSON.stringify({ user_id: customerId }),
        //     },
        //     headers: {
        //         access_token: token,
        //     },
        // });
        const res = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
            params: {
                data: JSON.stringify({ user_id: customerId }),
            },
            headers: {
                access_token: token,
            },
        });

        const resData = res.data as ZaloCustomerField;

        if (resData.error !== 0) {
            const newToken = await refreshAccessToken({ repeat: 5 });
            if (!newToken) {
                console.error('Could not refresh Zalo access token');
                return;
            }

            const res1 = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
                params: {
                    data: JSON.stringify({ user_id: customerId }),
                },
                headers: {
                    access_token: newToken,
                },
            });

            return res1.data as ZaloCustomerField;
        }

        return resData;
    } catch (err: any) {
        // Nếu lỗi hết hạn token
        console.error('getZaloUserInfo', 'catch', err);

        // if (err.response?.data?.message === 'Access token has expired') {
        //     const newToken = await refreshAccessToken();
        //     if (!newToken) {
        //         console.error('Could not refresh Zalo access token');
        //         return;
        //     }

        //     const res = await axios.get('https://openapi.zalo.me/v3.0/oa/user/detail', {
        //         params: {
        //             data: JSON.stringify({ user_id: customerId }),
        //         },
        //         headers: {
        //             access_token: newToken,
        //         },
        //     });

        //     return res.data as ZaloCustomerField;
        // }
    }
}
