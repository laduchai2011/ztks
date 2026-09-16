import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import MutateDB_Signin from '../../mutateDB/Signin';
import ServiceRedis from '@src/cache/cacheRedis';
import { My_Response_Field } from '@src/dataStruct/response';
import { generate_access_token, generate_refresh_token, generate_socket_token, My_Jwt_Payload_Field } from '@src/token';
import { SignOptions } from 'jsonwebtoken';
import { Store_Auth_Token_Field } from '@src/auth/type';
import { signin_infor_type } from './type';
import { Account_Field } from '@src/dataStruct/account';
import { postgresql_Get_Value, postgresql_Update_Value, postgresql_Set_Value } from '@src/cache/cacheMssql';
import { dev_prefix } from '@src/mode';
import { DeviceType, DeviceEnum } from '@src/device/type';

let secure_cookie = false;
if (process.env.NODE_ENV !== 'development') {
    secure_cookie = true;
}

const sameSite = process.env.NODE_ENV === 'development' ? 'lax' : 'none';
// const sameSite = 'none';
const isProduct = process.env.NODE_ENV === 'production';
const cookieDomain = isProduct ? '.taokosao.com' : 'localhost';

const timeExpireat = 60 * 60 * 24 * 30 * 12; // 1 year

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

class Handle_Signin {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<any, any, signin_infor_type>, res: Response) => {
        const signinInfor = req.body;
        const user_name = signinInfor.user_name;
        const password = signinInfor.password;
        const device = req.headers['x-device-type'] as DeviceType;

