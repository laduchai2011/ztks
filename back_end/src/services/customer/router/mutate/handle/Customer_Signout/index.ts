import { Request, Response } from 'express';
import ServiceRedis from '@src/cache/cacheRedis';
import { My_Response_Field } from '@src/data_struct/response';
import { dev_prefix } from '@src/mode';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const isProduct = process.env.NODE_ENV === 'production';

let secure_cookie = false;
if (process.env.NODE_ENV !== 'development') {
    secure_cookie = true;
}

const sameSite = process.env.NODE_ENV === 'development' ? 'lax' : 'none';
// const sameSite = 'none';
const cookieDomain = isProduct ? '.taokosao.com' : 'localhost';

class Handle_Customer_Signout {
    async main(req: Request, res: Response) {
        const my_response: My_Response_Field<unknown> = {
            is_success: false,
            message: 'Bắt đầu đăng xuất !',
        };

        try {
            const id = req.cookies?.id;
            if (id) {
                // Xóa dữ liệu token trong Redis
                const keyServiceRedis = `token-storeAuthToken-${id}_${dev_prefix}-customer`;
                await serviceRedis.deleteData(keyServiceRedis);
            }

            const cookieOptions = {
                httpOnly: true,
                secure: secure_cookie,
                sameSite: sameSite as 'lax' | 'none' | 'strict',
                domain: cookieDomain,
            };

            // Xóa cookie
            res.clearCookie('c_id', cookieOptions);
            res.clearCookie('c_accessToken', cookieOptions);
            res.clearCookie('c_refreshToken', cookieOptions);

            my_response.message = 'Đăng xuất thành công và cookie đã được xóa.';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        } catch (error) {
            my_response.message = 'Đăng xuất thất bại !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    }
}

export default Handle_Customer_Signout;
