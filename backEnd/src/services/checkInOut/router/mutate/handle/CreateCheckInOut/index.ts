import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CheckInOutField } from '@src/dataStruct/checkInOut';
import { CreateCheckInOutBodyField } from '@src/dataStruct/checkInOut/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_CreateCheckInOut from '../../mutateDB/CreateCheckInOut';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_CreateCheckInOut {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, CreateCheckInOutBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<CheckInOutField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateCheckInOut-setup)',
        };

        const createCheckInOut = req.body;
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
            createCheckInOut.accountId = id;
            res.locals.createCheckInOut = createCheckInOut;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createCheckInOut = res.locals.createCheckInOut as CreateCheckInOutBodyField;

        const myResponse: MyResponse<CheckInOutField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateCheckInOut-main)',
        };

        const mutateDB = new MutateDB_CreateCheckInOut();
        mutateDB.setCreateCheckInOutBody(createCheckInOut);

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
                myResponse.message = 'Tạo check-in/out thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo check-in/out KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo check-in/out KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateCheckInOut;
