import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Request_Consent_Field } from '@src/data_struct/call';
import { Request_Consent_Body_Field } from '@src/data_struct/call/body';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import axios from 'axios';
import { get_Access_Token, refresh_Access_Token } from '@src/zaloToken';

const API_REQUEST_CONSENT = 'https://openapi.zalo.me/v2.0/oa/call/requestconsent';

class Handle_Request_Consent {
    setup = async (req: Request<any, any, Request_Consent_Body_Field>, res: Response, next: NextFunction) => {
        const myResponse: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Request_Consent-setup)',
        };

        const request_consent_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            if (verify_refreshToken === 'expired') {
                myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            const { id } = verify_refreshToken;
            request_consent_body.account_id = id;
            res.locals.request_consent_body = request_consent_body;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const request_consent_body = res.locals.request_consent_body as Request_Consent_Body_Field;
        const zalo_app = request_consent_body.zalo_app;
        const zalo_oa = request_consent_body.zalo_oa;

        const my_response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Request_Consent-main)',
        };

        let token: string | undefined = undefined;

        token = await get_Access_Token(zalo_oa);

        if (!token) {
            token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
        }

        const body = {
            phone: request_consent_body.phone,
            call_type: request_consent_body.call_type,
            reason_code: request_consent_body.reason_code,
        };

        const response = await axios.post<Request_Consent_Field>(API_REQUEST_CONSENT, body, {
            headers: {
                'Content-Type': 'application/json',
                access_token: token,
            },
        });

        my_response.data = response.data;
        my_response.message = response.data.message;
        my_response.is_success = true;
        res.status(200).json(my_response);
        return;
    };
}

export default Handle_Request_Consent;
