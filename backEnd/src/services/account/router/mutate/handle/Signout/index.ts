import { Request, Response } from 'express';
import ServiceRedis from '@src/cache/cacheRedis';
import { MyResponse } from '@src/dataStruct/response';
import { dev_prefix } from '@src/mode';
import { mssqlDeleteCacheRedisWithKey } from '@src/cache/cacheMssql';
import { DeviceType, DeviceEnum } from '@src/device/type';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const isProduct = process.env.NODE_ENV === 'production';

let secure_cookie = false;
if (process.env.NODE_ENV !== 'development') {
    secure_cookie = true;
}

const sameSite = process.env.NODE_ENV === 'development' ? 'lax' : 'none';
// const sameSite = 'none';
const cookieDomain = isProduct ? '.5kaquarium.com' : 'zalo5k.local.com';

class Handle_Signout {
    constructor() {}

    async main(req: Request, res: Response) {
        const device = req.headers['x-device-type'] as DeviceType;

        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
            message: 'Bắt đầu đăng xuất !',
        };

        try {
            switch (device) {
                case DeviceEnum.WEB: {
                    const id = req.cookies?.id;
                    if (id) {
                        // Xóa dữ liệu token trong Redis
                        const keyServiceRedisWeb = `web-token-storeAuthToken-${id}_${dev_prefix}`;
                        await serviceRedis.deleteData(keyServiceRedisWeb);

                        await mssqlDeleteCacheRedisWithKey(keyServiceRedisWeb);
                    }

                    const cookieOptions = {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: sameSite as 'lax' | 'none' | 'strict',
                        domain: cookieDomain,
                    };

                    // Xóa cookie
                    res.clearCookie('id', cookieOptions);
                    res.clearCookie('accessToken', cookieOptions);
                    res.clearCookie('refreshToken', cookieOptions);
                    res.clearCookie('socketToken', cookieOptions);

                    break;
                }
                case DeviceEnum.MOBILE: {
                    const id = req.headers['x-account-id'] as string;
                    if (id) {
                        // Xóa dữ liệu token trong Redis
                        const keyServiceRedisMobile = `mobile-token-storeAuthToken-${id}_${dev_prefix}`;
                        await serviceRedis.deleteData(keyServiceRedisMobile);

                        await mssqlDeleteCacheRedisWithKey(keyServiceRedisMobile);
                    }

                    res.setHeader('x-account-id', '');
                    res.setHeader('x-access-token', '');
                    res.setHeader('x-refresh-token', '');
                    res.setHeader('x-socket-token', '');

                    break;
                }
                default: {
                    console.log('Chưa xác định thiết bị !');
                    myResponse.message = 'Chưa xác định thiết bị !';
                    res.status(500).json(myResponse);
                    return;
                }
            }

            myResponse.message = 'Đăng xuất thành công và cookie đã được xóa.';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        } catch (error) {
            myResponse.message = 'Đăng xuất thất bại !';
            myResponse.err = error;
            res.status(500).json(myResponse);
        }
    }
}

export default Handle_Signout;
