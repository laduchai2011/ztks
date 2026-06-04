import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { GetMccInfoBodyField } from '@src/dataStruct/call/body';
import { verifyRefreshToken } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';
import axios from 'axios';
import { getAccessToken, refreshAccessToken } from '@src/zaloToken';
// import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const API_GET_MCC_INFOR = 'https://openapi.zalo.me/v3.0/oa/call/getmccinfo';

class Handle_GetMccInfo {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, GetMccInfoBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<any> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetMccInfo-setup)',
        };

        const getMccInfoBody = req.body;
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
            getMccInfoBody.accountId = id;
            res.locals.getMccInfoBody = getMccInfoBody;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getMccInfoBody = res.locals.getMccInfoBody as GetMccInfoBodyField;
        const zaloApp = getMccInfoBody.zaloApp;
        const zaloOa = getMccInfoBody.zaloOa;

        const myResponse: MyResponse<any> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetMccInfo-main)',
        };

        let token: string | undefined = undefined;

        token = await getAccessToken(zaloOa);

        if (!token) {
            token = await refreshAccessToken(zaloApp, zaloOa, 10);
        }

        const response = await axios.get(
            API_GET_MCC_INFOR,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    access_token: token,
                },
            }
        );

        console.log(2222222222222, response);
    };
}

export default Handle_GetMccInfo;
