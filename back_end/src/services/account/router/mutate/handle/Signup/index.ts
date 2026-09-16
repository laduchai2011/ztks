import { Request, Response, NextFunction } from 'express';
import MutateDB_Signup from '../../mutateDB/Signup';
import { Account_Field } from '@src/dataStruct/account';
import { My_Response_Field } from '@src/dataStruct/response';

class Handle_Signup {
  
    is_Account_Check_User_Name = async (
        req: Request<Record<string, never>, unknown, Account_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const signup_infor = req.body;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
        };

        const mutateDB = new MutateDB_Signup();
        mutateDB.set_data(signup_infor);

        const is = await mutateDB.is_Account_Check_User_Name(signup_infor.user_name);

        if (is) {
            my_response.message = 'Tên người dùng đã được sử dụng !';
            res.status(200).json(my_response);
            return;
        } else {
            next();
            return;
        }
    };

    is_Account_Check_Phone = async (
        req: Request<any, any, Account_Field>,
        res: Response,
        next: NextFunction
    ) => {
        const signup_infor = req.body;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
        };

        const mutateDB = new MutateDB_Signup();
        mutateDB.set_data(signup_infor);

        const is = await mutateDB.is_Account_Check_Phone(signup_infor.phone);

        if (is) {
            my_response.message = 'Số điện thoại đã được sử dụng !';
            res.status(200).json(my_response);
            return;
        } else {
            next();
            return;
        }
    };

    main = async (req: Request<any, any, Account_Field>, res: Response) => {
        const signupInfor = req.body;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
        };

        const mutateDB = new MutateDB_Signup();

        try {
            mutateDB.set_data(signupInfor);
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Đăng ký thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.json(my_response);
                return;
            } else {
                my_response.message = 'Đăng ký KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Đăng ký thất bại !';
            my_response.err = error;
            res.status(200).json(my_response);
            return;
        }
    };
}

export default Handle_Signup;
