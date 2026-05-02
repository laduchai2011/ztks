import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { LeaveAdminBodyField } from '@src/dataStruct/account/body';
import MutateDB_LeaveAdmin from '../../mutateDB/LeaveAdmin';
import { verifyRefreshToken } from '@src/token';

class Handle_LeaveAdmin {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, LeaveAdminBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<boolean> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_LeaveAdmin-setup) !',
        };

        const leaveAdminBody = req.body;
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
            leaveAdminBody.accountId = id;
            res.locals.leaveAdminBody = leaveAdminBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const leaveAdminBody = res.locals.leaveAdminBody as LeaveAdminBodyField;

        const myResponse: MyResponse<boolean> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_LeaveAdmin-main)',
        };

        const mutateDB = new MutateDB_LeaveAdmin();
        mutateDB.setLeaveAdminBody(leaveAdminBody);

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

                myResponse.message = 'Rời admin thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Rời admin KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Rời admin KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_LeaveAdmin;
