import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { EditZaloOaBodyField } from '@src/dataStruct/zalo/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_EditZaloOa from '../../mutateDB/EditZaloOa';

class Handle_EditZaloOa {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, EditZaloOaBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ZaloOaField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditZaloOa-setup)',
        };

        const editZaloOaBody = req.body;
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
            editZaloOaBody.accountId = id;
            res.locals.editZaloOaBody = editZaloOaBody;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const editZaloOaBody = res.locals.editZaloOaTokenBody as EditZaloOaBodyField;

        const myResponse: MyResponse<ZaloOaField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditZaloOa-main)',
        };

        const mutateDB = new MutateDB_EditZaloOa();
        mutateDB.setEditZaloOaBody(editZaloOaBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                myResponse.message = 'Chỉnh sửa zaloOa thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Chỉnh sửa zaloOa KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Chỉnh sửa zaloOa KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_EditZaloOa;
