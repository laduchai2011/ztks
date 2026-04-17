import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloAppField, PlaywightGetZaloAppField } from '@src/dataStruct/zalo';
import { PlaywightGetZaloAppBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_PlaywightGetZaloApp from '../../queryDB/PlaywightGetZaloApp';
import { SignOptions } from 'jsonwebtoken';
import { generateSocketToken, MyJwtPayload } from '@src/token';

class Handle_PlaywightGetZaloApp {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, PlaywightGetZaloAppBodyField>, res: Response) => {
        const playwightGetZaloAppBody: PlaywightGetZaloAppBodyField = req.body;

        const myResponse: MyResponse<PlaywightGetZaloAppField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_PlaywightGetZaloApp-main !',
        };

        const queryDB = new QueryDB_PlaywightGetZaloApp();
        queryDB.setPlaywightGetZaloAppBody(playwightGetZaloAppBody);

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

            if (result?.recordset.length && result.recordset.length > 0) {
                const zaloApp: ZaloAppField = { ...result?.recordset[0] };
                const myJwtPayload: MyJwtPayload = {
                    id: zaloApp.accountId,
                };
                const signOptions_socketToken: SignOptions = {
                    expiresIn: '1y',
                };
                const socketToken = generateSocketToken(myJwtPayload, signOptions_socketToken);

                myResponse.data = { zaloApp, token: socketToken };
                myResponse.message = 'Lấy thông tin zaloApp thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_PlaywightGetZaloApp;
