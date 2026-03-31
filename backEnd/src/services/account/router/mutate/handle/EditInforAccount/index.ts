import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField } from '@src/dataStruct/account';
import { EditInforAccountBodyField } from '@src/dataStruct/account/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_EditInforAccount from '../../mutateDB/EditInforAccount';
import { prefix_cache_account } from '@src/const/redisKey/account';

class Handle_EditInforAccount {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, EditInforAccountBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditInforAccount-setup)',
        };

        const editInforAccountBody = req.body;
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
            const editInforAccountBody_cp = { ...editInforAccountBody };
            editInforAccountBody_cp.id = id;
            res.locals.editInforAccountBody = editInforAccountBody_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const editInforAccountBody = res.locals.editInforAccountBody as EditInforAccountBodyField;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_EditInforAccount-main)',
        };

        const mutateDB = new MutateDB_EditInforAccount();
        mutateDB.setEditInforAccountBody(editInforAccountBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        const keyDataRedis = `${prefix_cache_account.key.with_id}_${editInforAccountBody.id}`;

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];

                const isDel1 = this._serviceRedis.deleteData(keyDataRedis);
                if (!isDel1) {
                    console.error('Failed to delete key in Redis (Handle_EditInforAccount)', keyDataRedis);
                }

                myResponse.message = 'Chỉnh sửa thông tin tài khoản thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Chỉnh sửa thông tin tài khoản KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Chỉnh sửa thông tin tài khoản KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_EditInforAccount;
