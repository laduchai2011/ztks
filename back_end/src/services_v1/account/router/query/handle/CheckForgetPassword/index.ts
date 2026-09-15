import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField } from '@src/dataStruct/account';
import { CheckForgetPasswordBodyField } from '@src/dataStruct/account/body';
import QueryDB_CheckForgetPassword from '../../queryDB/CheckForgetPassword';

class Handle_CheckForgetPassword {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, CheckForgetPasswordBodyField>, res: Response) => {
        const checkForgetPasswordBody = req.body;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CheckForgetPassword-main)',
        };

        const queryDB = new QueryDB_CheckForgetPassword();
        queryDB.setCheckForgetPasswordBody(checkForgetPasswordBody);

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
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                myResponse.message = 'Tài khoản và mật khẩu đã khớp !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tài khoản hoặc mật khẩu không đúng !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tài khoản hoặc mật khẩu không đúng !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CheckForgetPassword;
