import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Customer_Field } from '@src/data_struct/customer';
import { Customer_Forget_Password_Body_Field } from '@src/data_struct/customer/body';
import MutateDB_Customer_Forget_Password from '../../mutateDB/Customer_Forget_Password';

class Handle_Customer_Forget_Password {
    main = async (req: Request<any, any, Customer_Forget_Password_Body_Field>, res: Response) => {
        const customer_forget_password_body = req.body;

        const my_response: My_Response_Field<Customer_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Customer_Forget_Password-main)',
        };

        const mutateDB = new MutateDB_Customer_Forget_Password();
        mutateDB.set_Customer_Forget_Password_Body(customer_forget_password_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Thay đổi mật khẩu thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Thay đổi mật khẩu KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Thay đổi mật khẩu KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Customer_Forget_Password;
