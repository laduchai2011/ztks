import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CheckConsentBodyField } from '@src/dataStruct/call/body';
import { verifyRefreshToken } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import axios from 'axios';
import { getAccessToken, refreshAccessToken } from '@src/zaloToken';
// import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const API_CHECK_CONSENT = 'https://openapi.zalo.me/v2.0/oa/call/checkconsent';

class Handle_CheckConsent {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, CheckConsentBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<any> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CheckConsent-setup)',
        };

        const checkConsentBody = req.body;
        // const { refreshToken } = req.cookies;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verifyRefreshToken(refreshToken);

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
            checkConsentBody.accountId = id;
            res.locals.checkConsentBody = checkConsentBody;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const checkConsentBody = res.locals.checkConsentBody as CheckConsentBodyField;
        const zaloApp = checkConsentBody.zaloApp;
        const zaloOa = checkConsentBody.zaloOa;

        const myResponse: MyResponse<any> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CheckConsent-main)',
        };

        let token: string | undefined = undefined;

        token = await getAccessToken(zaloOa);

        if (!token) {
            token = await refreshAccessToken(zaloApp, zaloOa, 10);
        }

        // const body = {
        //     phone: requestConsentBody.phone,
        //     call_type: requestConsentBody.call_type,
        //     reason_code: requestConsentBody.reason_code,
        // };

        const response = await axios.get(`${API_CHECK_CONSENT}?data=${checkConsentBody.phone}`, {
            headers: {
                'Content-Type': 'application/json',
                access_token: token,
            },
        });

        console.log(3333333333, response);
    };
}

export default Handle_CheckConsent;
