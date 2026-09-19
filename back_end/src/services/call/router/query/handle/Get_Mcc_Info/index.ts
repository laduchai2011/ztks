import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Get_Mcc_Info_Body_Field } from '@src/data_struct/call/body';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import axios from 'axios';
import { get_Access_Token, refresh_Access_Token } from '@src/zaloToken';

const API_GET_MCC_INFOR = 'https://openapi.zalo.me/v3.0/oa/call/getmccinfo';

class Handle_Get_Mcc_Info {
    setup = async (req: Request<any, any, Get_Mcc_Info_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Mcc_Info-setup)',
        };

        const get_mcc_info_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            const { id } = verify_refreshToken;
            get_mcc_info_body.account_id = id;
            res.locals.get_mcc_info_body = get_mcc_info_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_mcc_info_body = res.locals.get_mcc_info_body as Get_Mcc_Info_Body_Field;
        const zalo_app = get_mcc_info_body.zalo_app;
        const zalo_oa = get_mcc_info_body.zalo_oa;

        const my_response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Mcc_Info-main)',
        };

        let token: string | undefined = undefined;

        token = await get_Access_Token(zalo_oa);

        if (!token) {
            token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
        }

        const response = await axios.get(API_GET_MCC_INFOR, {
            headers: {
                'Content-Type': 'application/json',
                access_token: token,
            },
        });

        console.log(2222222222222, response);
    };
}

export default Handle_Get_Mcc_Info;
