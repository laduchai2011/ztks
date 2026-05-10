import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZnsTemplateField } from '@src/dataStruct/zalo';
import { GetZnsTemplateWithIdBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_GetZnsTemplateWithId from '../../queryDB/GetZnsTemplateWithId';
import { verifyRefreshToken } from '@src/token';

class Handle_GetZnsTemplateWithId {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = (req: Request<any, any, GetZnsTemplateWithIdBodyField>, res: Response, next: NextFunction) => {
        const getZnsTemplateWithIdBody: GetZnsTemplateWithIdBodyField = req.body;

        const myResponse: MyResponse<ZnsTemplateField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetZnsTemplateWithId-setup !',
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
            getZnsTemplateWithIdBody.accountId = id;
            res.locals.getZnsTemplateWithIdBody = getZnsTemplateWithIdBody;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getZnsTemplateWithIdBody = res.locals.getZnsTemplateWithIdBody as GetZnsTemplateWithIdBodyField;

        const myResponse: MyResponse<ZnsTemplateField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZnsTemplateWithId-main) !',
        };

        const queryDB = new QueryDB_GetZnsTemplateWithId();
        queryDB.setGetZnsTemplateWithIdBody(getZnsTemplateWithIdBody);

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
                const znsTemplate: ZnsTemplateField = { ...result?.recordset[0] };
                myResponse.data = znsTemplate;
                myResponse.message = 'Lấy thông tin znsTemplate thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin znsTemplate KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin znsTemplate KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZnsTemplateWithId;
