import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { DeleteRequireTakeMoneyBodyField } from '@src/dataStruct/wallet/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_DeleteRequireTakeMoney from '../../mutateDB/DeleteRequireTakeMoney';

class Handle_DeleteRequireTakeMoney {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, DeleteRequireTakeMoneyBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<RequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_DeleteRequireTakeMoney-setup)',
        };

        const deleteRequireTakeMoneyBody = req.body;
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
            deleteRequireTakeMoneyBody.accountId = id;
            res.locals.deleteRequireTakeMoneyBody = deleteRequireTakeMoneyBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const deleteRequireTakeMoneyBody = res.locals.deleteRequireTakeMoneyBody as DeleteRequireTakeMoneyBodyField;

        const myResponse: MyResponse<RequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_DeleteRequireTakeMoney-main)',
        };

        const mutateDB = new MutateDB_DeleteRequireTakeMoney();
        mutateDB.setDeleteRequireTakeMoneyBody(deleteRequireTakeMoneyBody);

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

                myResponse.message = 'Xóa yêu cầu rút tiền thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Xóa yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Xóa yêu cầu rút tiền KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_DeleteRequireTakeMoney;
