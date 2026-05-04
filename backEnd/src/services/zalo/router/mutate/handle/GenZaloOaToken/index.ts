import { mssql_server } from '@src/connect';
import axios from 'axios';
import qs from 'qs';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { GenZaloOaTokenResultField } from '@src/dataStruct/zalo';
import { GenZaloOaTokenBodyField } from '@src/dataStruct/zalo/body';

class Handle_GenZaloOaToken {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GenZaloOaTokenBodyField>, res: Response) => {
        const genZaloOaTokenBody = req.body;

        const myResponse: MyResponse<GenZaloOaTokenResultField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GenZaloOaToken-main)',
        };

        try {
            const body = qs.stringify({
                app_id: genZaloOaTokenBody.appId,
                grant_type: 'authorization_code',
                code: genZaloOaTokenBody.code,
            });

            const result = await axios.post<GenZaloOaTokenResultField>(
                'https://oauth.zaloapp.com/v4/oa/access_token',
                body,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Secret_key: genZaloOaTokenBody.appSecret,
                    },
                }
            );
            const resultData = result.data;
            if (resultData) {
                myResponse.data = resultData;
                myResponse.message = 'Gen token zaloOa thành công !';
                res.status(500).json(myResponse);
                return;
            } else {
                myResponse.message = 'Gen token zaloOa KHÔNG thành công !';
                res.status(500).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Gen token zaloOa KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GenZaloOaToken;
