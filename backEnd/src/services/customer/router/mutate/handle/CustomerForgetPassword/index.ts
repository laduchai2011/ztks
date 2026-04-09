import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CustomerField } from '@src/dataStruct/customer';
import { CustomerForgetPasswordBodyField } from '@src/dataStruct/customer/body';
import MutateDB_CustomerForgetPassword from '../../mutateDB/CustomerForgetPassword';

class Handle_CustomerForgetPassword {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, CustomerForgetPasswordBodyField>, res: Response) => {
        const customerForgetPasswordBody = req.body;

        const myResponse: MyResponse<CustomerField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CustomerForgetPassword-main)',
        };

        const mutateDB = new MutateDB_CustomerForgetPassword();
        mutateDB.setCustomerForgetPasswordBody(customerForgetPasswordBody);

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

export default Handle_CustomerForgetPassword;