        await this._mssql_server.init();

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
        };

        // let connection_pool_isExist: boolean = false;

        const mutateDB = new MutateDB_Signin();

        mutateDB.set_infor_input({ user_name: user_name, password: password });

        try {
            const result = await mutateDB.run();

            if (result) {
                const id = result.id;

                if (id === null) {
                    my_response.message = 'Đăng nhập thất bại !';
                    res.status(500).json(my_response);
                    return;
                }

                switch (device) {
                    case DeviceEnum.WEB: {
                        console.log('login with: ', DeviceEnum.WEB);

                        const key_service_redis_web = `web-token-storeAuthToken-${id}_${dev_prefix}`;

                        const my_jwt_payload: My_Jwt_Payload_Field = {
                            id: id,
                        };

                        const signOptions_accessToken: SignOptions = {
                            expiresIn: '5m',
                        };
                        const signOptions_refreshToken: SignOptions = {
                            expiresIn: '1y',
                        };
                        const signOptions_socketToken: SignOptions = {
                            expiresIn: '1y',
                        };

                        const access_token = generate_access_token(my_jwt_payload, signOptions_accessToken);
                        const refresh_token = generate_refresh_token(my_jwt_payload, signOptions_refreshToken);
                        const socket_token = generate_socket_token(my_jwt_payload, signOptions_socketToken);

                        const store_auth_token: Store_Auth_Token_Field = {
                            access_token: access_token,
                            refresh_token: refresh_token,
                            gray_access_token: access_token,
                            black_list: [],
                        };

                        const result_get = await postgresql_Get_Value(key_service_redis_web);

                        if (result_get?.is_success) {
                            const result_update = await postgresql_Update_Value(
                                key_service_redis_web,
                                JSON.stringify(store_auth_token)
                            );
                            if (!result_update?.is_success) {
                                my_response.message = 'Login NOT successly, account or password is incorrect !';
                                res.status(200).json(my_response);
                                return;
                            }
                        } else {
                            const result_set = await postgresql_Set_Value(
                                key_service_redis_web,
                                JSON.stringify(store_auth_token)
                            );
                            if (!result_set?.is_success) {
                                my_response.message = 'Login NOT successly, account or password is incorrect !';
                                res.status(200).json(my_response);
                                return;
                            }
                        }

                        await serviceRedis.setData<Store_Auth_Token_Field>(
                            key_service_redis_web,
                            store_auth_token,
                            timeExpireat
                        );

                        res.cookie('id', id, {
                            httpOnly: true,
                            secure: secure_cookie,
                            sameSite: sameSite,
                            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                            // signed: true
                            domain: cookieDomain,
                        })
                            .cookie('accessToken', access_token, {
                                httpOnly: true,
                                secure: secure_cookie,
                                sameSite: sameSite,
                                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                                domain: cookieDomain,
                            })
                            .cookie('refreshToken', refresh_token, {
                                httpOnly: true,
                                secure: secure_cookie,
                                sameSite: sameSite,
                                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                                domain: cookieDomain,
                            })
                            .cookie('socketToken', socket_token, {
                                secure: secure_cookie,
                                sameSite: sameSite,
                                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                                domain: cookieDomain,
                            });

                        my_response.message = 'Login successly !';
                        my_response.is_success = true;
                        my_response.data = result;
                        res.json(my_response);
                        return;
                    }
                    case DeviceEnum.MOBILE: {
                        console.log('login with: ', DeviceEnum.MOBILE);

                        const key_service_redis_mobile = `mobile-token-storeAuthToken-${id}_${dev_prefix}`;

                        const my_jwt_payload: My_Jwt_Payload_Field = {
                            id: id,
                        };

                        const signOptions_access_token: SignOptions = {
                            expiresIn: '5m',
                        };
                        const signOptions_refresh_token: SignOptions = {
                            expiresIn: '1y',
                        };
                        const signOptions_socket_Token: SignOptions = {
                            expiresIn: '1y',
                        };

                        const access_token = generate_access_token(my_jwt_payload, signOptions_access_token);
                        const refresh_token = generate_refresh_token(my_jwt_payload, signOptions_refresh_token);
                        const socket_token = generate_socket_token(my_jwt_payload, signOptions_socket_Token);

                        const store_auth_token: Store_Auth_Token_Field = {
                            access_token: access_token,
                            refresh_token: refresh_token,
                            gray_access_token: access_token,
                            black_list: [],
                        };

                        const result_get = await postgresql_Get_Value(key_service_redis_mobile);

                        if (result_get?.is_success) {
                            const result_update = await postgresql_Update_Value(
                                key_service_redis_mobile,
                                JSON.stringify(store_auth_token)
                            );
                            if (!result_update?.is_success) {
                                my_response.message = 'Login NOT successly, account or password is incorrect !';
                                res.status(200).json(my_response);
                                return;
                            }
                        } else {
                            const result_set = await postgresql_Set_Value(
                                key_service_redis_mobile,
                                JSON.stringify(store_auth_token)
                            );
                            if (!result_set?.is_success) {
                                my_response.message = 'Login NOT successly, account or password is incorrect !';
                                res.status(200).json(my_response);
                                return;
                            }
                        }

                        await serviceRedis.setData<Store_Auth_Token_Field>(
                            key_service_redis_mobile,
                            store_auth_token,
                            timeExpireat
                        );

                        res.setHeader(
                            'Access-Control-Expose-Headers',
                            'x-account-id,x-access-token,x-refresh-token,x-socket-token'
                        );

                        res.setHeader('x-account-id', id.toString());
                        res.setHeader('x-access-token', access_token);
                        res.setHeader('x-refresh-token', refresh_token);
                        res.setHeader('x-socket-token', socket_token);

                        my_response.message = 'Login successly !';
                        my_response.is_success = true;
                        my_response.data = result;
                        res.json(my_response);
                        return;
                    }
                    default: {
                        console.log('Chưa xác định thiết bị !');
                        my_response.message = 'Chưa xác định thiết bị !';
                        res.status(500).json(my_response);
                        return;
                    }
                }
            } else {
                my_response.message = 'Login NOT successly, account or password is incorrect !';
                res.status(500).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Login NOT successly 6 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Signin;
