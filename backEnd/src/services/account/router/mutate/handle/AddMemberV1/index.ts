import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountInformationField } from '@src/dataStruct/account';
import { AddMemberV1BodyField } from '@src/dataStruct/account/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_AddMemberV1 from '../../mutateDB/AddMemberV1';

class Handle_AddMemberV1 {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, AddMemberV1BodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<AccountInformationField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AddMemberV1-setup)',
        };

        const addMemberV1Body = req.body;
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
            const addMemberV1Body_cp = { ...addMemberV1Body };
            addMemberV1Body_cp.addedById = id;
            res.locals.addMemberV1Body = addMemberV1Body_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const addMemberV1Body = res.locals.addMemberV1Body as AddMemberV1BodyField;

        const myResponse: MyResponse<AccountInformationField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AddMemberV1-main)',
        };

        const mutateDB = new MutateDB_AddMemberV1();
        mutateDB.setAddMemberV1Body(addMemberV1Body);

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
                myResponse.message = 'Thêm thành viên thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Thêm thành viên KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Thêm thành viên KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_AddMemberV1;
