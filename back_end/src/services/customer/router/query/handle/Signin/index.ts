import { Request, Response } from 'express';
import QueryDB_Signin from '../../queryDB/Signin';
import ServiceRedis from '@src/cache/cacheRedis';
import { My_Response_Field } from '@src/data_struct/response';
import { generate_access_token, generate_refresh_token } from '@src/token';
import { SignOptions } from 'jsonwebtoken';
import { My_Jwt_Payload_Field } from '@src/token';
import { Store_Auth_Token_Field } from '@src/auth/type';
import { Customer_Field } from '@src/data_struct/customer';
import { Signin_Customer_Body_Field } from '@src/data_struct/customer/body';
import { postgresql_Get_Value, postgresql_Update_Value, postgresql_Set_Value } from '@src/cache/cacheMssql';
import { dev_prefix } from '@src/mode';

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
    main = async (req: Request<any, any, Signin_Customer_Body_Field>, res: Response) => {
        const signin_customer_body = req.body;

        const my_response: My_Response_Field<Customer_Field> = {
            is_success: false,
        };

        const queryDB = new QueryDB_Signin();

        queryDB.set_Signin_Customer_Body(signin_customer_body);

        try {
            const result = await queryDB.run();
            if (result) {
                const id = result.id;

                if (id === null) {
                    my_response.message = 'Đăng nhập thất bại !';
                    res.status(500).json(my_response);
                    return;
                }

                const key_service_redis = `token-storeAuthToken-${id}_${dev_prefix}-customer`;

                const my_jwt_payload: My_Jwt_Payload_Field = {
                    id: id,
                };

                const signOptions_access_token: SignOptions = {
                    expiresIn: '5m',
                };
                const signOptions_refresh_token: SignOptions = {
                    expiresIn: '1y',
                };

                const access_token = generate_access_token(my_jwt_payload, signOptions_access_token);
                const refresh_token = generate_refresh_token(my_jwt_payload, signOptions_refresh_token);

                const result_get = await postgresql_Get_Value(key_service_redis);

                if (result_get?.is_success) {
                    const result_update = await postgresql_Update_Value(key_service_redis, refresh_token);
                    if (!result_update?.is_success) {
                        my_response.message = 'Login NOT successly, account or password is incorrect !';
                        res.status(200).json(my_response);
                        return;
                    }
                } else {
                    const result_set = await postgresql_Set_Value(key_service_redis, refresh_token);
                    if (!result_set?.is_success) {
                        my_response.message = 'Login NOT successly, account or password is incorrect !';
                        res.status(200).json(my_response);
                        return;
                    }
                }

                const store_auth_token: Store_Auth_Token_Field = {
                    access_token: access_token,
                    refresh_token: refresh_token,
                    gray_access_token: access_token,
                    black_list: [],
                };

                await serviceRedis.setData<Store_Auth_Token_Field>(key_service_redis, store_auth_token, timeExpireat);

                res.cookie('c_id', id, {
                    httpOnly: true,
                    secure: secure_cookie,
                    sameSite: sameSite,
                    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    // signed: true
                    domain: cookieDomain,
                })
                    .cookie('c_accessToken', access_token, {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: sameSite,
                        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        domain: cookieDomain,
                    })
                    .cookie('c_refreshToken', refresh_token, {
                        httpOnly: true,
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
