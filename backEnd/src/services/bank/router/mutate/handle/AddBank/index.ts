import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { BankField } from '@src/dataStruct/bank';
import { AddBankBodyField } from '@src/dataStruct/bank/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_AddBank from '../../mutateDB/AddBank';

class Handle_AddBank {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, AddBankBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<BankField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AddBank-setup)',
        };

        const addBankBody = req.body;
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
            addBankBody.accountId = id;
            res.locals.addBankBody = addBankBody;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const addBankBody = res.locals.addBankBody as AddBankBodyField;

        const myResponse: MyResponse<BankField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AddBank-main)',
        };

        const mutateDB = new MutateDB_AddBank();
        mutateDB.setAddBankBody(addBankBody);

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
                myResponse.message = 'Thêm ngân hàng thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Thêm ngân hàng KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Thêm ngân hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_AddBank;
