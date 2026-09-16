import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { My_Response_Field } from '@src/dataStruct/response';
import { Account_Field } from '@src/dataStruct/account';
import { Check_Forget_Password_Body_Field } from '@src/dataStruct/account/body';
import QueryDB_Check_Forget_Password from '../../queryDB/Check_Forget_Password';

class Handle_Check_Forget_Password {

    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, Check_Forget_Password_Body_Field>, res: Response) => {
        const check_forget_password_body = req.body;

        const my_response: My_Response_Field<Account_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Check_Forget_Password-main)',
        };

        const queryDB = new QueryDB_Check_Forget_Password();
        queryDB.set_Check_Forget_Password_Body(check_forget_password_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.message = 'Tài khoản và mật khẩu đã khớp !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tài khoản hoặc mật khẩu không đúng !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tài khoản hoặc mật khẩu không đúng !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Check_Forget_Password;
