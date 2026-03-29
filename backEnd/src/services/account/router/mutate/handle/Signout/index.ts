import { Request, Response } from 'express';
import ServiceRedis from '@src/cache/cacheRedis';
import { MyResponse } from '@src/dataStruct/response';

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
    async main(req: Request, res: Response) {
        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
            message: 'Bắt đầu đăng xuất !',
        };

        try {
            const id = req.cookies?.id;
            if (id) {
                // Xóa dữ liệu token trong Redis
                const keyServiceRedis = `token-storeAuthToken-${id}`;
                await serviceRedis.deleteData(keyServiceRedis);
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

            myResponse.message = 'Đăng xuất thành công và cookie đã được xóa.';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
        } catch (error) {
            myResponse.message = 'Đăng xuất thất bại !';
            myResponse.err = error;
            res.status(500).json(myResponse);
        }
    }
}

export default Handle_Signout;
