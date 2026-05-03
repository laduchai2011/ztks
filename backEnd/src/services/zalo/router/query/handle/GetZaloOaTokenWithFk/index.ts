import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloOaTokenField } from '@src/dataStruct/zalo';
import { GetZaloOaTokenWithFkBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_GetZaloOaTokenWithFk from '../../queryDB/GetZaloOaTokenWithFk';
import { verifyRefreshToken } from '@src/token';

class Handle_GetZaloOaTokenWithFk {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = (req: Request<any, any, GetZaloOaTokenWithFkBodyField>, res: Response, next: NextFunction) => {
        const getZaloOaTokenWithFkBody: GetZaloOaTokenWithFkBodyField = req.body;

        const myResponse: MyResponse<ZaloOaTokenField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetZaloOaTokenWithFk-setup !',
        };

        const { refreshToken } = req.cookies;

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
            getZaloOaTokenWithFkBody.accountId = id;
            res.locals.getZaloOaTokenWithFkBody = getZaloOaTokenWithFkBody;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getZaloOaTokenWithFkBody = res.locals.getZaloOaTokenWithFkBody as GetZaloOaTokenWithFkBodyField;

        const myResponse: MyResponse<ZaloOaTokenField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetZaloOaTokenWithFk-main !',
        };

        const queryDB = new QueryDB_GetZaloOaTokenWithFk();
        queryDB.setGetZaloOaTokenWithFkBody(getZaloOaTokenWithFkBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const zaloOaToken: ZaloOaTokenField = { ...result?.recordset[0] };

                myResponse.data = zaloOaToken;
                myResponse.message = 'Lấy token zalo oa thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy token zalo oa KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy token zalo oa KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZaloOaTokenWithFk;
