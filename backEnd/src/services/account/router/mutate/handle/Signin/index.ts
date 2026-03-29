import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import MutateDB_Signin from '../../mutateDB/Signin';
import ServiceRedis from '@src/cache/cacheRedis';
import { MyResponse } from '@src/dataStruct/response';
import { generateAccessToken, generateRefreshToken } from '@src/token';
import { SignOptions } from 'jsonwebtoken';
import { MyJwtPayload } from '@src/token';
import { StoreAuthToken } from '@src/auth/type';
import { signin_infor_type } from './type';
import { AccountField } from '@src/dataStruct/account';
import { mssqlGetValue, mssqlUpdateValue, mssqlSetValue } from '@src/cache/cacheMssql';
import { dev_prefix } from '@src/mode';

let secure_cookie = false;
if (process.env.NODE_ENV !== 'development') {
    secure_cookie = true;
}

const sameSite = process.env.NODE_ENV === 'development' ? 'lax' : 'none';
// const sameSite = 'none';
const isProduct = process.env.NODE_ENV === 'production';
const cookieDomain = isProduct ? '.5kaquarium.com' : 'zalo5k.local.com';

const timeExpireat = 60 * 60 * 24 * 30 * 12; // 1 year

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

class Handle_Signin {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, signin_infor_type>, res: Response) => {
        const signinInfor = req.body;
        const userName = signinInfor.userName;
        const password = signinInfor.password;

        await this._mssql_server.init();

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        let connection_pool_isExist: boolean = false;

        const mutateDB_signin = new MutateDB_Signin();

        mutateDB_signin.set_infor_input({ userName: userName, password: password });

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            connection_pool_isExist = true;
            mutateDB_signin.set_connection_pool(connection_pool);
            myResponse.message = 'Connect BD(mssql) successly, but NOT yet login !';
        } else {
            myResponse.message = 'Connect BD(mssql) NOT successly !';
            res.status(500).json(myResponse);
            return;
        }

        if (connection_pool_isExist) {
            try {
                const result = await mutateDB_signin.run();

                if (result?.recordset.length && result?.recordset.length > 0) {
                    const id = result.recordset[0].id;

                    if (id === null) {
                        myResponse.message = 'Đăng nhập thất bại !';
                        res.status(500).json(myResponse);
                        return;
                    }

                    const keyServiceRedis = `token-storeAuthToken-${id}_${dev_prefix}`;

                    const myJwtPayload: MyJwtPayload = {
                        id: id,
                    };

                    const signOptions_accessToken: SignOptions = {
                        expiresIn: '5m',
                    };
                    const signOptions_refreshToken: SignOptions = {
                        expiresIn: '1y',
                    };

                    const accessToken = generateAccessToken(myJwtPayload, signOptions_accessToken);
                    const refreshToken = generateRefreshToken(myJwtPayload, signOptions_refreshToken);

                    const resultget = await mssqlGetValue(keyServiceRedis);

                    if (resultget?.isSuccess) {
                        const resultupdate = await mssqlUpdateValue(keyServiceRedis, refreshToken);
                        if (!resultupdate?.isSuccess) {
                            myResponse.message = 'Login NOT successly, account or password is incorrect !';
                            res.status(200).json(myResponse);
                            return;
                        }
                    } else {
                        const resultset = await mssqlSetValue(keyServiceRedis, refreshToken);
                        if (!resultset?.isSuccess) {
                            myResponse.message = 'Login NOT successly, account or password is incorrect !';
                            res.status(200).json(myResponse);
                            return;
                        }
                    }

                    const storeAuthToken: StoreAuthToken = {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        grayAccessToken: accessToken,
                        blackList: [],
                    };

                    await serviceRedis.setData<StoreAuthToken>(keyServiceRedis, storeAuthToken, timeExpireat);

                    res.cookie('id', id, {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: sameSite,
                        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        // signed: true
                        domain: cookieDomain,
                    })
                        .cookie('accessToken', accessToken, {
                            httpOnly: true,
                            secure: secure_cookie,
                            sameSite: sameSite,
                            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                            domain: cookieDomain,
                        })
                        .cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: secure_cookie,
                            sameSite: sameSite,
                            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                            domain: cookieDomain,
                        });

                    myResponse.message = 'Login successly !';
                    myResponse.isSuccess = true;
                    myResponse.data = result.recordset[0];
                    res.json(myResponse);
                    return;
                } else {
                    myResponse.message = 'Login NOT successly, account or password is incorrect !';
                    res.status(500).json(myResponse);
                    return;
                }
            } catch (error) {
                myResponse.message = 'Login NOT successly 6 !';
                myResponse.err = error;
                res.status(500).json(myResponse);
                return;
            }
        }
    };
}

export default Handle_Signin;
