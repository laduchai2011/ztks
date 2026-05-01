import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { LeaveAllChatSessionBodyField } from '@src/dataStruct/chatSession/body';
import MutateDB_LeaveAllChatSession from '../../mutateDB/LeaveAllChatSession';
import { verifyRefreshToken } from '@src/token';

class Handle_LeaveAllChatSession {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, LeaveAllChatSessionBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<boolean> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_LeaveAllChatSession-setup) !',
        };

        const leaveAllChatSessionBody = req.body;
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
            leaveAllChatSessionBody.accountId = id;
            res.locals.leaveAllChatSessionBody = leaveAllChatSessionBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const leaveAllChatSessionBody = res.locals.leaveAllChatSessionBody as LeaveAllChatSessionBodyField;

        const myResponse: MyResponse<boolean> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_LeaveAllChatSession-main)',
        };

        const mutateDB = new MutateDB_LeaveAllChatSession();
        mutateDB.setLeaveAllChatSessionBody(leaveAllChatSessionBody);

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

                myResponse.message = 'Rời khỏi tất cả phiên chat thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Rời khỏi tất cả phiên chat KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Rời khỏi tất cả phiên chat KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_LeaveAllChatSession;
