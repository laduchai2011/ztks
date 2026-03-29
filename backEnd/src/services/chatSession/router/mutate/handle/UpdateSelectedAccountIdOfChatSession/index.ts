import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { UpdateSelectedAccountIdOfChatSessionBodyField } from '@src/dataStruct/chatSession/body';
import MutateDB_UpdateSelectedAccountIdOfChatSession from '../../mutateDB/UpdateSelectedAccountIdOfChatSession';
import { verifyRefreshToken } from '@src/token';

class Handle_UpdateSelectedAccountIdOfChatSession {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (
        req: Request<Record<string, never>, any, UpdateSelectedAccountIdOfChatSessionBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<ChatSessionField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_UpdateSelectedAccountIdOfChatSession-setup)',
        };

        const updateSelectedAccountIdOfChatSessionBody = req.body;
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
            const updateSelectedAccountIdOfChatSessionBody_cp = { ...updateSelectedAccountIdOfChatSessionBody };
            updateSelectedAccountIdOfChatSessionBody_cp.accountId = id;
            res.locals.updateSelectedAccountIdOfChatSessionBody = updateSelectedAccountIdOfChatSessionBody_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const updateSelectedAccountIdOfChatSessionBody = res.locals
            .updateSelectedAccountIdOfChatSessionBody as UpdateSelectedAccountIdOfChatSessionBodyField;

        const myResponse: MyResponse<ChatSessionField> = {
            isSuccess: false,
            message: 'Băt đầu cập nhật (Handle_UpdateSelectedAccountIdOfChatSession-main) !',
        };

        const mutateDB = new MutateDB_UpdateSelectedAccountIdOfChatSession();
        mutateDB.setUpdateSelectedAccountIdOfChatSessionBody(updateSelectedAccountIdOfChatSessionBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                myResponse.message = 'Cập nhật UpdateSelectedAccountIdOfChatSession thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Cập nhật UpdateSelectedAccountIdOfChatSession KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Cập nhật UpdateSelectedAccountIdOfChatSession KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_UpdateSelectedAccountIdOfChatSession;
