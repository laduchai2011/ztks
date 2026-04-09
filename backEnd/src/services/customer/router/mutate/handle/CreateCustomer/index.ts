import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import MutateDB_CreateCustomer from '../../mutateDB/CreateCustomer';
import { CustomerField } from '@src/dataStruct/customer';
import { CreateCustomerBodyField } from '@src/dataStruct/customer/body';
import { MyResponse } from '@src/dataStruct/response';

class Handle_CreateCustomer {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    isCheckPhone = async (req: Request<any, any, CreateCustomerBodyField>, res: Response, next: NextFunction) => {
        const createCustomerBody = req.body;

        const myResponse: MyResponse<CustomerField> = {
            isSuccess: false,
            message: 'Handle_CreateCustomer-isCheckPhone-begin',
        };

        const mutateDB = new MutateDB_CreateCustomer();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        mutateDB.setCreateCustomerBody(createCustomerBody);

        const is = await mutateDB.isCheckPhone(createCustomerBody.phone);

        if (is) {
            myResponse.message = 'Số điện thoại đã được sử dụng !';
            res.status(200).json(myResponse);
        } else {
            next();
        }
    };

    main = async (req: Request<any, any, CreateCustomerBodyField>, res: Response) => {
        const createCustomerBody = req.body;

        const myResponse: MyResponse<CustomerField> = {
            isSuccess: false,
            message: 'Handle_CreateCustomer-main-begin',
        };

        const mutateDB = new MutateDB_CreateCustomer();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        if (connection_pool) {
            try {
                mutateDB.setCreateCustomerBody(createCustomerBody);
                const result = await mutateDB.run();
                if (result?.recordset.length && result?.recordset.length > 0) {
                    myResponse.message = 'Đăng ký thành công !';
                    myResponse.isSuccess = true;
                    myResponse.data = result?.recordset[0];
                    res.json(myResponse);
                } else {
                    myResponse.message = 'Đăng ký KHÔNG thành công !';
                    res.status(200).json(myResponse);
                }
            } catch (error) {
                myResponse.message = 'Đăng ký thất bại !';
                myResponse.err = error;
                res.status(200).json(myResponse);
            }
        }
    };
}

export default Handle_CreateCustomer;
