import { Request, Response, NextFunction } from 'express';
import { verify_Access_Token, verify_Refresh_Token, generate_Access_Token } from '@src/token';
import { serviceRedlock } from '@src/connect';
import { SignOptions } from 'jsonwebtoken';
import ServiceRedis from '@src/cache/cacheRedis';
import LockError from 'redlock';
import { My_Response_Field } from '@src/data_struct/response';
import { Store_Auth_Token_Field } from './type';
import { dev_prefix } from '@src/mode';
import { postgresql_Get_Value, postgresql_Update_Value } from '@src/cache/cache_postgresql';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

let secure_cookie = false;
if (process.env.NODE_ENV !== 'development') {
    secure_cookie = true;
}

const sameSite = process.env.NODE_ENV === 'development' ? 'lax' : 'none';
// const sameSite = 'none';
const isProduct = process.env.NODE_ENV === 'production';
const cookieDomain = isProduct ? '.taokosao.com' : 'localhost';

const time_expireat = 60 * 60 * 24 * 30 * 12; // 1 year

async function authentication_customer(req: Request, res: Response, next: NextFunction) {
    const { refreshToken, accessToken, id } = req.cookies;
    const key_service_redis = `token-storeAuthToken-${id}_${dev_prefix}-customer`;
    const lock_key = `redlock-for-refresh-accessToken-${id}_${dev_prefix}-customer`;

    const my_response: My_Response_Field<unknown> = {
        is_success: false,
        is_auth: false,
        message: 'Bắt đầu xác thực !',
    };

    if (!refreshToken || !accessToken || !id) {
        my_response.message = 'Đầu vào không hợp lệ !';
        res.json(my_response);
        return;
    }

    try {
        // await serviceRedis.init();

        // console.log("1. Bắt đầu middleware");
        const verify_access_token = verify_Access_Token(accessToken);

        const verify_refresh_token = verify_Refresh_Token(refreshToken);
        // console.log("3. Đã verify refreshToken:", verify_refreshToken);

        if (!verify_access_token || !verify_refresh_token) {
            my_response.message = 'Xác thực token không thành công !';
            res.json(my_response);
            return;
        }

        if (verify_access_token === 'invalid') {
            my_response.message = 'Access-Token không hợp lệ, hãy đăng nhập lại !';
            res.json(my_response);
            return;
        }

        if (verify_refresh_token === 'invalid') {
            my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
            res.json(my_response);
            return;
        }

        if (verify_refresh_token === 'expired') {
            my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
            res.json(my_response);
            return;
        }

        if (verify_access_token !== 'expired') {
            my_response.is_auth = true;
            my_response.message = 'Xác thực thành công, access-token còn hạn !';
            next();
            return;
        } else {
            let store_auth_token: Store_Auth_Token_Field | null = null;
            store_auth_token = await serviceRedis.getData<Store_Auth_Token_Field>(key_service_redis);
            // console.log('4. Lấy storeAuthToken từ Redis:', storeAuthToken);
            if (!store_auth_token) {
                const result_get = await postgresql_Get_Value(key_service_redis);

                if (result_get?.is_success && result_get.data) {
                    store_auth_token = JSON.parse(result_get.data.value) as Store_Auth_Token_Field;
                } else {
                    my_response.is_signin = false;
                    my_response.message = 'Không tìm thấy thông tin phiên đăng nhập, hãy đăng nhập lại !';
                    res.json(my_response);
                    return;
                }
            }
            if (store_auth_token.refresh_token === refreshToken) {
                let lock;
                try {
                    //---------------------xử lý token hết han--------------------/
                    lock = await serviceRedlock.acquire([lock_key], 3000);

                    let black_list = store_auth_token.black_list;
                    if (black_list.length < 50) {
                        black_list.push(accessToken);
                    } else {
                        black_list = [accessToken];
                    }
                    store_auth_token.black_list = black_list;
                    store_auth_token.gray_access_token = accessToken;

                    const my_jwt_payload = verify_refresh_token;
                    const sign_options: SignOptions = {
                        expiresIn: '5m',
                    };
                    const new_access_token = generate_Access_Token(my_jwt_payload, sign_options);
                    store_auth_token.access_token = new_access_token;

                    res.cookie('c_id', id, {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: sameSite,
                        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        // signed: true
                        domain: cookieDomain,
                    }).cookie('c_accessToken', new_access_token, {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: sameSite,
                        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        domain: cookieDomain,
                    });

                    const is_set = await serviceRedis.setData<Store_Auth_Token_Field>(
                        key_service_redis,
                        store_auth_token,
                        time_expireat
                    );
                    if (!is_set) {
                        console.error('Failed to set new token in cookie in Redis');
                        return;
                    }
                    const result_update = await postgresql_Update_Value(
                        key_service_redis,
                        JSON.stringify(store_auth_token)
                    );
                    if (!result_update?.is_success) {
                        my_response.message = 'Update store_auth_token in auth successly !';
                    } else {
                        my_response.message = 'Update store_auth_token in auth failure !';
                    }

                    my_response.is_auth = true;
                    my_response.message = 'Xác thực thành công, access-token được cấp mới !';
                    next();
                    return;
                    //----------------------------------------------------------/
                } catch (err) {
                    if (err instanceof LockError) {
                        //--------------------Tiếp tục thực hiện những request cùng thời điểm------------------------//
                        if (store_auth_token.gray_access_token === accessToken) {
                            my_response.is_auth = true;
                            my_response.message = 'Xác thực thành công, truy cập tạm access-token cũ !';
                            next();
                            return;
                        } else {
                            my_response.is_signin = false;
                            my_response.message = 'Tài khoản của bạn bị tấn công, hãy đăng nhập lại !';
                            res.json(my_response);
                            return;
                        }
                        //----------------------------------------------------------------------------------------//
                    } else {
                        console.error(err);
                        // throw err;
                    }
                } finally {
                    if (lock) {
                        try {
                            await (lock as any).release();
                        } catch (e) {
                            console.error('Không thể release lock:', e);
                        }
                    }
                }
            } else {
                my_response.is_signin = false;
                my_response.message = 'Tài khoản của bạn bị tấn công, hãy đăng nhập lại !';
                res.json(my_response);
                return;
            }
        }
    } catch (error) {
        my_response.err = error;
        res.json(my_response);
        return;
    }
}

export default authentication_customer;
