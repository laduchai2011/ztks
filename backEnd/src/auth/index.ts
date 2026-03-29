import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@src/token';
import { serviceRedlock } from '@src/connect';
import { SignOptions } from 'jsonwebtoken';
import ServiceRedis from '@src/cache/cacheRedis';
import LockError from 'redlock';
import { MyResponse } from '@src/dataStruct/response';
import { StoreAuthToken } from './type';
import { dev_prefix } from '@src/mode';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

let secure_cookie = false;
if (process.env.NODE_ENV !== 'development') {
    secure_cookie = true;
}

const sameSite = process.env.NODE_ENV === 'development' ? 'lax' : 'none';
// const sameSite = 'none';
const isProduct = process.env.NODE_ENV === 'production';
const cookieDomain = isProduct ? '.5kaquarium.com' : 'zalo5k.local.com';

const timeExpireat = 60 * 60 * 24 * 30 * 12; // 1 year

async function authentication(req: Request, res: Response, next: NextFunction) {
    const { refreshToken, accessToken, id } = req.cookies;
    const keyServiceRedis = `token-storeAuthToken-${id}_${dev_prefix}`;
    const lockKey = `redlock-for-refresh-accessToken-${id}_${dev_prefix}`;
    // console.log(111111111, refreshToken, accessToken, id);

    const myResponse: MyResponse<unknown> = {
        isSuccess: false,
        isAuth: false,
        message: 'Bắt đầu xác thực !',
    };

    if (!refreshToken || !accessToken || !id) {
        myResponse.message = 'Đầu vào không hợp lệ !';
        res.json(myResponse);
        return;
    }

    try {
        // await serviceRedis.init();

        // console.log("1. Bắt đầu middleware");
        const verify_accessToken = verifyAccessToken(accessToken);

        const verify_refreshToken = verifyRefreshToken(refreshToken);
        // console.log("3. Đã verify refreshToken:", verify_refreshToken);

        if (!verify_accessToken || !verify_refreshToken) {
            myResponse.message = 'Xác thực token không thành công !';
            res.json(myResponse);
            return;
        }

        if (verify_accessToken === 'invalid') {
            myResponse.message = 'Access-Token không hợp lệ, hãy đăng nhập lại !';
            res.json(myResponse);
            return;
        }

        if (verify_refreshToken === 'invalid') {
            myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
            res.json(myResponse);
            return;
        }

        if (verify_refreshToken === 'expired') {
            myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
            res.json(myResponse);
            return;
        }

        if (verify_accessToken !== 'expired') {
            myResponse.isAuth = true;
            myResponse.message = 'Xác thực thành công, access-token còn hạn !';
            next();
            return;
        } else {
            const storeAuthToken = await serviceRedis.getData<StoreAuthToken>(keyServiceRedis);
            // console.log('4. Lấy storeAuthToken từ Redis:', storeAuthToken);
            if (!storeAuthToken) {
                myResponse.isSignin = false;
                myResponse.message = 'Không tìm thấy thông tin phiên đăng nhập, hãy đăng nhập lại !';
                res.json(myResponse);
                return;
            }
            if (storeAuthToken.refreshToken === refreshToken) {
                let lock;
                try {
                    //---------------------xử lý token hết han--------------------/
                    lock = await serviceRedlock.acquire([lockKey], 3000);

                    let blackList = storeAuthToken.blackList;
                    if (blackList.length < 50) {
                        blackList.push(accessToken);
                    } else {
                        blackList = [accessToken];
                    }
                    storeAuthToken.blackList = blackList;
                    storeAuthToken.grayAccessToken = accessToken;

                    const myJwtPayload = verify_refreshToken;
                    const signOptions: SignOptions = {
                        expiresIn: '5m',
                    };
                    const new_accessToken = generateAccessToken(myJwtPayload, signOptions);
                    storeAuthToken.accessToken = new_accessToken;

                    res.cookie('id', id, {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: sameSite,
                        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        // signed: true
                        domain: cookieDomain,
                    }).cookie('accessToken', new_accessToken, {
                        httpOnly: true,
                        secure: secure_cookie,
                        sameSite: sameSite,
                        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        domain: cookieDomain,
                    });

                    const isSet = await serviceRedis.setData<StoreAuthToken>(
                        keyServiceRedis,
                        storeAuthToken,
                        timeExpireat
                    );
                    if (!isSet) {
                        console.error('Failed to set new token in cookie in Redis');
                        return;
                    }

                    myResponse.isAuth = true;
                    myResponse.message = 'Xác thực thành công, access-token được cấp mới !';
                    next();
                    return;
                    //----------------------------------------------------------/
                } catch (err) {
                    if (err instanceof LockError) {
                        //--------------------Tiếp tục thực hiện những request cùng thời điểm------------------------//
                        if (storeAuthToken.grayAccessToken === accessToken) {
                            myResponse.isAuth = true;
                            myResponse.message = 'Xác thực thành công, truy cập tạm access-token cũ !';
                            next();
                            return;
                        } else {
                            myResponse.isSignin = false;
                            myResponse.message = 'Tài khoản của bạn bị tấn công, hãy đăng nhập lại !';
                            res.json(myResponse);
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
                            await lock.release();
                        } catch (e) {
                            console.error('Không thể release lock:', e);
                        }
                    }
                }
            } else {
                myResponse.isSignin = false;
                myResponse.message = 'Tài khoản của bạn bị tấn công, hãy đăng nhập lại !';
                res.json(myResponse);
                return;
            }
        }
    } catch (error) {
        myResponse.err = error;
        res.json(myResponse);
        return;
    }
}

export default authentication;
