import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Check_Consent_Field } from '@src/data_struct/call';
import { Check_Consent_Body_Field } from '@src/data_struct/call/body';
import { verify_Refresh_Token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import axios from 'axios';
import { get_Access_Token, refresh_Access_Token } from '@src/zaloToken';
// import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const API_CHECK_CONSENT = 'https://openapi.zalo.me/v2.0/oa/call/checkconsent';

class Handle_Check_Consent {
    setup = async (req: Request<any, any, Check_Consent_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<any> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Check_Consent-setup)',
        };

        const check_consent_body = req.body;
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
            check_consent_body.account_id = id;
            res.locals.check_consent_body = check_consent_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const check_consent_body = res.locals.check_consent_body as Check_Consent_Body_Field;
        const zalo_app = check_consent_body.zalo_app;
        const zalo_oa = check_consent_body.zalo_oa;

        const my_response: My_Response_Field<Check_Consent_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Check_Consent-main)',
        };

        let token: string | undefined = undefined;

        token = await get_Access_Token(zalo_oa);

        if (!token) {
            token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
        }

        // const body = {
        //     phone: requestConsentBody.phone,
        //     call_type: requestConsentBody.call_type,
        //     reason_code: requestConsentBody.reason_code,
        // };

        const response = await axios.get<Check_Consent_Field>(
            `${API_CHECK_CONSENT}?data=${JSON.stringify({ phone: check_consent_body.phone })}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    access_token: token,
                },
            }
        );

        my_response.data = response.data;
        my_response.message = response.data.message;
        my_response.is_success = true;
        res.status(200).json(my_response);
        return;
    };
}

export default Handle_Check_Consent;
