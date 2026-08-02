import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import crypto from 'crypto';
import { ZaloTrunkField } from '@src/dataStruct/callAgent';
import { CreateZaloTrunkBodyField } from '@src/dataStruct/callAgent/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_CreateZaloTrunk from '../../mutateDB/CreateZaloTrunk';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_CreateZaloTrunk {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, CreateZaloTrunkBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ZaloTrunkField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateZaloTrunk-setup)',
        };

        const createZaloTrunkBody = req.body;
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
            createZaloTrunkBody.accountId = id;
            res.locals.createZaloTrunkBody = createZaloTrunkBody;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createZaloTrunkBody = res.locals.createZaloTrunkBody as CreateZaloTrunkBodyField;

        const myResponse: MyResponse<ZaloTrunkField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateZaloTrunk-main)',
        };

        const uuid = crypto.randomBytes(16).toString('hex');
        createZaloTrunkBody.trunkCode = uuid;
        createZaloTrunkBody.port = '5060';

        const mutateDB = new MutateDB_CreateZaloTrunk();
        mutateDB.setCreateZaloTrunkBody(createZaloTrunkBody);

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
                myResponse.message = 'Tạo zalo-trunk thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo zalo-trunk KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo zalo-trunk KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateZaloTrunk;
