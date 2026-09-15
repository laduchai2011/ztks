import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField } from '@src/dataStruct/account';
import { ForgetPasswordBodyField } from '@src/dataStruct/account/body';
import MutateDB_ForgetPassword from '../../mutateDB/ForgetPassword';
import { prefix_cache_account } from '@src/const/redisKey/account';

class Handle_ForgetPassword {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, ForgetPasswordBodyField>, res: Response) => {
        const forgetPasswordBody = req.body;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_ForgetPassword-main)',
        };

        const mutateDB = new MutateDB_ForgetPassword();
        mutateDB.setForgetPasswordBody(forgetPasswordBody);

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

                const keyDataRedis = `${prefix_cache_account.key.with_id}_${data.id}`;

                const isDel1 = this._serviceRedis.deleteData(keyDataRedis);
                if (!isDel1) {
                    console.error('Failed to delete key in Redis (Handle_ForgetPassword)', keyDataRedis);
                }

                myResponse.message = 'Thay đổi mật khẩu thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Thay đổi mật khẩu KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Thay đổi mật khẩu KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_ForgetPassword;
