import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import MutateDB_Signup from '../../mutateDB/Signup';
import { AccountField } from '@src/dataStruct/account';
import { MyResponse } from '@src/dataStruct/response';

class Handle_Signup {
    private _mssql_server = mssql_server;

    constructor() {}

    isAccountCheckUserName = async (
        req: Request<Record<string, never>, unknown, AccountField>,
        res: Response,
        next: NextFunction
    ) => {
        const signupInfor = req.body;

        await this._mssql_server.init();

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        const mutateDB_signup = new MutateDB_Signup();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_signup.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        mutateDB_signup.set_data(signupInfor);

        const is = await mutateDB_signup.isAccountCheckUserName(signupInfor.userName);

        if (is) {
            myResponse.message = 'Tên người dùng đã được sử dụng !';
            res.status(200).json(myResponse);
        } else {
            next();
        }
    };

    isAccountCheckPhone = async (
        req: Request<Record<string, never>, unknown, AccountField>,
        res: Response,
        next: NextFunction
    ) => {
        const signupInfor = req.body;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const mutateDB_signup = new MutateDB_Signup();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_signup.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        mutateDB_signup.set_data(signupInfor);

        const is = await mutateDB_signup.isAccountCheckPhone(signupInfor.phone);

        if (is) {
            myResponse.message = 'Số điện thoại đã được sử dụng !';
            res.status(200).json(myResponse);
        } else {
            next();
        }
    };

    main = async (req: Request<Record<string, never>, unknown, AccountField>, res: Response) => {
        const signupInfor = req.body;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const mutateDB_signup = new MutateDB_Signup();
        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_signup.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu KHÔNG thành công !';
            res.status(200).json(myResponse);
        }

        if (connection_pool) {
            try {
                mutateDB_signup.set_data(signupInfor);
                const result = await mutateDB_signup.run();
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

export default Handle_Signup;
