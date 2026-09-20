import { Request, Response } from 'express';
import ServiceRedis from '@src/cache/cacheRedis';
import { My_Response_Field } from '@src/data_struct/response';
import { dev_prefix } from '@src/mode';
import { postgresql_Delete_Cache_Redis_With_Key } from '@src/cache/cache_postgresql';
import { DeviceType, DeviceEnum } from '@src/device/type';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const isProduct = process.env.NODE_ENV === 'production';

let secure_cookie = false;
if (process.env.NODE_ENV !== 'development') {
    secure_cookie = true;
}

const same_site = process.env.NODE_ENV === 'development' ? 'lax' : 'none';
// const sameSite = 'none';
const cookie_domain = isProduct ? '.taokosao.com' : 'localhost';

class Handle_Signout {
    constructor() {}

    async main(req: Request, res: Response) {
        const device = req.headers['x-device-type'] as DeviceType;

        const my_response: My_Response_Field<unknown> = {
            is_success: false,
            message: 'Bắt đầu đăng xuất !',
        };

        try {
            switch (device) {
                case DeviceEnum.WEB: {
                    const id = req.cookies?.id;
                    if (id) {
                        // Xóa dữ liệu token trong Redis
                        const key_service_redis_web = `web-token-store_auth_token-${id}_${dev_prefix}`;
                        await serviceRedis.deleteData(key_service_redis_web);

                        await postgresql_Delete_Cache_Redis_With_Key(key_service_redis_web);
                    }

                    const cookie_options = {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: same_site as 'lax' | 'none' | 'strict',
                        domain: cookie_domain,
                    };

                    // Xóa cookie
                    res.clearCookie('id', cookie_options);
                    res.clearCookie('accessToken', cookie_options);
                    res.clearCookie('refreshToken', cookie_options);
                    res.clearCookie('socketToken', cookie_options);

                    break;
                }
                case DeviceEnum.MOBILE: {
                    const id = req.headers['x-account-id'] as string;
                    if (id) {
                        // Xóa dữ liệu token trong Redis
                        const key_service_redis_mobile = `mobile-token-store_auth_token-${id}_${dev_prefix}`;
                        await serviceRedis.deleteData(key_service_redis_mobile);

                        await postgresql_Delete_Cache_Redis_With_Key(key_service_redis_mobile);
                    }

                    res.setHeader('x-account-id', '');
                    res.setHeader('x-access-token', '');
                    res.setHeader('x-refresh-token', '');
                    res.setHeader('x-socket-token', '');

                    break;
                }
                default: {
                    console.log('Chưa xác định thiết bị !');
                    my_response.message = 'Chưa xác định thiết bị !';
                    res.status(500).json(my_response);
                    return;
                }
            }

            my_response.message = 'Đăng xuất thành công và cookie đã được xóa.';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        } catch (error) {
            my_response.message = 'Đăng xuất thất bại !';
            my_response.err = error;
            res.status(500).json(my_response);
        }
    }
}

export default Handle_Signout;
