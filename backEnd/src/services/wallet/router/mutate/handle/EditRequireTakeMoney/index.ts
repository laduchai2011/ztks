import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { EditRequireTakeMoneyBodyField } from '@src/dataStruct/wallet/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_EditRequireTakeMoney from '../../mutateDB/EditRequireTakeMoney';

class Handle_EditRequireTakeMoney {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, EditRequireTakeMoneyBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<RequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditRequireTakeMoney-setup)',
        };

        const editRequireTakeMoneyBody = req.body;
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
            const newEditRequireTakeMoneyBody_cp = { ...editRequireTakeMoneyBody };
            newEditRequireTakeMoneyBody_cp.accountId = id;
            res.locals.editRequireTakeMoneyBody = newEditRequireTakeMoneyBody_cp;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const editRequireTakeMoneyBody = res.locals.editRequireTakeMoneyBody as EditRequireTakeMoneyBodyField;

        const myResponse: MyResponse<RequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditRequireTakeMoney-main)',
        };

        const mutateDB = new MutateDB_EditRequireTakeMoney();
        mutateDB.setEditRequireTakeMoneyBody(editRequireTakeMoneyBody);

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

                myResponse.message = 'Chỉnh sửa yêu cầu rút tiền thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Chỉnh sửa yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Chỉnh sửa yêu cầu rút tiền KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_EditRequireTakeMoney;
