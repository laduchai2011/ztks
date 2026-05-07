import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZnsMessageField } from '@src/dataStruct/zalo';
import { CreateZnsMessageBodyField } from '@src/dataStruct/zalo/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_CreateZnsMessage from '../../mutateDB/CreateZnsMessage';
import { sendViaPhone } from './handle';

class Handle_CreateZnsMessage {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, CreateZnsMessageBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ZnsMessageField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateZnsMessage-setup)',
        };

        const createZnsMessageBody = req.body;
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
            createZnsMessageBody.accountId = id;
            res.locals.createZnsMessageBody = createZnsMessageBody;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createZnsMessageBody = res.locals.createZnsMessageBody as CreateZnsMessageBodyField;

        const myResponse: MyResponse<ZnsMessageField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateZnsMessage-main)',
        };

        const r_sendViaPhone = await sendViaPhone(
            createZnsMessageBody.data,
            createZnsMessageBody.zaloApp,
            createZnsMessageBody.zaloOa
        );

        if (r_sendViaPhone.error !== 0) {
            myResponse.message = 'Gửi znsMessage KHÔNG thành công !';
            res.status(200).json(myResponse);
            return;
        }

        const mutateDB = new MutateDB_CreateZnsMessage();
        mutateDB.setCreateZnsMessageBody(createZnsMessageBody);

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
                myResponse.message = 'Tạo znsMessage thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo znsMessage KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo znsMessage KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateZnsMessage;
