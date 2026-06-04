import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { OutboundBodyField } from '@src/dataStruct/call/body';
import { verifyRefreshToken } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import axios from 'axios';
import { getAccessToken, refreshAccessToken } from '@src/zaloToken';
// import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const API_OUTBOUND = 'https://openapi.zalo.me/v3.0/oa/call/outbound';

class Handle_Outbound {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, OutboundBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<any> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_Outbound-setup)',
        };

        const outboundBody = req.body;
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
            outboundBody.accountId = id;
            res.locals.outboundBody = outboundBody;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const outboundBody = res.locals.outboundBody as OutboundBodyField;
        const zaloApp = outboundBody.zaloApp;
        const zaloOa = outboundBody.zaloOa;

        const myResponse: MyResponse<any> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_Outbound-main)',
        };

        let token: string | undefined = undefined;

        token = await getAccessToken(zaloOa);

        if (!token) {
            token = await refreshAccessToken(zaloApp, zaloOa, 10);
        }

        const body = {
            user_id: outboundBody.user_id,
            agent_id: outboundBody.agent_id,
            call_type: outboundBody.call_type,
        };

        const response = await axios.post(API_OUTBOUND, body, {
            headers: {
                'Content-Type': 'application/json',
                access_token: token,
            },
        });

        console.log(11111111, response);
    };
}

export default Handle_Outbound;
