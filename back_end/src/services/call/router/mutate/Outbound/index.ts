import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Outbound_Body_Field } from '@src/data_struct/call/body';
import { verify_Refresh_Token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import axios from 'axios';
import { get_Access_Token, refresh_Access_Token } from '@src/zaloToken';
// import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const API_OUTBOUND = 'https://openapi.zalo.me/v3.0/oa/call/outbound';

class Handle_Outbound {
    setup = async (req: Request<any, any, Outbound_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Outbound-setup)',
        };

        const outbound_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

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
            outbound_body.account_id = id;
            res.locals.outbound_body = outbound_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const outbound_body = res.locals.outbound_body as Outbound_Body_Field;
        const zalo_app = outbound_body.zalo_app;
        const zalo_oa = outbound_body.zalo_oa;

        const my_response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Outbound-main)',
        };

        let token: string | undefined = undefined;

        token = await get_Access_Token(zalo_oa);

        if (!token) {
            token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
        }

        const body = {
            user_id: outbound_body.user_id,
            agent_id: outbound_body.agent_id,
            call_type: outbound_body.call_type,
        };

        const response = await axios.post(API_OUTBOUND, body, {
            headers: {
                'Content-Type': 'application/json',
                access_token: token,
            },
        });
    };
}

export default Handle_Outbound;
